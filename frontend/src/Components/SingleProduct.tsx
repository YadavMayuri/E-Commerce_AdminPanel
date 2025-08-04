import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface Image {
    id: string;
    url: string;
}

interface Product {
    sku: string;
    name: string;
    price: number;
    images: Image[];
}

interface LocationState {
    product?: Product;
}

const SingleProduct = () => {
    const location = useLocation();
    const state = location.state as LocationState;
    const product = state?.product;

    const [selectedImg, setSelectedImg] = useState<string>('');
    const navigate = useNavigate()

    useEffect(() => {
        if (product && Array.isArray(product.images) && product.images.length > 0) {
            setSelectedImg(product.images[0].url);
        }
    }, [product]);


    if (!product) {
        return <div className="p-6 text-center text-gray-500">No product data available.</div>;
    }

    return (
        <>
            <Navbar />
            <div className="py-6">
                <div className=" p-6 rounded-md  flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2 flex flex-col items-center">
                        <div className="w-72 h-72 border rounded overflow-hidden mb-6">
                            <img src={selectedImg} alt="Selected" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex gap-2 flex-wrap justify-center">
                            {product.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.url}
                                    alt="Thumbnail"
                                    onClick={() => setSelectedImg(img.url)}
                                    className={`w-16 h-16 border rounded object-cover cursor-pointer ${selectedImg === img.url ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-between">
                        <div>
                            <h1 className="font-bold text-[40px] capitalize">{product.name}</h1>
                            <div className="text-base text-[20px] mt-4">
                                <span className="font-semibold">SKU:</span> {product.sku}
                            </div>

                            <div className="text-base text-[20px] mt-4">
                                <span className="font-semibold">Price:</span> ₹ {product.price}
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className={`flex-1 bg-black text-white px-8 py-2 rounded mt-6`}
                            >
                                Back
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </>

    );
};

export default SingleProduct;
