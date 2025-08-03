import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { BASE_URL } from '../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';

interface AdminResponse {
    name: string;
    [key: string]: any;
}

const Dashboard = () => {
    const [adminName, setAdminName] = useState<string>('Admin');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdmin = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                const res = await axios.get<AdminResponse>(`${BASE_URL}/auth/getCurrentAdmin`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(res.data, 'resdata');
                setAdminName(res.data.name);
            } catch (error) {
                console.error('Failed to fetch current admin:', error);
            }
        };

        fetchAdmin();
    }, []);

    return (
        <>
            <Navbar />
            <div className="relative">
                <div className="p-4 mx-6 my-2">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-xl font-semibold capitalize">Welcome {adminName}</h1>
                        <button
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() => navigate('/addProduct')}
                        >
                            Add Product
                        </button>
                    </div>
                </div>
                <ProductList />
            </div>
        </>
    );
};

export default Dashboard;
