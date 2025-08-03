import { useState, useRef, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

interface ProductImage {
    id: string;
    url: string;
}

interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    images: ProductImage[];
}

const AddProduct = () => {
    const [sku, setSku] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [existingImagesToRemove, setExistingImagesToRemove] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const productId = localStorage.getItem('pId');
    const isEditMode = Boolean(productId);

    useEffect(() => {
        if (isEditMode) fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await axios.get<{ products: Product[] }>(`${BASE_URL}/api/products/allProducts`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const product = res.data.products.find((p) => p.id.toString() === productId);
            if (product) {
                setSku(product.sku);
                setName(product.name);
                setPrice(product.price.toString());
                setExistingImages(product.images.map((img) => img.url));
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching product');
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImageFiles((prev) => [...prev, ...selectedFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (url: string) => {
        setExistingImagesToRemove((prev) => [...prev, url]);
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sku || !name || !price || (!imageFiles.length && !isEditMode)) {
            alert('All fields and at least one image are required.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('sku', sku);
            formData.append('name', name);
            formData.append('price', price);
            imageFiles.forEach((file) => formData.append('images', file));
            formData.append('removedImages', JSON.stringify(existingImagesToRemove));

            const token = localStorage.getItem('jwtToken');

            if (isEditMode) {
                await axios.put(`${BASE_URL}/api/products/product/${productId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Product updated successfully!');
                localStorage.removeItem('pId');
                navigate('/dashboard');
            } else {
                await axios.post(`${BASE_URL}/api/products/addProduct`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                clearForm();
                alert('Product added successfully!');
            }
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setSku('');
        setName('');
        setPrice('');
        setImageFiles([]);
        setExistingImages([]);
        localStorage.removeItem('pId');
    };

    return (
        <>
            <Navbar />
            <div className="max-w-xl mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Product' : 'Add Product'}</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="SKU"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-3 py-2 rounded capitalize"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <p className="mb-2">Images</p>
                    <div className="flex flex-wrap gap-3">
                        {existingImages.length > 0 && (
                            <div className="flex gap-3 flex-wrap mb-3">
                                {existingImages.map((url, idx) => (
                                    <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                                        <img src={url} alt="existing" className="object-cover w-full h-full" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(url)}
                                            className="absolute top-0 right-0 bg-black bg-opacity-60 text-white px-1 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {imageFiles.map((file, index) => (
                            <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-black text-white px-1 text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <div
                            className="w-24 h-24 border-2 border-dashed flex justify-center items-center rounded cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            +
                        </div>
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                    />

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="submit"
                            className={`flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (isEditMode) {
                                    fetchProductDetails();
                                    setImageFiles([]);
                                    setExistingImagesToRemove([]);
                                } else {
                                    clearForm();
                                }
                            }}
                            disabled={loading}
                            className={`flex-1 bg-white border-2 border-black text-black px-4 py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem('pId');
                                navigate('/dashboard');
                            }}
                            disabled={loading}
                            className={`flex-1 bg-black text-white px-4 py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;
