import React from 'react';
import Image from 'next/image';
import logo from '@/assets/image/1.jpg'

export const Banner = () => (
    <Image
        src={logo}
        alt="image_a"
        width={1920}
        height={1080}
        priority
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        
    />
);
