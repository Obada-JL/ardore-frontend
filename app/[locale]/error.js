'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-[#e8b600]">Something went wrong</h1>
        <p className="mb-6 text-gray-300">We apologize for the inconvenience. Please try again later.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#e8b600] text-black hover:bg-white hover:text-[#e8b600] transition-colors duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-[#e8b600] text-[#e8b600] hover:bg-[#e8b600] hover:text-black transition-colors duration-300"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 