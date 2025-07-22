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
  const isDarkTheme = locale === 'ar' || locale === 'tr'; // Both Arabic and Turkish use dark theme
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
      <div className="min-h-screen bg-black bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#e8b600] border-r-[#e8b600] mx-auto mb-6 shadow-lg shadow-[#e8b600]/20"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-b-[#e8b600]/30 border-l-[#e8b600]/30 animate-pulse"></div>
          </div>
          <p className="text-gray-300 text-lg font-light tracking-wide">Loading perfumes...</p>
          <div className="mt-4 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#e8b600] to-transparent mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-black from-black via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border border-red-500/30">
              <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
            </div>
          </div>
          <p className="text-red-400 mb-6 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-[#e8b600] to-[#d4a500] text-black rounded-full font-semibold hover:from-[#d4a500] hover:to-[#c19400] transition-all duration-300 shadow-lg shadow-[#e8b600]/25 hover:shadow-[#e8b600]/40 transform hover:scale-105"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a] to-black"></div>
        
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#e8b600]/5 filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-[#e8b600]/3 filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#e8b600]/2 filter blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#e8b600] rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#e8b600] rounded-full animate-pulse delay-1000 opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#e8b600] rounded-full animate-pulse delay-2000 opacity-50"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[#e8b600] rounded-full animate-pulse delay-3000 opacity-30"></div>
          <div className="absolute bottom-1/2 right-2/3 w-2 h-2 bg-[#e8b600] rounded-full animate-pulse delay-4000 opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className={`text-6xl md:text-8xl font-extralight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#e8b600] via-[#f4c430] to-[#e8b600] tracking-wider ${isRTL ? 'font-arabic' : ''}`}>
            {currentCategory ? getLocalizedText(currentCategory.name) : t('title')}
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-40 h-px bg-gradient-to-r from-transparent via-[#e8b600] to-transparent"></div>
          </div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-gray-300 font-light tracking-wide">
            {currentCategory ? getLocalizedText(currentCategory.description) : t('subtitle')}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        {perfumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-700/20 to-gray-800/20 flex items-center justify-center border border-gray-600/30">
                <i className="fas fa-search text-gray-400 text-3xl"></i>
              </div>
            </div>
            <p className="text-xl text-gray-400 font-light">
              {t('noProducts')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {perfumes.map((perfume) => (
              <Link 
                href={`/perfume/${perfume.urlName}`} 
                key={perfume._id}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl transition-all duration-700 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#e8b600]/10 hover:border-[#e8b600]/30 backdrop-blur-sm shadow-2xl hover:shadow-[#e8b600]/20 transform hover:scale-105">
                  
                  {/* Image container with enhanced effects */}
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={perfume.image ? `https://api.ardoreperfume.com/${perfume.image}` : 'https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg'} 
                      alt={getLocalizedText(perfume.title)}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Hover icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#e8b600]/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <i className="fas fa-arrow-right text-[#e8b600] text-sm"></i>
                    </div>
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-light text-[#e8b600] mb-3 group-hover:text-[#f4c430] transition-colors duration-300">
                      {getLocalizedText(perfume.title)}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2 text-gray-400 leading-relaxed">
                      {getLocalizedText(perfume.description)}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#e8b600] font-semibold text-lg">
                        {getPerfumePriceDisplay(perfume)}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#e8b600]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-0 group-hover:rotate-45">
                        <i className="fas fa-plus text-[#e8b600] text-xs"></i>
                      </div>
                    </div>
                    
                    {/* Enhanced size badges */}
                    {perfume.sizesPricing && perfume.sizesPricing.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {perfume.sizesPricing.map((sizePrice, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gradient-to-r from-[#e8b600]/10 to-[#e8b600]/5 text-[#e8b600] px-3 py-1.5 rounded-full border border-[#e8b600]/20 hover:border-[#e8b600]/40 transition-colors duration-300"
                            title={`${sizePrice.size}ml - ₺${sizePrice.price}`}
                          >
                            {sizePrice.size}ml
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#e8b600]/20 transition-all duration-500"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e8b600]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-[#e8b600]/8 to-[#e8b600]/2 filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-tl from-[#e8b600]/6 to-transparent filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#e8b600]/3 filter blur-3xl animate-pulse delay-4000"></div>
        
        {/* Additional ambient effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[#e8b600]/1 to-transparent"></div>
      </div>
      
      {/* Floating particles animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#e8b600] rounded-full animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
} 