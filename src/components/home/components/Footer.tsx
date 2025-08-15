import React from 'react';
import Link from 'next/link';

export const Footer = () => (
    <footer className="bg-white border-t">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Fitness Platform Inc. All rights reserved.</p>
                </div>
                <div className="flex space-x-6">
                    <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link>
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link>
                    <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
                </div>
            </div>
        </div>
    </footer>
);
