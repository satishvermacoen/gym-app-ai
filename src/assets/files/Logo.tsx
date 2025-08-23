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

export const GoogleIcon = () => (
    <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.4 0 129.2 110.3 20 244 20c66.2 0 125.4 26.6 168.4 69.9l-67.6 64.9C314.6 125.6 282.5 112 244 112c-88.6 0-160.1 71.7-160.1 159.4s71.5 159.4 160.1 159.4c100.2 0 133.4-86.3 136.2-127.3H244v-75.2h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path>
    </svg>
);