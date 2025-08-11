import React from 'react';
import Image from 'next/image';
import logo from '@/assets/image/logo.png'

export const Logo = () => (
    <Image
        src={logo} // The path to your image file
        alt="Fitness Platform Logo"
        width={120} // The original width of your image
        height={32} // The original height of your image
        priority // Helps with loading performance for important images
    />
);
