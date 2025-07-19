'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-[#e8b600]">404 - Page Not Found</h1>
        <p className="mb-6 text-gray-300">The page you are looking for does not exist or the language is not supported.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tr"
            className="px-6 py-3 bg-[#e8b600] text-black hover:bg-white hover:text-[#e8b600] transition-colors duration-300"
          >
            Türkçe Versiyon
          </Link>
          <Link
            href="/ar"
            className="px-6 py-3 border border-[#e8b600] text-[#e8b600] hover:bg-[#e8b600] hover:text-black transition-colors duration-300"
          >
            النسخة العربية
          </Link>
        </div>
      </div>
    </div>
  );
} 