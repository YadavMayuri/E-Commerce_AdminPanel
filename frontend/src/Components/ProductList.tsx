import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import IconLoader from './IconLoader';
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);


    const preloadImages = (products: Product[]) => {
        const promises: Promise<void>[] = [];

        products.forEach((product) => {
            product.images.forEach((image) => {
                promises.push(
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = image.url;
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); 
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
            const res = await axios.get(`${BASE_URL}/api/products/allProducts`, {
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

    const handleDelete = (id: number) => {
        setSelectedProductId(id);
        setShowConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProductId) return;
        setDeleting(true);

        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.delete(`${BASE_URL}/api/products/deleteProduct/${selectedProductId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts((prev) => prev.filter((p) => p.id !== selectedProductId));
            toast.success(response.data.message);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong.');
        } finally {
            setShowConfirm(false);
            setSelectedProductId(null);
            setDeleting(false);
        }
    };

    const singleProductHandle = (product: Product) => {
        navigate("/singleProduct", { state: { product } });
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
                                    <tr key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => singleProductHandle(product)}>
                                        <td className="py-2 px-4 border">{index + 1}</td>
                                        <td className="py-2 px-4 border">{product.sku}</td>
                                        <td className="py-2 px-4 border">{product.name}</td>
                                        <td className="py-2 px-4 border">₹ {product.price}</td>
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
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        handleEdit(product.id);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(product.id);
                                                    }}
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

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6 text-sm text-gray-600">Are you sure you want to delete this product?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-2 min-w-[85px]"
                                disabled={deleting}
                            >
                                {deleting && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {!deleting && 'Delete'}
                            </button>

                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ProductList;
