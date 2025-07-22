"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Footer from '../../components/Footer';
import Navbar from '../../../components/Navbar';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { API_ENDPOINTS } from '../../../../lib/api';
import { useOrder } from '../../../context/OrderContext';
import { useFavorites } from '../../../context/FavoritesContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function PerfumeDetails() {
  const t = useTranslations('perfume');
  const locale = useLocale();
  const params = useParams();
  const { urlName } = params;
  const { addToCart } = useOrder();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [perfume, setPerfume] = useState(null);
  const [relatedPerfumes, setRelatedPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('Original');
  const [isScrolled, setIsScrolled] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const chartRef = useRef(null);
  const rtl = locale === 'ar';

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[locale] || textObj.en || textObj.ar || textObj.tr || '';
    }
    return '';
  };

  // Helper function to get price for specific size
  const getPriceForSize = (size) => {
    if (perfume?.sizesPricing && perfume.sizesPricing.length > 0) {
      const sizePricing = perfume.sizesPricing.find(sp => sp.size === size);
      return sizePricing ? sizePricing.price : null;
    }
    // Fallback to old structure
    return perfume?.price || 0;
  };

  // Helper function to get current price based on selected size
  const getCurrentPrice = () => {
    if (selectedSize && perfume?.sizesPricing) {
      return getPriceForSize(selectedSize);
    }
    return perfume?.price || 0;
  };

  // Helper function to get available sizes
  const getAvailableSizes = () => {
    if (perfume?.sizesPricing && perfume.sizesPricing.length > 0) {
      return perfume.sizesPricing.map(sp => sp.size);
    }
    // Fallback to old structure
    return perfume?.sizes || [];
  };

  // Helper function to get price range for display
  const getPriceRange = () => {
    if (perfume?.sizesPricing && perfume.sizesPricing.length > 0) {
      const prices = perfume.sizesPricing.map(sp => sp.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return `$${minPrice}`;
      } else {
        return `$${minPrice} - $${maxPrice}`;
      }
    }
    return `$${perfume?.price || 0}`;
  };

  useEffect(() => {
    const fetchPerfume = async () => {
      if (!urlName) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_ENDPOINTS.GET_PERFUME_BY_URL(urlName));
        
        if (!response.ok) {
          throw new Error('Perfume not found');
        }
        
        const data = await response.json();
        setPerfume(data);
        
        // Fetch related perfumes (random selection for now)
        try {
          const relatedResponse = await fetch(API_ENDPOINTS.GET_PERFUMES);
          const allPerfumes = await relatedResponse.json();
          const filtered = allPerfumes.filter(p => p._id !== data._id);
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setRelatedPerfumes(shuffled.slice(0, 3));
        } catch (relatedError) {
          console.error('Error fetching related perfumes:', relatedError);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPerfume();
  }, [urlName]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Initialize ECharts
  useEffect(() => {
    if (chartRef.current && activeTab === 'notes' && perfume) {
      const myChart = echarts.init(chartRef.current);
      
      const option = {
        backgroundColor: 'transparent',
        radar: {
          indicator: [
            { name: t('notes.intensity'), max: 100 },
            { name: t('notes.longevity'), max: 100 },
            { name: t('notes.projection'), max: 100 },
            { name: t('notes.freshness'), max: 100 },
            { name: t('notes.warmth'), max: 100 },
            { name: t('notes.complexity'), max: 100 }
          ],
          nameGap: 25,
          splitNumber: 4,
          axisNameGap: 10,
          shape: 'polygon',
          splitArea: {
            areaStyle: {
              color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(232, 182, 0, 0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(232, 182, 0, 0.2)'
            }
          }
        },
        series: [
          {
            name: 'Fragrance Profile',
            type: 'radar',
            data: [
              {
                value: [85, 90, 75, 70, 95, 80],
                name: t('notes.fragranceProfile'),
                areaStyle: {
                  color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                    {
                      color: 'rgba(232, 182, 0, 0.5)',
                      offset: 0
                    },
                    {
                      color: 'rgba(232, 182, 0, 0.1)',
                      offset: 1
                    }
                  ])
                },
                lineStyle: {
                  width: 2,
                  color: '#e8b600'
                },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                  color: '#e8b600'
                }
              }
            ]
          }
        ]
      };
      
      myChart.setOption(option);
      
      // Cleanup
      return () => {
        myChart.dispose();
      };
    }
  }, [chartRef, activeTab, t, perfume]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const toggleLike = async () => {
    if (!perfume) return;
    
    setFavoriteLoading(true);
    try {
      await toggleFavorite(perfume);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Check if perfume is favorited
  const isLiked = perfume ? isFavorite(perfume._id) : false;

  // Set default size when perfume loads
  useEffect(() => {
    if (perfume && !selectedSize) {
      const availableSizes = getAvailableSizes();
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      }
    }
  }, [perfume, selectedSize]);

  const handleAddToCart = async () => {
    if (!perfume) return;
    
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setAddToCartLoading(true);
    try {
      await addToCart(perfume, quantity, selectedSize, selectedQuality);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddToCartLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-b from-black to-[#050505] text-white flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8b600] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading perfume...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-b from-black to-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
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

  // If no perfume data
  if (!perfume) {
    return (
      <div className="min-h-screen bg-black bg-gradient-to-b from-black to-[#050505] text-white flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-gray-400">Perfume not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-b from-black to-[#050505] text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-black flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 z-30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen bg-black py-12 sm:py-16 lg:py-20">
            {/* Product Details */}
            <div className="opacity-0 animate-fade-in-up order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-[#e8b600] mb-3 sm:mb-4">{getLocalizedText(perfume.title)}</h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 text-gray-200 leading-relaxed">{getLocalizedText(perfume.description)}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div>
                  <p className="text-2xl sm:text-3xl font-light text-[#e8b600]">
                    {selectedSize ? `$${getCurrentPrice()}` : getPriceRange()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {selectedSize ? `${selectedSize}ml ${getLocalizedText(perfume.sizeType)}` : 'Select size for price'}
                  </p>
                </div>
                
                <div className="flex items-center border border-[#e8b600]/40 rounded-none bg-black/30 backdrop-blur-sm w-fit">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 sm:px-4 py-2 sm:py-3 text-[#e8b600] transition-all duration-300 hover:bg-[#e8b600]/10"
                  >
                    <i className="fas fa-minus text-sm"></i>
                  </button>
                  <span className="px-3 sm:px-4 py-2 sm:py-3 min-w-[40px] text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 sm:px-4 py-2 sm:py-3 text-[#e8b600] transition-all duration-300 hover:bg-[#e8b600]/10"
                  >
                    <i className="fas fa-plus text-sm"></i>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={addToCartLoading || !selectedSize}
                  className="bg-[#e8b600] text-black font-medium px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-base sm:text-lg hover:bg-white hover:text-[#e8b600] transition-all duration-300 shadow-lg shadow-[#e8b600]/20 transform hover:-translate-y-1 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <span className="relative z-10">
                    {addToCartLoading ? 'Adding...' : t('addToCart')}
                  </span>
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </button>
                <div className="flex gap-3 sm:gap-4">
                  <button 
                    onClick={toggleLike}
                    disabled={favoriteLoading}
                    className="border border-[#e8b600]/40 bg-black/20 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 hover:bg-[#e8b600]/10 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
                  >
                    <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-[#e8b600] text-base sm:text-lg ${favoriteLoading ? 'animate-pulse' : ''}`}></i>
                  </button>
                  <button className="border border-[#e8b600]/40 bg-black/20 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 hover:bg-[#e8b600]/10 transition-all duration-300 transform hover:-translate-y-1">
                    <i className="fas fa-share-alt text-[#e8b600] text-base sm:text-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Product Image */}
            <div className="relative opacity-0 animate-fade-in-up animation-delay-300 order-1 lg:order-2">
              <div className="relative group">
                <img 
                  src={perfume.sliderImages && perfume.sliderImages[0] ? `${API_ENDPOINTS.BASE_URL}/${perfume.sliderImages[0]}` : "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg"} 
                  alt={getLocalizedText(perfume.title)} 
                  className="w-full h-auto max-w-sm sm:max-w-md lg:max-w-lg mx-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e8b600]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-5 sm:-top-10 -right-5 sm:-right-10 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-60"></div>
              <div className="absolute -bottom-5 sm:-bottom-10 -left-5 sm:-left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Navigation */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#e8b600]/20">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-center space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto">
            {['overview', 'notes', 'ingredients'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-2 px-3 sm:px-4 transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab
                    ? 'text-[#e8b600] border-b-2 border-[#e8b600]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-black">
        {/* Overview Section */}
        {activeTab === 'overview' && (
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#e8b600] mb-4 sm:mb-6 relative inline-block">
                  {t('overview.title')}
                  <div className="w-1/2 h-0.5 bg-[#e8b600]/50 absolute -bottom-2 left-0"></div>
                </h2>
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  {getLocalizedText(perfume.about)}
                </p>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {getLocalizedText(perfume.productInfo)}
                </p>
                
                {perfume.features && perfume.features.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {perfume.features.map((feature, index) => (
                      <div key={index} className="border border-[#e8b600]/30 p-4 sm:p-6 bg-black/20 backdrop-blur-sm hover:bg-[#e8b600]/5 transition-all duration-300 group">
                        <h3 className="text-[#e8b600] mb-2 group-hover:translate-x-1 transition-transform duration-300 text-sm sm:text-base">{getLocalizedText(feature.feature)}</h3>
                        <p className="text-xs sm:text-sm text-gray-300">{getLocalizedText(feature.value)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottle Size Selection - Updated with prices */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl text-[#e8b600] mb-3 sm:mb-4">{t('overview.bottleSize')}</h3>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
                    {getAvailableSizes().map((size, index) => {
                      const price = getPriceForSize(size);
                      return (
                        <button 
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 sm:py-3 px-3 sm:px-6 border ${selectedSize === size ? 'border-[#e8b600] text-[#e8b600] bg-[#e8b600]/10' : 'border-gray-600 text-gray-400'} hover:border-[#e8b600] hover:text-[#e8b600] transition-all duration-300 flex flex-col items-center text-center`}
                        >
                          <span className="text-sm sm:text-lg">{size}ml</span>
                          {price && (
                            <span className="text-xs sm:text-sm font-semibold">${price}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quality Selection */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl text-[#e8b600] mb-3 sm:mb-4">Quality</h3>
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3 sm:gap-4">
                    {['Original', 'Premium', 'Luxury'].map((quality) => (
                      <button 
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={`py-2 px-3 sm:px-6 border ${selectedQuality === quality ? 'border-[#e8b600] text-[#e8b600] bg-[#e8b600]/10' : 'border-gray-600 text-gray-400'} hover:border-[#e8b600] hover:text-[#e8b600] transition-all duration-300 text-xs sm:text-base`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -left-20 w-40 h-40 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-60 hidden lg:block"></div>
              </div>
              
              <div className="relative">
                {/* Swiper for perfume images */}
                <div className="relative overflow-hidden shadow-xl shadow-black/40 mb-6 sm:mb-8">
                  <Swiper
                    modules={[Pagination, Autoplay, Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    className="perfume-swiper"
                    dir={rtl ? 'rtl' : 'ltr'}
                  >
                    {/* Main image */}
                    {perfume.sliderImages && perfume.sliderImages.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img 
                        src={image ? `${API_ENDPOINTS.BASE_URL}/${image}` : "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg"} 
                        alt={getLocalizedText(perfume.title)} 
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                    ))}
                    {/* Additional sample images */}
                    <SwiperSlide>
                      <img 
                        src="https://public.readdy.ai/ai/img_res/de27af8683a2e5e20560a064fb477a6d.jpg" 
                        alt={`${getLocalizedText(perfume.title)} 2`} 
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img 
                        src="https://public.readdy.ai/ai/img_res/fe7a20be2d576e3b20417a2104a1715d.jpg" 
                        alt={`${getLocalizedText(perfume.title)} 3`} 
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
                
                <div className="absolute -top-10 -right-20 w-32 h-32 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-60 hidden lg:block"></div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Section */}
        {activeTab === 'notes' && (
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#e8b600] mb-6 sm:mb-8 relative inline-block">
                  {t('notes.title')}
                  <div className="w-1/2 h-0.5 bg-[#e8b600]/50 absolute -bottom-2 left-0"></div>
                </h2>
                
                <div className="space-y-6 sm:space-y-8">
                  <div className="border-l-4 border-[#e8b600]/50 pl-4 sm:pl-6">
                    <h3 className="text-lg sm:text-xl text-[#e8b600] mb-2 sm:mb-3">{t('notes.topNotes')}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {t('notes.topNotesDesc')}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-[#e8b600]/50 pl-4 sm:pl-6">
                    <h3 className="text-lg sm:text-xl text-[#e8b600] mb-2 sm:mb-3">{t('notes.middleNotes')}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {t('notes.middleNotesDesc')}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-[#e8b600]/50 pl-4 sm:pl-6">
                    <h3 className="text-lg sm:text-xl text-[#e8b600] mb-2 sm:mb-3">{t('notes.baseNotes')}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {t('notes.baseNotesDesc')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div ref={chartRef} style={{ width: '100%', height: '300px' }} className="sm:h-[400px]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Ingredients Section */}
        {activeTab === 'ingredients' && perfume.ingredients && (
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#e8b600] mb-4 sm:mb-6">{t('ingredients.title')}</h2>
              <div className="w-16 sm:w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
                {t('ingredients.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {perfume.ingredients.map((ingredient, index) => (
                <div key={index} className="border border-[#e8b600]/30 p-6 sm:p-8 hover:bg-[#e8b600]/5 transition-all duration-300 relative overflow-hidden group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-[#e8b600]/10 rounded-full flex items-center justify-center group-hover:bg-[#e8b600]/20 transition-all duration-300">
                    <i className="fas fa-leaf text-[#e8b600] text-lg sm:text-2xl"></i>
                  </div>
                  <h3 className="text-lg sm:text-xl text-[#e8b600] mb-2 text-center group-hover:scale-105 transition-transform duration-300">{getLocalizedText(ingredient.key)}</h3>
                  <p className="text-gray-300 text-center text-xs sm:text-sm">{getLocalizedText(ingredient.value)}</p>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 overflow-hidden">
                    <div className="absolute transform rotate-45 bg-[#e8b600]/10 w-16 sm:w-24 h-4 sm:h-5 top-6 sm:top-8 right-[-8px] sm:right-[-12px]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Related Products Section - Updated price display */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0A0A0A] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#e8b600] mb-4 sm:mb-6">{t('related.title')}</h2>
            <div className="w-16 sm:w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
              {t('related.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {relatedPerfumes.map((product, index) => {
              // Get price display for related products
              const getProductPriceDisplay = () => {
                if (product.sizesPricing && product.sizesPricing.length > 0) {
                  const prices = product.sizesPricing.map(sp => sp.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  
                  if (minPrice === maxPrice) {
                    return `$${minPrice}`;
                  } else {
                    return `$${minPrice} - $${maxPrice}`;
                  }
                }
                return `$${product.price || 0}`;
              };

              return (
                <div 
                  key={product.id || index} 
                  className="bg-gradient-to-b from-[#0a0a0a] to-[#111] group relative overflow-hidden transform transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/50 cursor-pointer"
                  onClick={() => window.location.href = `/${locale}/perfume/${product.urlName}`}
                >
                  <div className="h-48 sm:h-56 lg:h-64 overflow-hidden">
                    <img 
                      src={product.image ? `${API_ENDPOINTS.BASE_URL}/${product.image}` : "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg"} 
                      alt={getLocalizedText(product.title)} 
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-70"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-light mb-2 group-hover:text-[#e8b600] transition-colors duration-300">
                      {getLocalizedText(product.title)}
                    </h3>
                    <div className="w-8 sm:w-10 h-0.5 bg-[#e8b600] mb-3 transition-all duration-300 group-hover:w-12 sm:group-hover:w-16"></div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2">
                      {getLocalizedText(product.description)}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[#e8b600] text-base sm:text-lg font-light">
                        {getProductPriceDisplay()}
                      </p>
                      <button className="text-white/70 hover:text-[#e8b600] transition-colors duration-300">
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-[#e8b600]/30"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
} 