import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/home/components/Navbar'; // Assuming components are in 'src/components'
import { Footer } from '@/components/home/components/Footer'; // Assuming components are in 'src/components'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-500 text-white">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center h-[calc(100vh-4rem)]">
           <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              The Ultimate Fitness Management Platform
            </h1>
            <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your gym operations, manage members, and grow your business with our all-in-one solution.
            </p>
            <div className="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/sign-up" passHref>
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 md:py-4 md:text-lg md:px-10">
                    Get started
                  </button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/contact" passHref>
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10">
                    Contact Sales
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
