import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import toast from 'react-hot-toast';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string): boolean => {
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const typos = ['gmmail.com', 'gmial.com', 'gnail.com'];
    const domain = email.split('@')[1];
    return basicEmailRegex.test(email) && !typos.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      toast.error('Please fill all the fields.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Invalid email. Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, formData);
      console.log('Registration successful:', response.data);
      toast.success('Registered successfully!');
      navigate('/');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
      console.error('Registration failed:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-0 focus:outline-none focus:border-blue-400 capitalize"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-0 focus:outline-none focus:border-purple-400"
              value={formData.email}
              onChange={handleChange}
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
            />
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {!loading && 'Sign Up'}
          </button>


          <p className="mt-4 text-center text-[13px] text-gray-600">
            Already have an account?{' '}
            <span
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-medium hover:underline cursor-pointer"
              onClick={() => navigate('/')}
            >
              Sign in here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
