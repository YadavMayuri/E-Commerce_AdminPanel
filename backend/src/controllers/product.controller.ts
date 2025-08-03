import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

import streamifier from 'streamifier';

import { AppDataSource } from '../config/ormconfig';
import { Product } from '../entities/Product';
import { ProductImage } from '../entities/ProductImage';
import { Admin } from '../entities/Admin';
import { AuthRequest } from '../middlewares/auth.middleware';

export const addProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { sku, name, price } = req.body;
        const files = req.files as Express.Multer.File[];
        const adminId = req.userId;

        if (!sku || !name || !price || !files || files.length === 0) {
            return res.status(400).json({ message: 'All fields and images are required.' });
        }

        const adminRepo = AppDataSource.getRepository(Admin);
        const productRepo = AppDataSource.getRepository(Product);
        const imageRepo = AppDataSource.getRepository(ProductImage);

        const admin = await adminRepo.findOneBy({ id: adminId });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const product = productRepo.create({ sku, name, price, admin });
        await productRepo.save(product);


        const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'products',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve(result.secure_url);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };

        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const url = await uploadToCloudinary(file);
                const img = imageRepo.create({ url, product });
                return imageRepo.save(img);
            })
        );

        return res.status(201).json({
            message: 'Product created successfully',
            product: {
                id: product.id,
                sku: product.sku,
                name: product.name,
                price: product.price,
                images: uploadedImages.map((img) => img.url),
            },
        });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getAllProductsByAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const adminId = req.userId;
        const productRepo = AppDataSource.getRepository(Product);

        const [products, totalCount] = await productRepo.findAndCount({
            where: { admin: { id: adminId } },
            relations: ['images'],
        });

        return res.status(200).json({
            message: "Products Fetched Successfully", totalProducts: totalCount,
            products: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { sku, name, price } = req.body;
        const productId = req.params.id;
        const files = req.files as Express.Multer.File[];
        const adminId = req.userId;

        const productRepo = AppDataSource.getRepository(Product);
        const imageRepo = AppDataSource.getRepository(ProductImage);
        const adminRepo = AppDataSource.getRepository(Admin);

        const product = await productRepo.findOne({
            where: { id: parseInt(productId), admin: { id: adminId } },
            relations: ['images'],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update basic fields
        product.sku = sku || product.sku;
        product.name = name || product.name;
        product.price = price || product.price;
        await productRepo.save(product);

        // Delete old images
        await imageRepo.remove(product.images);

        // Upload new images if provided
        const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products', resource_type: 'image' },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve(result.secure_url);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };

        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const url = await uploadToCloudinary(file);
                const img = imageRepo.create({ url, product });
                return imageRepo.save(img);
            })
        );

        return res.status(200).json({
            message: 'Product updated successfully',
            product: {
                id: product.id,
                sku: product.sku,
                name: product.name,
                price: product.price,
                images: uploadedImages.map((img) => img.url),
            },
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const productId = req.params.id;
        const adminId = req.userId;

        const productRepo = AppDataSource.getRepository(Product);

        const product = await productRepo.findOne({
            where: { id: parseInt(productId), admin: { id: adminId } },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await productRepo.remove(product);
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
