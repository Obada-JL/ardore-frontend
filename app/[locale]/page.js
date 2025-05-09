"use client"
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen font-serif text-white bg-gradient-to-b from-black to-[#050505]">
      {/* Header & Navigation */}
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://public.readdy.ai/ai/img_res/731db9a2972a79abc44a1e1e28b80367.jpg" 
            alt="Luxury Perfume" 
            className="w-full h-full object-cover object-top opacity-80 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          
          {/* Enhanced gold particle overlay */}
          <div className="absolute inset-0 bg-[#e8b600]/10 mix-blend-overlay"></div>
          
          {/* Animated diagonal lines with improved opacity */}
          <div className="absolute inset-0 opacity-15">
            <div className="h-full w-full" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #e8b600 0, #e8b600 1px, transparent 1px, transparent 20px)',
            }}></div>
          </div>
          
          {/* Added gold particle animations */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-[#e8b600] rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                  transform: `scale(${Math.random() * 3 + 1})`,
                  animation: `float ${Math.random() * 8 + 12}s infinite ease-in-out`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
              {t('hero.title')} <span className="text-[#e8b600] font-normal italic relative inline-block animate-shimmer">Signature</span> <span className="relative">Scent
              <span className="absolute -bottom-2 left-0 w-1/3 h-px bg-[#e8b600]/70"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed max-w-xl">
              {t('hero.subtitle')}
            </p>
            <button className="bg-[#e8b600] text-black font-medium px-10 py-4 text-lg hover:bg-white hover:text-[#e8b600] transition-all duration-300 shadow-lg shadow-[#e8b600]/20 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e8b600]/30 relative group overflow-hidden">
              <span className="relative z-10">{t('hero.button')}</span>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse-slow">
          <span className="text-sm text-[#e8b600] mb-3 tracking-wider font-light">{t('hero.scroll')}</span>
          <div className="w-7 h-12 border-2 border-[#e8b600]/70 rounded-full flex justify-center relative">
            <div className="w-1.5 h-3 bg-[#e8b600] rounded-full animate-scroll-bounce mt-2 absolute"></div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="collections" className="py-24 bg-black/95 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-4">
              <span className="relative inline-block">
                {t('collections.title')} <span className="text-[#e8b600] italic font-normal">{t('collections.highlightedTitle')}</span>
                <span className="absolute -bottom-2 left-1/4 w-1/2 h-px bg-[#e8b600]/50"></span>
              </span>
            </h2>
            <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              {t('collections.description')}
            </p>
          </div>
          
          {/* Gold grid lines - enhanced */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(to right, #e8b600 1px, transparent 1px), linear-gradient(to bottom, #e8b600 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}></div>
          </div>
          
          {/* Enhanced abstract gold shapes */}
          <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-[#e8b600]/10 filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-[#e8b600]/5 filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            {[
              {
                id: "midnightSerenade",
                image: "https://public.readdy.ai/ai/img_res/1dfb8913879312f00039106067df2cf6.jpg",
                delay: "0s"
              },
              {
                id: "goldenElixir",
                image: "https://public.readdy.ai/ai/img_res/de27af8683a2e5e20560a064fb477a6d.jpg",
                delay: "0.2s"
              },
              {
                id: "velvetNoir",
                image: "https://public.readdy.ai/ai/img_res/fe7a20be2d576e3b20417a2104a1715d.jpg",
                delay: "0.4s"
              }
            ].map((product, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-b from-[#0a0a0a] to-[#111] group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/50 animate-fade-in-up"
                style={{ animationDelay: product.delay }}
              >
                <div className="relative mb-0 h-80 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={t(`collections.products.${product.id}.name`)} 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 bg-[#e8b600] text-black font-medium px-4 py-1 text-sm opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {t('common.new')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-light mb-2 group-hover:text-[#e8b600] transition-colors duration-300">{t(`collections.products.${product.id}.name`)}</h3>
                  <div className="w-12 h-0.5 bg-[#e8b600] mb-3 transition-all duration-300 group-hover:w-20"></div>
                  <p className="text-gray-400 text-sm mb-4 opacity-80 group-hover:opacity-100 transition-all duration-300">
                    {t(`collections.products.${product.id}.description`)}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-[#e8b600] text-xl font-light">{t(`collections.products.${product.id}.price`)}</p>
                    <button className="text-white/70 hover:text-[#e8b600] transition-colors duration-300 transform hover:scale-110">
                      <i className="fas fa-shopping-bag"></i>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced border animation on hover */}
                <div className="absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-[#e8b600]/50"></div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-transparent group-hover:border-[#e8b600]/70 transition-all duration-500 delay-100"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-transparent group-hover:border-[#e8b600]/70 transition-all duration-500 delay-200"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-transparent group-hover:border-[#e8b600]/70 transition-all duration-500 delay-300"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-transparent group-hover:border-[#e8b600]/70 transition-all duration-500 delay-400"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button className="border-2 border-[#e8b600] text-[#e8b600] px-10 py-3 hover:bg-[#e8b600] hover:text-black transition-all duration-300 group relative overflow-hidden shadow-lg shadow-[#e8b600]/5 hover:shadow-xl hover:shadow-[#e8b600]/20">
              <span className="relative z-10">{t('collections.viewAll')}</span>
              <span className="absolute inset-0 bg-[#e8b600] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Fragrance Notes Interactive Section - Enhanced */}
      <section id="fragrances" className="py-20 bg-[#0A0A0A] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600]/30 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">
              <span className="relative inline-block">
                {t('fragrances.title')} <span className="text-[#e8b600] animate-shimmer">{t('fragrances.highlightedTitle')}</span>
                <span className="absolute -bottom-2 left-1/4 w-1/2 h-px bg-[#e8b600]/50"></span>
              </span>
            </h2>
            <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('fragrances.description')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="w-full md:w-1/2 relative">
              <div className="relative mx-auto w-80 h-80">
                {/* Top notes circle - enhanced */}
                <div className="absolute inset-0 border-2 border-[#e8b600] rounded-full opacity-30 animate-pulse" style={{ animationDuration: '3s' }}></div>
                
                {/* Middle notes circle - enhanced */}
                <div className="absolute inset-8 border-2 border-[#e8b600] rounded-full opacity-50 animate-pulse" style={{ animationDuration: '4s' }}></div>
                
                {/* Base notes circle - enhanced */}
                <div className="absolute inset-16 border-2 border-[#e8b600] rounded-full opacity-70 animate-pulse" style={{ animationDuration: '5s' }}></div>
                
                {/* Center - enhanced */}
                <div className="absolute inset-24 bg-gradient-to-br from-[#e8b600] to-[#d4aa00] rounded-full flex items-center justify-center animate-pulse-slow">
                  <span className="text-black font-medium tracking-wider">{t('fragrances.essence')}</span>
                </div>
                
                {/* Notes labels - enhanced */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-[#e8b600] font-light tracking-widest">{t('fragrances.topNotes.title')}</div>
                  <div className="text-sm text-gray-300">{t('fragrances.topNotes.subtitle')}</div>
                </div>
                
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-[#e8b600] font-light tracking-widest">{t('fragrances.middleNotes.title')}</div>
                  <div className="text-sm text-gray-300">{t('fragrances.middleNotes.subtitle')}</div>
                </div>
                
                <div className="absolute top-2/3 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-[#e8b600] font-light tracking-widest">{t('fragrances.baseNotes.title')}</div>
                  <div className="text-sm text-gray-300">{t('fragrances.baseNotes.subtitle')}</div>
                </div>
              </div>
              
              {/* Gold particles - enhanced */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 bg-[#e8b600] rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.7 + 0.3,
                      transform: `scale(${Math.random() * 2 + 0.5})`,
                      animation: `float ${Math.random() * 5 + 5}s infinite ease-in-out`
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="space-y-8">
                <div className="p-6 border border-[#e8b600]/30 hover:border-[#e8b600] transition-all duration-300 cursor-pointer bg-black/30 hover:bg-black/50 group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-[#e8b600] text-xl mb-2 group-hover:translate-x-1 transition-transform duration-300">{t('fragrances.topNotes.title')}</h3>
                  <div className="w-12 h-0.5 bg-[#e8b600]/50 mb-3 transition-all duration-300 group-hover:w-20 group-hover:bg-[#e8b600]"></div>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {t('fragrances.topNotes.description')}
                  </p>
                </div>
                
                <div className="p-6 border border-[#e8b600]/30 hover:border-[#e8b600] transition-all duration-300 cursor-pointer bg-black/30 hover:bg-black/50 group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-[#e8b600] text-xl mb-2 group-hover:translate-x-1 transition-transform duration-300">{t('fragrances.middleNotes.title')}</h3>
                  <div className="w-12 h-0.5 bg-[#e8b600]/50 mb-3 transition-all duration-300 group-hover:w-20 group-hover:bg-[#e8b600]"></div>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {t('fragrances.middleNotes.description')}
                  </p>
                </div>
                
                <div className="p-6 border border-[#e8b600]/30 hover:border-[#e8b600] transition-all duration-300 cursor-pointer bg-black/30 hover:bg-black/50 group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="text-[#e8b600] text-xl mb-2 group-hover:translate-x-1 transition-transform duration-300">{t('fragrances.baseNotes.title')}</h3>
                  <div className="w-12 h-0.5 bg-[#e8b600]/50 mb-3 transition-all duration-300 group-hover:w-20 group-hover:bg-[#e8b600]"></div>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {t('fragrances.baseNotes.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Categories - Enhanced */}
      <section id="categories" className="py-20 bg-black relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600] to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">
              <span className="relative inline-block">
                {t('categories.title')} <span className="text-[#e8b600] animate-shimmer">{t('categories.highlightedTitle')}</span>
                <span className="absolute -bottom-2 left-1/4 w-1/2 h-px bg-[#e8b600]/50"></span>
              </span>
            </h2>
            <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('categories.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "floral",
                image: "https://public.readdy.ai/ai/img_res/41a409218a35a024cbea9e2fa5100f71.jpg",
                delay: "0.1s"
              },
              {
                id: "oriental",
                image: "https://public.readdy.ai/ai/img_res/ed493f30806a85041c0c9b33d101ab3a.jpg",
                delay: "0.2s"
              },
              {
                id: "woody",
                image: "https://public.readdy.ai/ai/img_res/be703a1f32c5337e9ee130a140c6a2c3.jpg",
                delay: "0.3s"
              },
              {
                id: "fresh",
                image: "https://public.readdy.ai/ai/img_res/6287670a527e5f7566c4898e04c57a40.jpg",
                delay: "0.4s"
              },
              {
                id: "gourmand",
                image: "https://public.readdy.ai/ai/img_res/b7767b83ee9982e040c242d2fbd2bf8d.jpg",
                delay: "0.5s"
              },
              {
                id: "aquatic",
                image: "https://public.readdy.ai/ai/img_res/af381fd0d4b2fb4953f6bb2d331d6ecc.jpg",
                delay: "0.6s"
              }
            ].map((category, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden group cursor-pointer h-64 shadow-lg shadow-black/50 transition-transform duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: category.delay }}
              >
                <img 
                  src={category.image} 
                  alt={t(`categories.items.${category.id}.name`)} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300"></div>
                
                {/* Gold overlay on hover */}
                <div className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-40 transition-opacity duration-300 mix-blend-overlay"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 transition-transform duration-300 group-hover:translate-y-[-5px]">
                  <h3 className="text-2xl font-light mb-1 text-white group-hover:text-[#e8b600] transition-colors duration-300">
                    {t(`categories.items.${category.id}.name`)}
                  </h3>
                  <div className="w-0 h-0.5 bg-[#e8b600] mb-2 transition-all duration-500 group-hover:w-16"></div>
                  <p className="text-gray-300 text-sm transform translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300">
                    {t(`categories.items.${category.id}.description`)}
                  </p>
                </div>
                
                {/* Border effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-[#e8b600]/0 group-hover:bg-[#e8b600]/70 transition-colors duration-700"></div>
                <div className="absolute inset-y-0 right-0 w-px bg-[#e8b600]/0 group-hover:bg-[#e8b600]/70 transition-colors duration-700 delay-100"></div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-[#e8b600]/0 group-hover:bg-[#e8b600]/70 transition-colors duration-700 delay-200"></div>
                <div className="absolute inset-y-0 left-0 w-px bg-[#e8b600]/0 group-hover:bg-[#e8b600]/70 transition-colors duration-700 delay-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter & Contact - Enhanced */}
      <section id="contact" className="py-20 bg-[#0A0A0A] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600]/30 to-transparent"></div>
        <div className="absolute -top-60 -right-60 w-96 h-96 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
        <div className="absolute -bottom-60 -left-60 w-96 h-96 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-4">
              <span className="relative inline-block">
                {t('contact.title')} <span className="text-[#e8b600] animate-shimmer">{t('contact.highlightedTitle')}</span>
                <span className="absolute -bottom-2 left-1/4 w-1/2 h-px bg-[#e8b600]/50"></span>
              </span>
            </h2>
            <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
            <p className="text-gray-400 mb-8">
              {t('contact.description')}
            </p>
            
            {/* Contact Form */}
            <form className="mb-12 animate-fade-in-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder={t('contact.form.namePlaceholder')}
                  className="bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
                />
                <input 
                  type="email" 
                  placeholder={t('contact.form.emailPlaceholder')}
                  className="bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
                />
              </div>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder={t('contact.form.subjectPlaceholder')}
                  className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
                />
              </div>
              <div className="mb-4">
                <textarea 
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows="4"
                  className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
                ></textarea>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-[#e8b600] text-black px-8 py-3 hover:bg-white hover:text-[#e8b600] transition-all duration-300 shadow-lg shadow-[#e8b600]/20 hover:shadow-xl hover:shadow-[#e8b600]/30 transform hover:-translate-y-1 group relative overflow-hidden">
                <span className="relative z-10">{t('contact.form.sendButton')}</span>
                <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"></span>
              </button>
            </form>
            
            <div className="flex justify-center space-x-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {['facebook', 'instagram', 'twitter', 'pinterest'].map((social, index) => (
                <a 
                  key={social} 
                  href={`#${social}`} 
                  className="text-[#e8b600]/80 hover:text-[#e8b600] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <i className={`fab fa-${social} text-2xl`}></i>
                </a>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "map-marker-alt",
                  title: 'contact.visit.title',
                  line1: 'contact.visit.line1',
                  line2: 'contact.visit.line2',
                  delay: '0.1s'
                },
                {
                  icon: "envelope",
                  title: 'contact.email.title',
                  line1: 'contact.email.line1',
                  line2: 'contact.email.line2',
                  delay: '0.3s'
                },
                {
                  icon: "phone-alt",
                  title: 'contact.call.title',
                  line1: 'contact.call.line1',
                  line2: 'contact.call.line2',
                  delay: '0.5s'
                }
              ].map((item, index) => (
                <div key={index} className="text-center group animate-fade-in-up bg-black/30 p-6 border border-[#e8b600]/10 hover:border-[#e8b600]/50 transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: item.delay }}>
                  <div className="text-[#e8b600]/80 text-2xl mb-3 group-hover:text-[#e8b600] transition-colors duration-300 transform group-hover:scale-110 group-hover:-translate-y-1">
                    <i className={`fas fa-${item.icon}`}></i>
                  </div>
                  <h3 className="text-xl mb-2 font-light">{t(item.title)}</h3>
                  <div className="w-10 h-px bg-[#e8b600]/30 mx-auto mb-3 transition-all duration-300 group-hover:w-16 group-hover:bg-[#e8b600]/70"></div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {t(item.line1)}<br />
                    {t(item.line2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* <Footer /> */}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.8; filter: brightness(100%); }
          50% { opacity: 1; filter: brightness(150%); }
          100% { opacity: 0.8; filter: brightness(100%); }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-left {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes expand-width {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 18s infinite linear;
        }
        
        .animate-scroll-bounce {
          animation: scroll-bounce 2s infinite ease-in-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s forwards ease-out;
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 30s alternate infinite ease-in-out;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite ease-in-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s forwards ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s forwards ease-out;
        }
        
        .animate-expand-width {
          animation: expand-width 1.5s forwards ease-in-out;
        }
      `}</style>
    </div>
  );
} 