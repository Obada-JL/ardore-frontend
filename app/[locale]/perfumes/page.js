"use client"
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_ENDPOINTS, categoryAPI } from '../../../lib/api';

export default function PerfumesPage() {
  const t = useTranslations('perfumes');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const isRTL = locale === 'ar';
  const [perfumes, setPerfumes] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[locale] || textObj.en || textObj.ar || textObj.tr || '';
    }
    return '';
  };

  // Helper function to get price display for a perfume
  const getPerfumePriceDisplay = (perfume) => {
    if (perfume.sizesPricing && perfume.sizesPricing.length > 0) {
      const prices = perfume.sizesPricing.map(sp => sp.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return `₺${minPrice}`;
      } else {
        return `₺${minPrice} - ₺${maxPrice}`;
      }
    }
    // Fallback to old structure
    return `₺${perfume.price || 0}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category info if category slug is provided
        if (categorySlug) {
          const category = await categoryAPI.getCategory(categorySlug);
          setCurrentCategory(category);
        }
        
        // Build perfumes URL with category filter if needed
        const perfumesUrl = categorySlug 
          ? `${API_ENDPOINTS.GET_PERFUMES}?category=${categorySlug}`
          : API_ENDPOINTS.GET_PERFUMES;
        
        const response = await fetch(perfumesUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch perfumes');
        }
        const data = await response.json();
        setPerfumes(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-black flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8b600] mx-auto mb-4"></div>
          <p className={isRTL ? 'text-gray-400' : 'text-gray-600'}>Loading perfumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-black ${isRTL ? 'bg-gradient-to-b from-black to-[#050505] text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#e8b600] text-black rounded hover:bg-[#d4a500] transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black ${isRTL ? 'bg-gradient-to-b from-black to-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div className={`relative py-24 overflow-hidden ${isRTL ? 'bg-gradient-to-r from-black via-[#1a1a1a] to-black' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'}`}>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className={`text-5xl md:text-7xl font-light mb-6 ${isRTL ? 'text-[#e8b600]' : 'text-white'}`}>
            {currentCategory ? getLocalizedText(currentCategory.name) : t('title')}
          </h1>
          <div className="w-32 h-0.5 bg-[#e8b600] mx-auto mb-6"></div>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isRTL ? 'text-gray-300' : 'text-gray-300'}`}>
            {currentCategory ? getLocalizedText(currentCategory.description) : t('subtitle')}
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#e8b600] rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#e8b600] rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#e8b600] rounded-full animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-16">
        {perfumes.length === 0 ? (
          <div className="text-center py-16">
            <p className={`text-lg ${isRTL ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('noProducts')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perfumes.map((perfume) => (
              <Link 
                href={`/perfume/${perfume.urlName}`} 
                key={perfume._id}
                className="group"
              >
                <div className={`relative overflow-hidden rounded-lg transition-all duration-500 ${
                  isRTL 
                    ? 'bg-black/30 backdrop-blur-sm border border-[#e8b600]/20 hover:border-[#e8b600]/40' 
                    : 'bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-[#e8b600]/40'
                }`}>
                  <div className="aspect-square relative">
                    <img 
                      src={perfume.image ? `https://api.ardoreperfume.com/${perfume.image}` : 'https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg'} 
                      alt={getLocalizedText(perfume.title)}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isRTL 
                        ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
                        : 'bg-gradient-to-t from-white/80 via-white/20 to-transparent'
                    }`}></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`text-xl font-light text-[#e8b600] mb-2`}>
                      {getLocalizedText(perfume.title)}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      isRTL ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {getLocalizedText(perfume.description)}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#e8b600] font-semibold">
                        {getPerfumePriceDisplay(perfume)}
                      </span>
                      <span className="text-[#e8b600] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <i className="fas fa-arrow-right"></i>
                      </span>
                    </div>
                    
                    {/* Size badges if available */}
                    {perfume.sizesPricing && perfume.sizesPricing.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {perfume.sizesPricing.map((sizePrice, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-[#e8b600]/10 text-[#e8b600] px-2 py-1 rounded-full"
                            title={`${sizePrice.size}ml - ₺${sizePrice.price}`}
                          >
                            {sizePrice.size}ml
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover border animation */}
                  <div className="absolute inset-0 border border-[#e8b600]/0 group-hover:border-[#e8b600]/30 transition-all duration-500"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Background Elements - Only for Arabic/RTL */}
      {isRTL && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
        </div>
      )}
    </div>
  );
} 