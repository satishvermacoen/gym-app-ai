import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ModeToggle } from '../../mode-toggle';
import { Button } from '../../ui/button';



export const Navbar = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md shadow-sm">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0 size-15">
          <Link href="/" className="flex items-center space-x-2">
            <Logo/>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/login" passHref>
            <Button className="px-4 py-2 text-sm font-medium text-gray-600 bg-transparent rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
              Login
            </Button>
          </Link>
          <Link href="/sign-up" passHref>
            <Button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors">
              Sign Up
            </Button>
          </Link>
        <ModeToggle />
        </div>
      </div>
    </div>
  </header>
);
