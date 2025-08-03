// src/components/Navbar.tsx
import {
    Disclosure,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const [adminName, setAdminName] = useState<string>('');
    const [adminEmail, setAdminEmail] = useState<string>('');

    const navigate = useNavigate()


    useEffect(() => {
        const fetchAdmin = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            try {
                const res = await axios.get(`${BASE_URL}/api/auth/getCurrentAdmin`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(res.data, "resdata");

                setAdminName(res.data.name);
                setAdminEmail(res.data.email)
            } catch (error) {
                console.error('Failed to fetch current admin:', error);
            }
        };

        fetchAdmin();
    }, []);


    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };


    const logout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/');
        alert('Logged out successfully!');
    };


    return (
        <Disclosure as="nav" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Logo and navigation */}
                    <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center mx-4 sm:mx-0">
                            <span className='font-bold text-[22px]'> Admin Panel</span>
                        </div>
                    </div>

                    {/* Right-side icons */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                        {/* Profile Dropdown */}

                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 text-sm text-white font-semibold focus:outline-none ">
                                    <span className="sr-only">Open user menu</span>
                                    {getInitials(adminName)}
                                </MenuButton>
                            </div>

                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem>
                                    {adminName && (
                                        <span
                                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize'   >
                                            Hi, {adminName}
                                        </span>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {adminEmail && (
                                        <span
                                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                            {adminEmail}
                                        </span>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    <span
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={logout}>
                                        Sign out
                                    </span>
                                </MenuItem>

                            </MenuItems>
                        </Menu>

                    </div>
                </div>
            </div>



        </Disclosure>
    )
}

export default Navbar
