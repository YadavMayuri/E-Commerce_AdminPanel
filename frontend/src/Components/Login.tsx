import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email: string) => {
        const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const typos = ['gmmail.com', 'gmial.com', 'gnail.com'];

        const domain = email.split('@')[1];
        if (!basicEmailRegex.test(email)) return false;
        if (typos.includes(domain)) return false;

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            alert('Invalid email. Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, formData);
            console.log('Login successful:', response.data);

             localStorage.setItem('jwtToken', response.data.token);

            alert('Login successful!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login failed:', error.response?.data || error.message);
            const errorMessage =
                error.response?.data?.message || error.response?.data || 'Login failed. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">

                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-0 focus:outline-none focus:border-purple-400"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-0 focus:outline-none focus:border-pink-400 mb-2"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition font-semibold mt-2"
                    >
                        Sign In
                    </button>

                    <p className="mt-4 text-center text-[13px] text-gray-600">
                        Don't have an account?{' '}
                        <span
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-medium underline cursor-pointer"
                            onClick={() => navigate('/register')}
                        >
                            Sign up here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
