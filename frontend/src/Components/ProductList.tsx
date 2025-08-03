import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import IconLoader from './IconLoader';
import { Pencil, Trash2 } from 'lucide-react'; // Optional icons from lucide-react
import { useNavigate } from 'react-router-dom';

interface ProductImage {
    id: number;
    url: string;
}

interface Product {
    id: number;
    sku: string;
    name: string;
    price: number;
    images: ProductImage[];
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const preloadImages = (products: Product[]) => {
        const promises: Promise<void>[] = [];

        products.forEach((product) => {
            product.images.forEach((image) => {
                promises.push(
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = image.url;
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); // prevent blocking on error
                    })
                );
            });
        });

        return Promise.all(promises);
    };

    const fetchProducts = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/products/allProducts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const productsData = res.data.products || [];
            await preloadImages(productsData);
            setProducts(productsData);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (id: number) => {
        console.log('Edit product with id:', id);
        localStorage.setItem("pId", JSON.stringify(id))
        navigate('/addProduct')
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('jwtToken');
        try {
            await axios.delete(`${BASE_URL}/products/deleteProduct/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="p-4 mx-6">
            <h2 className="text-lg font-bold mb-4">All Products</h2>

            {loading ? (
                <IconLoader />
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[100%] bg-white border rounded-md">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-4 border">Sr No.</th>
                                <th className="py-2 px-4 border">SKU</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Price</th>
                                <th className="py-2 px-4 border">Images</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-gray-500">
                                        No products available.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{index + 1}</td>
                                        <td className="py-2 px-4 border">{product.sku}</td>
                                        <td className="py-2 px-4 border">{product.name}</td>
                                        <td className="py-2 px-4 border">₹{product.price}</td>
                                        <td className="py-2 px-4 border">
                                            <div className="flex flex-nowrap gap-3 overflow-x-auto min-w-[250px] sm:min-w-0">
                                                {product.images.map((img) => (
                                                    <img
                                                        key={img.id}
                                                        src={img.url}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded border shrink-0"
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <div className="flex gap-3 justify-evenly">
                                                <button
                                                    onClick={() => handleEdit(product.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            )}

        </div>
    );
};

export default ProductList;
