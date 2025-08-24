// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client"
import React, { useState, useEffect } from 'react';
// import * as echarts from 'echarts';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay } from 'swiper/modules';

const DetailsPage= () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
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

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://public.readdy.ai/ai/img_res/a35b0a0fb47e454f900b819ffb453550.jpg" 
            alt="Luxury Perfume" 
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
            <h1 className="text-5xl md:text-7xl font-light text-[#e8b600] mb-4">Midnight Elixir</h1>
            <p className="text-xl md:text-2xl mb-6 text-gray-200 leading-relaxed">A captivating blend of mystery and elegance</p>
            
            <div className="flex items-center flex-wrap gap-8 mb-8">
              <div>
                <p className="text-3xl font-light text-[#e8b600]">₺289.00</p>
                <p className="text-sm text-gray-400">100ml Eau de Parfum</p>
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
                <span className="relative z-10">Add to Cart</span>
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
          <div className="flex overflow-x-auto no-scrollbar">
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
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        {activeTab === 'overview' && (
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="relative">
                <h2 className="text-4xl font-light text-[#e8b600] mb-6 relative inline-block">
                  The Essence of Luxury
                  <div className="w-1/2 h-0.5 bg-[#e8b600]/50 absolute -bottom-2 left-0"></div>
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Midnight Elixir is a sophisticated fragrance that embodies the essence of luxury and mystery. 
                  Created by master perfumer Claire Dubois, this exquisite scent captures the allure of a moonlit 
                  garden with notes of rare black orchid, amber, and sandalwood.
                </p>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Each bottle is meticulously crafted from the finest materials, featuring a hand-polished obsidian 
                  cap and gold-etched glass. The result is not just a fragrance, but a work of art that elevates 
                  any collection.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { title: 'Longevity', value: '8-10 hours' },
                    { title: 'Sillage', value: 'Moderate to strong' },
                    { title: 'Season', value: 'Fall / Winter' },
                    { title: 'Occasion', value: 'Evening / Special events' }
                  ].map((detail, index) => (
                    <div key={index} className="border border-[#e8b600]/30 p-6 bg-black/20 backdrop-blur-sm hover:bg-[#e8b600]/5 transition-all duration-300 group">
                      <h3 className="text-[#e8b600] mb-2 group-hover:translate-x-1 transition-transform duration-300">{detail.title}</h3>
                      <p className="text-sm text-gray-300">{detail.value}</p>
                    </div>
                  ))}
                </div>
                
                {/* Abstract gold shape */}
                <div className="absolute -bottom-10 -left-20 w-40 h-40 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-60"></div>
              </div>
              
              <div className="relative">
                <div className="relative overflow-hidden shadow-xl shadow-black/40 transform hover:scale-[1.02] transition-transform duration-500">
                  <img 
                    src="https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg" 
                    alt="Midnight Elixir Perfume" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                  
                  {/* Border animation on hover */}
                  <div className="absolute inset-0 border border-transparent hover:border-[#e8b600]/30 transition-all duration-500"></div>
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
              <h2 className="text-4xl font-light text-[#e8b600] mb-6">Fragrance Notes</h2>
              <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
              <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-lg">
                Experience the evolution of Midnight Elixir as it unfolds on your skin, revealing a complex 
                harmony of rare and precious ingredients carefully selected to create a signature scent.
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
                <span className="relative z-10">Top Notes</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]/30"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: 'Black Pepper', image: 'https://public.readdy.ai/ai/img_res/303530517b8a0beec45de9d0858b1f59.jpg' },
                  { name: 'Bergamot', image: 'https://public.readdy.ai/ai/img_res/b2922539e43aa7159d594d6c18e660e2.jpg' },
                  { name: 'Cardamom', image: 'https://public.readdy.ai/ai/img_res/132771f7dccd047954ae1c1a7aebaafb.jpg' },
                  { name: 'Saffron', image: 'https://public.readdy.ai/ai/img_res/deda5cfceefb7c19bf109f1324b4d7fa.jpg' }
                ].map((note, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="w-24 h-24 rounded-full border border-[#e8b600]/30 p-1 mb-4 overflow-hidden transform transition-transform duration-500 group-hover:scale-105 shadow-lg shadow-black/20">
                      <img src={note.image} alt={note.name} className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <h4 className="text-[#e8b600] group-hover:scale-110 transition-transform duration-300">{note.name}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-16">
              <h3 className="text-2xl font-light text-center mb-10 relative inline-block">
                <span className="relative z-10">Heart Notes</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]/30"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: 'Black Orchid', image: 'https://public.readdy.ai/ai/img_res/8b97854059e88a8743c5c9fd88853ca6.jpg' },
                  { name: 'Jasmine', image: 'https://public.readdy.ai/ai/img_res/4841a36892e9c4158d32b500dab9892a.jpg' },
                  { name: 'Iris', image: 'https://public.readdy.ai/ai/img_res/9418720651b1d258707af724c61229a0.jpg' },
                  { name: 'Rose Absolute', image: 'https://public.readdy.ai/ai/img_res/a27641bccc979ccb0cd74d7363f954f6.jpg' }
                ].map((note, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="w-24 h-24 rounded-full border border-[#e8b600]/30 p-1 mb-4 overflow-hidden transform transition-transform duration-500 group-hover:scale-105 shadow-lg shadow-black/20">
                      <img src={note.image} alt={note.name} className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <h4 className="text-[#e8b600] group-hover:scale-110 transition-transform duration-300">{note.name}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-light text-center mb-10 relative inline-block">
                <span className="relative z-10">Base Notes</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e8b600]/30"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: 'Amber', image: 'https://public.readdy.ai/ai/img_res/24433d73507bcbedd192749d34578008.jpg' },
                  { name: 'Sandalwood', image: 'https://public.readdy.ai/ai/img_res/626aeecf9f0f7420a49b9469e791a1ce.jpg' },
                  { name: 'Vanilla', image: 'https://public.readdy.ai/ai/img_res/00fe1db818c5bb3703b5f38c263d0acd.jpg' },
                  { name: 'Musk', image: 'https://public.readdy.ai/ai/img_res/6e2cc25cb506adfd54c30b78a5b59332.jpg' }
                ].map((note, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="w-24 h-24 rounded-full border border-[#e8b600]/30 p-1 mb-4 overflow-hidden transform transition-transform duration-500 group-hover:scale-105 shadow-lg shadow-black/20">
                      <img src={note.image} alt={note.name} className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <h4 className="text-[#e8b600] group-hover:scale-110 transition-transform duration-300">{note.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Ingredients Section */}
        {activeTab === 'ingredients' && (
          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-[#e8b600] mb-6">Ingredients</h2>
              <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
              <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-lg">
                Midnight Elixir is crafted from the finest natural and synthetic ingredients, 
                ethically sourced and carefully selected to ensure the highest quality and performance.
              </p>
            </div>
            
            {/* Gold grid lines in the background */}
            <div className="absolute inset-0 z-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: 'linear-gradient(to right, #e8b600 1px, transparent 1px), linear-gradient(to bottom, #e8b600 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }}></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                { 
                  name: 'Alcohol Denat', 
                  description: 'High-quality denatured alcohol that helps disperse and deliver the fragrance',
                  icon: 'fa-flask'
                },
                { 
                  name: 'Parfum (Fragrance)', 
                  description: 'Proprietary blend of natural and synthetic aromatic compounds',
                  icon: 'fa-air-freshener'
                },
                { 
                  name: 'Aqua (Water)', 
                  description: 'Purified water used as a solvent and carrier for the fragrance',
                  icon: 'fa-tint'
                },
                { 
                  name: 'Benzyl Salicylate', 
                  description: 'Organic compound with floral odor, found naturally in many flowers',
                  icon: 'fa-leaf'
                },
                { 
                  name: 'Limonene', 
                  description: 'Citrus-scented natural compound found in the rinds of citrus fruits',
                  icon: 'fa-lemon'
                },
                { 
                  name: 'Linalool', 
                  description: 'Naturally occurring terpene alcohol found in many flowers and spice plants',
                  icon: 'fa-seedling'
                },
                { 
                  name: 'Coumarin', 
                  description: 'Organic compound with sweet vanilla-like scent found in tonka beans',
                  icon: 'fa-mortar-pestle'
                },
                { 
                  name: 'Citral', 
                  description: 'Natural component of the essential oils of various plants with citrus scent',
                  icon: 'fa-leaf'
                },
                { 
                  name: 'Geraniol', 
                  description: 'Natural component found in rose oil and other essential oils',
                  icon: 'fa-spa'
                }
              ].map((ingredient, index) => (
                <div key={index} className="border border-[#e8b600]/30 p-6 bg-black/30 backdrop-blur-sm hover:bg-[#e8b600]/5 transition-all duration-300 group transform hover:-translate-y-1 shadow-lg shadow-black/10">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#e8b600]/10 flex items-center justify-center mr-4 group-hover:bg-[#e8b600]/20 transition-colors duration-300">
                      <i className={`fas ${ingredient.icon} text-[#e8b600]`}></i>
                    </div>
                    <h3 className="text-[#e8b600]">{ingredient.name}</h3>
                  </div>
                  <p className="text-sm text-gray-300">{ingredient.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 p-8 border border-[#e8b600]/30 bg-black/30 backdrop-blur-sm relative z-10">
              <h3 className="text-xl text-[#e8b600] mb-4 flex items-center">
                <i className="fas fa-leaf mr-3 text-[#e8b600]/80"></i>
                Our Commitment
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Midnight Elixir is formulated without parabens, phthalates, or artificial colors. 
                We are committed to ethical sourcing and sustainable practices in all aspects of our production.
              </p>
              <p className="text-gray-300 leading-relaxed">
                All ingredients are listed in compliance with International Nomenclature of Cosmetic Ingredients (INCI) standards.
                For a complete list of ingredients or concerns about specific allergens, please contact our customer service.
              </p>
            </div>
          </div>
        )}
        
        {/* Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-[#e8b600] mb-6">Customer Reviews</h2>
              <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12 mb-16 relative z-10">
              <div className="md:w-1/3">
                <div className="border border-[#e8b600]/30 p-8 bg-black/30 backdrop-blur-sm shadow-lg shadow-black/10">
                  <h2 className="text-4xl font-light text-[#e8b600] mb-2">4.8</h2>
                  <div className="flex text-[#e8b600] mb-4">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <p className="text-gray-300 mb-6">Based on 127 reviews</p>
                  
                  <div className="space-y-3">
                    {[
                      { stars: 5, percentage: 85 },
                      { stars: 4, percentage: 10 },
                      { stars: 3, percentage: 3 },
                      { stars: 2, percentage: 1 },
                      { stars: 1, percentage: 1 }
                    ].map((rating, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-12 flex text-[#e8b600]">
                          {rating.stars} <i className="fas fa-star ml-1"></i>
                        </div>
                        <div className="flex-1 h-2 bg-gray-700 ml-3">
                          <div 
                            className="h-2 bg-[#e8b600]" 
                            style={{ width: `${rating.percentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm text-gray-400">{rating.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-8 w-full border-2 border-[#e8b600] text-[#e8b600] px-6 py-3 hover:bg-[#e8b600] hover:text-black transition-all duration-300 group relative overflow-hidden">
                    <span className="relative z-10">Write a Review</span>
                    <span className="absolute inset-0 bg-[#e8b600] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                </div>
              </div>
              
              <div className="md:w-2/3 space-y-6">
                {[
                  {
                    name: 'Sophia R.',
                    avatar: 'https://public.readdy.ai/ai/img_res/a1d35c57474dfd563ed67b12987041b4.jpg',
                    rating: 5,
                    date: 'March 15, 2025',
                    title: 'Absolutely Divine',
                    review: 'Midnight Elixir has become my signature scent. The complexity of the fragrance evolves beautifully throughout the day, and I constantly receive compliments. The black orchid and amber combination is simply divine. Worth every penny for the quality and longevity.',
                    helpful: 24
                  },
                  {
                    name: 'James T.',
                    avatar: 'https://public.readdy.ai/ai/img_res/9451404e96907c4382712887eefdf6c7.jpg',
                    rating: 5,
                    date: 'February 28, 2025',
                    title: 'Sophisticated and Memorable',
                    review: 'As someone who typically avoids fragrances, Midnight Elixir has converted me. It\'s sophisticated without being overwhelming, and the sandalwood base note creates a warmth that lasts for hours. The bottle design is also a work of art - looks stunning on my dresser.',
                    helpful: 18
                  },
                  {
                    name: 'Elena M.',
                    avatar: 'https://public.readdy.ai/ai/img_res/34cc72cb1a0798670bc5e09c9021e995.jpg',
                    rating: 4,
                    date: 'March 22, 2025',
                    title: 'Beautiful but Strong',
                    review: 'The fragrance is undeniably beautiful and luxurious. My only caution is that it\'s quite potent - a single spray is more than enough. The sillage is impressive, and I\'ve had the scent last well into the next day. The packaging is exquisite and makes for a perfect gift.',
                    helpful: 12
                  }
                ].map((review, index) => (
                  <div key={index} className="border border-[#e8b600]/30 p-6 bg-black/30 backdrop-blur-sm group hover:border-[#e8b600]/50 transition-all duration-300 shadow-lg shadow-black/10">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full border border-[#e8b600]/50 overflow-hidden mr-4 shadow-md shadow-black/20">
                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-white group-hover:text-[#e8b600] transition-colors duration-300">{review.name}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <div className="flex text-[#e8b600] mr-2">
                            {Array(review.rating).fill(0).map((_, i) => (
                              <i key={i} className="fas fa-star"></i>
                            ))}
                          </div>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-[#e8b600] mb-2">{review.title}</h4>
                    <p className="text-gray-300 mb-4 leading-relaxed">{review.review}</p>
                    
                    <div className="flex items-center text-sm">
                      <button className="flex items-center text-gray-400 hover:text-[#e8b600] transition-colors duration-300">
                        <i className="far fa-thumbs-up mr-2"></i>
                        Helpful ({review.helpful})
                      </button>
                      <span className="mx-3 text-gray-600">|</span>
                      <button className="text-gray-400 hover:text-[#e8b600] transition-colors duration-300">
                        Report
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="w-full border-2 border-[#e8b600]/50 px-8 py-3 text-[#e8b600] hover:bg-[#e8b600] hover:text-black transition-all duration-300 group relative overflow-hidden">
                  <span className="relative z-10">Load More Reviews</span>
                  <span className="absolute inset-0 bg-[#e8b600] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-40"></div>
            <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-[#e8b600]/5 filter blur-3xl opacity-30"></div>
          </div>
        )}
      </div>
      
      {/* Related Products */}
      <div className="bg-[#050505] py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[#e8b600] mb-6">You May Also Like</h2>
            <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-6"></div>
          </div>
          
          {/* Gold grid lines */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(to right, #e8b600 1px, transparent 1px), linear-gradient(to bottom, #e8b600 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}></div>
          </div>
          
          {/* Abstract gold shapes */}
          <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-[#e8b600]/10 filter blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              {
                name: 'Velvet Noir',
                price: '₺245.00',
                image: 'https://public.readdy.ai/ai/img_res/12ddd5846c7a0f843c0e8995178c0d21.jpg'
              },
              {
                name: 'Golden Oud',
                price: '₺320.00',
                image: 'https://public.readdy.ai/ai/img_res/945058f75bcf33b68d7004676e26fff2.jpg'
              },
              {
                name: 'Moonlight Jasmine',
                price: '₺275.00',
                image: 'https://public.readdy.ai/ai/img_res/284d56475704fa3481336dcd29ca708f.jpg'
              },
              {
                name: 'Amber Mystique',
                price: '₺295.00',
                image: 'https://public.readdy.ai/ai/img_res/ed664c8bb74a219b914289e7224c19c6.jpg'
              }
            ].map((product, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-b from-[#0a0a0a] to-[#111] group relative overflow-hidden cursor-pointer transform transition-transform duration-500 hover:-translate-y-2 shadow-xl shadow-black/50"
              >
                <div className="relative mb-0 h-80 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-light text-[#e8b600] mb-1">{product.name}</h3>
                  <div className="w-12 h-0.5 bg-[#e8b600] mb-3 transition-all duration-300 group-hover:w-20"></div>
                  <p className="text-white">{product.price}</p>
                </div>
                
                {/* Border animation on hover */}
                <div className="absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-[#e8b600]/50"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for animations */}
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
          animation: fade-in-up 1.5s forwards ease-out;
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 30s alternate infinite ease-in-out;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default DetailsPage;

