"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function PerfumeDetails() {
  const t = useTranslations('perfume');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const chartRef = useRef(null);
  const rtl = locale === 'ar';
  
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
    if (chartRef.current && activeTab === 'notes') {
      const myChart = echarts.init(chartRef.current, 'dark');
      
      const option = {
        backgroundColor: 'transparent',
        title: {
          text: t('notes.radarChartTitle'),
          textStyle: {
            color: '#e8b600',
            fontSize: 16,
            fontWeight: 'normal'
          },
          left: 'center',
          top: 0
        },
        radar: {
          indicator: [
            { name: t('notes.items.blackPepper'), max: 100 },
            { name: t('notes.items.bergamot'), max: 100 },
            { name: t('notes.items.jasmine'), max: 100 },
            { name: t('notes.items.iris'), max: 100 },
            { name: t('notes.items.sandalwood'), max: 100 },
            { name: t('notes.items.vanilla'), max: 100 }
          ],
          radius: '60%',
          shape: 'circle',
          splitNumber: 4,
          axisName: {
            color: '#fff',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(232, 182, 0, 0.2)'
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(232, 182, 0, 0.3)'
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
  }, [chartRef, activeTab, t]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] text-white font-serif">
      {/* Header & Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://public.readdy.ai/ai/img_res/a35b0a0fb47e454f900b819ffb453550.jpg" 
            alt={t('heroAlt')} 
            className="w-full h-full object-cover object-top opacity-80 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          
          {/* Subtle gold particle overlay */}
          <div className="absolute inset-0 bg-[#e8b600]/5 mix-blend-overlay"></div>
          
          {/* Animated diagonal lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #e8b600 0, #e8b600 1px, transparent 1px, transparent 20px)',
            }}></div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-12 z-10">
          <div className="max-w-4xl opacity-0 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-light text-[#e8b600] mb-4">{t('title')}</h1>
            <p className="text-xl md:text-2xl mb-6 text-gray-200 leading-relaxed">{t('subtitle')}</p>
            
            <div className="flex items-center flex-wrap gap-8 mb-8">
              <div>
                <p className="text-3xl font-light text-[#e8b600]">{t('price')}</p>
                <p className="text-sm text-gray-400">{t('volume')}</p>
              </div>
              
              <div className="flex items-center border border-[#e8b600]/40 rounded-none bg-black/30 backdrop-blur-sm">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-3 text-[#e8b600] transition-all duration-300 hover:bg-[#e8b600]/10"
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="px-4 py-3 min-w-[40px] text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-3 text-[#e8b600] transition-all duration-300 hover:bg-[#e8b600]/10"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#e8b600] text-black font-medium px-10 py-4 text-lg hover:bg-white hover:text-[#e8b600] transition-all duration-300 shadow-lg shadow-[#e8b600]/20 transform hover:-translate-y-1 relative group overflow-hidden">
                <span className="relative z-10">{t('addToCart')}</span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </button>
              <button 
                onClick={toggleLike}
                className="border border-[#e8b600]/40 bg-black/20 backdrop-blur-sm px-5 py-4 hover:bg-[#e8b600]/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-[#e8b600] text-lg`}></i>
              </button>
              <button className="border border-[#e8b600]/40 bg-black/20 backdrop-blur-sm px-5 py-4 hover:bg-[#e8b600]/10 transition-all duration-300 transform hover:-translate-y-1">
                <i className="fas fa-share-alt text-[#e8b600] text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Navigation */}
      <div className="sticky top-0 bg-black/95 border-b border-[#e8b600]/20 backdrop-blur-md z-20 shadow-lg shadow-black/30">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto no-scrollbar" dir={rtl ? 'rtl' : 'ltr'}>
            {['overview', 'notes', 'ingredients', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-8 py-4 text-lg capitalize whitespace-nowrap transition-all duration-300 relative ${
                  activeTab === tab 
                    ? 'text-[#e8b600]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t(`tabs.${tab}`)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 bg-black">
        {/* Overview Section */}
        {activeTab === 'overview' && (
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="relative">
                <h2 className="text-4xl font-light text-[#e8b600] mb-6 relative inline-block">
                  {t('overview.title')}
                  <div className="w-1/2 h-0.5 bg-[#e8b600]/50 absolute -bottom-2 left-0"></div>
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('overview.paragraph1')}
                </p>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  {t('overview.paragraph2')}
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { titleKey: 'longevity', valueKey: 'longevityValue' },
                    { titleKey: 'sillage', valueKey: 'sillageValue' },
                    { titleKey: 'season', valueKey: 'seasonValue' },
                    { titleKey: 'occasion', valueKey: 'occasionValue' }
                  ].map((detail, index) => (
                    <div key={index} className="border border-[#e8b600]/30 p-6 bg-black/20 backdrop-blur-sm hover:bg-[#e8b600]/5 transition-all duration-300 group">
                      <h3 className="text-[#e8b600] mb-2 group-hover:translate-x-1 transition-transform duration-300">{t(`overview.details.${detail.titleKey}`)}</h3>
                      <p className="text-sm text-gray-300">{t(`overview.details.${detail.valueKey}`)}</p>
                    </div>
                  ))}
                </div>
                
                {/* Bottle Size Selection */}
                <div className="mb-10">
                  <h3 className="text-xl text-[#e8b600] mb-4">{t('overview.bottleSize')}</h3>
                  <div className="flex flex-wrap gap-4">
                    {['30ml', '50ml', '100ml'].map((size, index) => (
                      <button 
                        key={index}
                        className={`py-2 px-6 border ${index === 2 ? 'border-[#e8b600] text-[#e8b600]' : 'border-gray-600 text-gray-400'} hover:border-[#e8b600] hover:text-[#e8b600] transition-all duration-300`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Abstract gold shape */}
                <div className="absolute -bottom-10 -left-20 w-40 h-40 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-60"></div>
              </div>
              
              <div className="relative">
                {/* Swiper for perfume images */}
                <div className="relative overflow-hidden shadow-xl shadow-black/40 mb-8">
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
                    <SwiperSlide>
                      <img 
                        src="https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg" 
                        alt={t('overview.imageAlt')} 
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img 
                        src="https://public.readdy.ai/ai/img_res/de27af8683a2e5e20560a064fb477a6d.jpg" 
                        alt={t('overview.imageAlt2')} 
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img 
                        src="https://public.readdy.ai/ai/img_res/fe7a20be2d576e3b20417a2104a1715d.jpg" 
                        alt={t('overview.imageAlt3')} 
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                  </Swiper>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 pointer-events-none"></div>
                </div>
                
                {/* Certification badges */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: 'leaf', title: t('overview.badges.sustainable') },
                    { icon: 'ban', title: t('overview.badges.crueltyFree') }
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center p-4 border border-[#e8b600]/30 bg-black/30">
                      <i className={`fas fa-${badge.icon} text-[#e8b600] text-2xl mr-3`}></i>
                      <span className="text-sm">{badge.title}</span>
                    </div>
                  ))}
                </div>
                
                {/* Abstract gold shape */}
                <div className="absolute -top-10 -right-0 w-60 h-60 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-60"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Notes Section */}
        {activeTab === 'notes' && (
          <div className="relative overflow-hidden">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-[#e8b600] mb-6">{t('notes.title')}</h2>
              <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
              <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-lg">
                {t('notes.description')}
              </p>
            </div>
            
            {/* Radar Chart for fragrance profile */}
            <div className="mb-20 max-w-4xl mx-auto">
              <div 
                ref={chartRef} 
                className="w-full h-80 mx-auto mb-8"
              ></div>
              <p className="text-gray-400 text-center italic max-w-xl mx-auto">
                {t('notes.chartDescription')}
              </p>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full border border-[#e8b600]"></div>
              <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full border border-[#e8b600]"></div>
              <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full border border-[#e8b600]"></div>
            </div>
            
            <div className="mb-16">
              <h3 className="text-2xl font-light text-center mb-10 relative inline-block">
                <span className="relative z-10">{t('notes.topNotes')}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]/30"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { nameKey: 'blackPepper', image: 'https://public.readdy.ai/ai/img_res/303530517b8a0beec45de9d0858b1f59.jpg' },
                  { nameKey: 'bergamot', image: 'https://public.readdy.ai/ai/img_res/b2922539e43aa7159d594d6c18e660e2.jpg' },
                  { nameKey: 'cardamom', image: 'https://public.readdy.ai/ai/img_res/132771f7dccd047954ae1c1a7aebaafb.jpg' },
                  { nameKey: 'saffron', image: 'https://public.readdy.ai/ai/img_res/deda5cfceefb7c19bf109f1324b4d7fa.jpg' }
                ].map((note, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="w-24 h-24 rounded-full border border-[#e8b600]/30 p-1 mb-4 overflow-hidden transform transition-transform duration-500 group-hover:scale-105 shadow-lg shadow-black/20">
                      <img src={note.image} alt={t(`notes.items.${note.nameKey}`)} className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <h4 className="text-[#e8b600] group-hover:scale-110 transition-transform duration-300">{t(`notes.items.${note.nameKey}`)}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-16">
              <h3 className="text-2xl font-light text-center mb-10 relative inline-block">
                <span className="relative z-10">{t('notes.heartNotes')}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]/30"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { nameKey: 'blackOrchid', image: 'https://public.readdy.ai/ai/img_res/8b97854059e88a8743c5c9fd88853ca6.jpg' },
                  { nameKey: 'jasmine', image: 'https://public.readdy.ai/ai/img_res/4841a36892e9c4158d32b500dab9892a.jpg' },
                  { nameKey: 'iris', image: 'https://public.readdy.ai/ai/img_res/9418720651b1d258707af724c61229a0.jpg' },
                  { nameKey: 'roseAbsolute', image: 'https://public.readdy.ai/ai/img_res/a27641bccc979ccb0cd74d7363f954f6.jpg' }
                ].map((note, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="w-24 h-24 rounded-full border border-[#e8b600]/30 p-1 mb-4 overflow-hidden transform transition-transform duration-500 group-hover:scale-105 shadow-lg shadow-black/20">
                      <img src={note.image} alt={t(`notes.items.${note.nameKey}`)} className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <h4 className="text-[#e8b600] group-hover:scale-110 transition-transform duration-300">{t(`notes.items.${note.nameKey}`)}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-16">
              <h3 className="text-2xl font-light text-center mb-10 relative inline-block">
                <span className="relative z-10">{t('notes.baseNotes')}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]/30"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { nameKey: 'amber', image: 'https://public.readdy.ai/ai/img_res/4f35d1b7624aa9dcbe88c7dbc0bc1c9e.jpg' },
                  { nameKey: 'sandalwood', image: 'https://public.readdy.ai/ai/img_res/c8c2f20b18c7f7a7a8cb83c59c97a7c6.jpg' },
                  { nameKey: 'vanilla', image: 'https://public.readdy.ai/ai/img_res/af8fec9c3498ac6d03f00a1ff4fb2ae7.jpg' },
                  { nameKey: 'musk', image: 'https://public.readdy.ai/ai/img_res/6b98f6f4bc87c4e29c85c4f00b01300e.jpg' }
                ].map((note, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="w-24 h-24 rounded-full border border-[#e8b600]/30 p-1 mb-4 overflow-hidden transform transition-transform duration-500 group-hover:scale-105 shadow-lg shadow-black/20">
                      <img src={note.image} alt={t(`notes.items.${note.nameKey}`)} className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <h4 className="text-[#e8b600] group-hover:scale-110 transition-transform duration-300">{t(`notes.items.${note.nameKey}`)}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Fragrance Evolution Timeline */}
            <div className="mb-12 relative">
              <h3 className="text-2xl font-light text-center mb-12">{t('notes.fragranceEvolution')}</h3>
              
              <div className="max-w-4xl mx-auto relative">
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-[#e8b600]/50 via-[#e8b600]/30 to-[#e8b600]/10 transform -translate-x-1/2"></div>
                
                {[
                  { time: '0-15', phase: 'opening', description: 'openingDesc' },
                  { time: '15-45', phase: 'heart', description: 'heartDesc' },
                  { time: '45+', phase: 'base', description: 'baseDesc' }
                ].map((stage, index) => (
                  <div 
                    key={index} 
                    className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center mb-16`}
                    dir={rtl ? 'rtl' : 'ltr'}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#e8b600] absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <h4 className="text-xl text-[#e8b600] mb-2">{t(`notes.timeline.${stage.time}min`)}</h4>
                      <h5 className="text-white mb-2">{t(`notes.timeline.${stage.phase}`)}</h5>
                      <p className="text-gray-400">{t(`notes.timeline.${stage.description}`)}</p>
                    </div>
                    <div className="w-2/12"></div>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Ingredients Section */}
        {activeTab === 'ingredients' && (
          <div className="py-12">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-light text-[#e8b600] mb-6">{t('ingredients.title')}</h2>
              <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                {t('ingredients.description')}
              </p>
            </div>
            
            {/* Ingredient Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div className="border border-[#e8b600]/30 p-8 hover:bg-[#e8b600]/5 transition-all duration-300 relative overflow-hidden group">
                <h3 className="text-2xl font-light text-[#e8b600] mb-4 relative inline-block">
                  {t('ingredients.natural')}
                  <span className="absolute -bottom-1 left-0 w-1/2 h-px bg-[#e8b600]/50 group-hover:w-full transition-all duration-300"></span>
                </h3>
                <ul className="space-y-3 text-gray-300">
                  {['bergamot', 'jasmine', 'sandalwood', 'vanilla', 'amber', 'musk'].map((ingredient, index) => (
                    <li key={index} className="flex items-start group/item">
                      <i className="fas fa-chevron-right text-[#e8b600] mr-3 text-sm transform group-hover/item:translate-x-1 transition-transform duration-300 mt-1"></i>
                      <span>{t(`ingredients.items.${ingredient}`)}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute transform rotate-45 bg-[#e8b600]/10 w-24 h-5 top-8 right-[-12px]"></div>
                </div>
              </div>
              
              <div className="border border-[#e8b600]/30 p-8 hover:bg-[#e8b600]/5 transition-all duration-300 relative overflow-hidden group">
                <h3 className="text-2xl font-light text-[#e8b600] mb-4 relative inline-block">
                  {t('ingredients.synthetic')}
                  <span className="absolute -bottom-1 left-0 w-1/2 h-px bg-[#e8b600]/50 group-hover:w-full transition-all duration-300"></span>
                </h3>
                <ul className="space-y-3 text-gray-300">
                  {['ambroxan', 'galaxolide', 'hedione', 'iso', 'linalool', 'coumarin'].map((ingredient, index) => (
                    <li key={index} className="flex items-start group/item">
                      <i className="fas fa-chevron-right text-[#e8b600] mr-3 text-sm transform group-hover/item:translate-x-1 transition-transform duration-300 mt-1"></i>
                      <span>{t(`ingredients.items.${ingredient}`)}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute transform rotate-45 bg-[#e8b600]/10 w-24 h-5 top-8 right-[-12px]"></div>
                </div>
              </div>
            </div>
            
            {/* Ingredients Percentage Bar Chart */}
            <div className="mt-16 mb-16 max-w-4xl mx-auto">
              <h3 className="text-2xl font-light text-[#e8b600] mb-6 text-center">{t('ingredients.composition')}</h3>
              
              <div className="space-y-6">
                {[
                  { name: 'floral', percentage: 35 },
                  { name: 'woody', percentage: 25 },
                  { name: 'spicy', percentage: 20 },
                  { name: 'citrus', percentage: 12 },
                  { name: 'musk', percentage: 8 }
                ].map((comp, index) => (
                  <div key={index} className="w-full">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{t(`ingredients.composition.${comp.name}`)}</span>
                      <span className="text-[#e8b600]">{comp.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 overflow-hidden">
                      <div 
                        className="h-full bg-[#e8b600]" 
                        style={{ width: `${comp.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sustainability Section */}
            <div className="mt-16 mb-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative overflow-hidden rounded">
                  <img 
                    src="https://public.readdy.ai/ai/img_res/303530517b8a0beec45de9d0858b1f59.jpg" 
                    alt={t('ingredients.sustainability.imgAlt')}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="absolute inset-0 p-8 flex items-end">
                    <div>
                      <h3 className="text-2xl font-light text-[#e8b600] mb-2">{t('ingredients.sustainability.title')}</h3>
                      <p className="text-gray-300 text-sm">{t('ingredients.sustainability.description')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded">
                  <img 
                    src="https://public.readdy.ai/ai/img_res/4841a36892e9c4158d32b500dab9892a.jpg" 
                    alt={t('ingredients.ethical.imgAlt')}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="absolute inset-0 p-8 flex items-end">
                    <div>
                      <h3 className="text-2xl font-light text-[#e8b600] mb-2">{t('ingredients.ethical.title')}</h3>
                      <p className="text-gray-300 text-sm">{t('ingredients.ethical.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 p-8 border border-[#e8b600]/30 max-w-4xl mx-auto bg-black/30">
              <h3 className="text-xl text-[#e8b600] mb-6 flex items-center">
                <i className="fas fa-info-circle mr-3"></i>
                {t('ingredients.disclaimer.title')}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('ingredients.disclaimer.text')}
              </p>
            </div>
          </div>
        )}
        
        {/* Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="py-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-[#e8b600] mb-6">{t('reviews.title')}</h2>
              <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                {t('reviews.description')}
              </p>
            </div>
            
            {/* Reviews Summary */}
            <div className="max-w-5xl mx-auto mb-16 grid md:grid-cols-2 gap-12">
              <div className="flex flex-col justify-center items-center">
                <div className="text-5xl font-light text-[#e8b600] mb-2">4.8</div>
                <div className="flex text-[#e8b600] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < 4 ? '' : 'text-gray-600'} mx-1`}></i>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">{t('reviews.basedOn', { count: 127 })}</p>
              </div>
              
              <div>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const percentage = rating === 5 ? 85 : rating === 4 ? 10 : rating === 3 ? 3 : rating === 2 ? 1 : 1;
                    return (
                      <div key={rating} className="flex items-center">
                        <div className="flex items-center w-24">
                          <span className="text-sm text-gray-400 mr-2">{rating}</span>
                          <i className="fas fa-star text-[#e8b600] text-xs"></i>
                        </div>
                        <div className="flex-grow h-2 bg-gray-800 overflow-hidden">
                          <div 
                            className="h-full bg-[#e8b600]" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400 ml-3 w-12">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Review Filter Tabs */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="flex border-b border-[#e8b600]/20 mb-8 overflow-x-auto no-scrollbar" dir={rtl ? 'rtl' : 'ltr'}>
                {['all', 'positive', 'critical', 'recent'].map((filter, index) => (
                  <button 
                    key={index}
                    className={`px-6 py-3 whitespace-nowrap ${index === 0 ? 'text-[#e8b600] border-b-2 border-[#e8b600]' : 'text-gray-400'}`}
                  >
                    {t(`reviews.filters.${filter}`)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {[
                {
                  nameKey: 'john',
                  date: '2023-05-15',
                  stars: 5,
                  textKey: 'johnReview',
                  helpful: 24,
                  avatar: 'https://public.readdy.ai/ai/img_res/303530517b8a0beec45de9d0858b1f59.jpg'
                },
                {
                  nameKey: 'sophia',
                  date: '2023-06-22',
                  stars: 5,
                  textKey: 'sophiaReview',
                  helpful: 18,
                  avatar: 'https://public.readdy.ai/ai/img_res/4841a36892e9c4158d32b500dab9892a.jpg'
                },
                {
                  nameKey: 'michael',
                  date: '2023-07-10',
                  stars: 4,
                  textKey: 'michaelReview',
                  helpful: 12,
                  avatar: 'https://public.readdy.ai/ai/img_res/b2922539e43aa7159d594d6c18e660e2.jpg'
                },
                {
                  nameKey: 'emma',
                  date: '2023-08-05',
                  stars: 5,
                  textKey: 'emmaReview',
                  helpful: 31,
                  avatar: 'https://public.readdy.ai/ai/img_res/a27641bccc979ccb0cd74d7363f954f6.jpg'
                }
              ].map((review, index) => (
                <div key={index} className="border border-[#e8b600]/30 p-8 bg-black/30 backdrop-blur-sm hover:bg-[#e8b600]/5 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img src={review.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-medium">{t(`reviews.reviewers.${review.nameKey}`)}</h3>
                      <div className="flex text-xs text-gray-400">
                        <span>{review.date}</span>
                        <span className="mx-2">•</span>
                        <span>{t('reviews.verifiedPurchase')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex mb-6 text-[#e8b600]">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < review.stars ? '' : 'text-gray-600'} mr-1`}></i>
                    ))}
                  </div>
                  
                  <p className="text-gray-300 italic mb-6">"{t(`reviews.comments.${review.textKey}`)}"</p>
                  
                  <div className="flex justify-between text-sm">
                    <button className="text-gray-400 hover:text-[#e8b600] transition-colors duration-300">
                      <i className="far fa-thumbs-up mr-2"></i>
                      {t('reviews.helpful', { count: review.helpful })}
                    </button>
                    <button className="text-gray-400 hover:text-[#e8b600] transition-colors duration-300">
                      <i className="far fa-flag mr-2"></i>
                      {t('reviews.report')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-[#e8b600] text-black font-medium px-10 py-4 hover:bg-white hover:text-[#e8b600] transition-all duration-300 shadow-lg shadow-[#e8b600]/20 transform hover:-translate-y-1 relative group overflow-hidden">
                <span className="relative z-10">{t('reviews.writeReview')}</span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Related Products Section */}
      <section className="py-20 bg-[#0A0A0A] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[#e8b600] mb-6">{t('related.title')}</h2>
            <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              {t('related.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                idKey: 'midnight',
                image: 'https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg'
              },
              {
                idKey: 'golden',
                image: 'https://public.readdy.ai/ai/img_res/1dfb8913879312f00039106067df2cf6.jpg'
              },
              {
                idKey: 'velvet',
                image: 'https://public.readdy.ai/ai/img_res/fe7a20be2d576e3b20417a2104a1715d.jpg'
              }
            ].map((product, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-b from-[#0a0a0a] to-[#111] group relative overflow-hidden transform transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/50"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={t(`related.products.${product.idKey}.name`)} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-70"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-light mb-2 group-hover:text-[#e8b600] transition-colors duration-300">
                    {t(`related.products.${product.idKey}.name`)}
                  </h3>
                  <div className="w-10 h-0.5 bg-[#e8b600] mb-3 transition-all duration-300 group-hover:w-16"></div>
                  <p className="text-gray-400 text-sm mb-4">
                    {t(`related.products.${product.idKey}.description`)}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-[#e8b600] text-lg font-light">
                      {t(`related.products.${product.idKey}.price`)}
                    </p>
                    <button className="text-white/70 hover:text-[#e8b600] transition-colors duration-300">
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-[#e8b600]/30"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Email Subscription Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-8 leading-tight">
              <span className="text-white">{t('subscription.title')} </span>
              <span className="text-[#e8b600] italic">{t('subscription.highlightedTitle')}</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('subscription.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder={t('subscription.emailPlaceholder')}
                className="flex-grow px-6 py-4 bg-[#111] border border-[#e8b600]/20 text-white focus:outline-none focus:border-[#e8b600] transition-all duration-300"
              />
              <button className="bg-[#e8b600] text-black px-8 py-4 font-medium hover:bg-white transition-all duration-300 flex-shrink-0">
                {t('subscription.button')}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              {t('subscription.privacyNotice')}
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      <style jsx>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
        
        .animate-scroll-bounce {
          animation: scroll-bounce 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        :global(.perfume-swiper .swiper-pagination-bullet) {
          background: #e8b600;
          opacity: 0.5;
        }
        
        :global(.perfume-swiper .swiper-pagination-bullet-active) {
          background: #e8b600;
          opacity: 1;
        }
      `}</style>
    </div>
  );
} 