import React, { useEffect, useState } from 'react';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import DevicesIcon from '@mui/icons-material/Devices';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const IconLoader: React.FC = () => {
    const iconList: React.ReactNode[] = [
        <LocalMallIcon sx={{ fontSize: 50, color: '#1976d2' }} key="mall" />,
        <StorefrontIcon sx={{ fontSize: 50, color: '#FF5722' }} key="store" />,
        <ShoppingCartIcon sx={{ fontSize: 50, color: 'black' }} key="cart" />,
        <HeadphonesIcon sx={{ fontSize: 50, color: 'purple' }} key="headphone" />,
        <DevicesIcon sx={{ fontSize: 50, color: 'black' }} key="device" />,
        <FavoriteBorderIcon sx={{ fontSize: 50, color: 'red' }} key="favourite" />,

    ];

    const [current, setCurrent] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % iconList.length);
        }, 600);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.icon}>
                {iconList[current]}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        top: '64px', // Push loader down below navbar
        left: 0,
        width: '100%',
        height: 'calc(100% - 64px)', // Adjust height so it doesn’t overflow
        backgroundColor: '#ffffffcc',
        zIndex: 40, // lower than navbar if navbar is z-50
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        transition: 'all 0.4s ease-in-out',
    },
};

export default IconLoader;