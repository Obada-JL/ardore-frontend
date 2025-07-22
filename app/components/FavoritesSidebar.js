'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Heart, ShoppingBag, Trash2, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useFavorites } from '../context/FavoritesContext';
import { useOrder } from '../context/OrderContext';
import { useRouter } from 'next/navigation';

export default function FavoritesSidebar({ isOpen, onClose }) {
    const t = useTranslations('Favorites');
    const { favorites, favoritesCount, loading, removeFromFavorites } = useFavorites();
    const { addToCart } = useOrder();
    const router = useRouter();
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const isDarkTheme = locale === 'ar' || locale === 'tr';
    const [removingItems, setRemovingItems] = useState(new Set());
    const [addingToCart, setAddingToCart] = useState(new Set());

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
        return `₺${perfume.price || 0}`;
    };

    const handleRemoveFromFavorites = async (perfumeId) => {
        setRemovingItems(prev => new Set(prev).add(perfumeId));
        
        const success = await removeFromFavorites(perfumeId);
        
        if (success) {
            setTimeout(() => {
                setRemovingItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(perfumeId);
                    return newSet;
                });
            }, 300);
        } else {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(perfumeId);
                return newSet;
            });
        }
    };

    const handleAddToCart = async (perfume) => {
        if (!perfume || !perfume._id) {
            console.error('Invalid perfume object');
            return;
        }
        
        setAddingToCart(prev => new Set(prev).add(perfume._id));
        
        try {
            // Get default size and price
            let defaultSize, defaultPrice;
            
            if (perfume.sizesPricing && perfume.sizesPricing.length > 0) {
                const firstSizePricing = perfume.sizesPricing[0];
                defaultSize = firstSizePricing.size;
                defaultPrice = firstSizePricing.price;
            } else {
                defaultSize = perfume.sizes?.[0] || 50;
                defaultPrice = perfume.price || 0;
            }
            
            const defaultQuality = 'Premium';
            
            await addToCart(perfume, 1, defaultSize, defaultQuality);
            
            // Show success feedback
            alert('Product added to cart successfully!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart. Please try again.');
        } finally {
            setAddingToCart(prev => {
                const newSet = new Set(prev);
                newSet.delete(perfume._id);
                return newSet;
            });
        }
    };

    const handleViewProduct = (perfume) => {
        if (!perfume || !perfume.urlName) {
            console.error('Invalid perfume object or missing urlName');
            return;
        }
        
        onClose();
        router.push(`/${locale}/perfume/${perfume.urlName}`);
    };

    return (
        <>
            {/* Enhanced Overlay */}
            <div 
                className={`favorites-sidebar-overlay fixed inset-0 bg-black/70 backdrop-blur-md z-[9998] transition-all duration-500 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />
            
            {/* Enhanced Sidebar */}
            <div 
                className={`favorites-sidebar-container fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-[24rem] max-w-[90vw] h-screen ${
                    isDarkTheme 
                        ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]' 
                        : 'bg-gradient-to-br from-white via-gray-50 to-white'
                } shadow-2xl transform transition-all duration-500 ease-out z-[9999] ${
                    isOpen 
                        ? 'translate-x-0' 
                        : isRTL 
                            ? '-translate-x-full' 
                            : 'translate-x-full'
                } ${isDarkTheme ? 'border-l border-[#e8b600]/20' : 'border-l border-gray-200'}`}
                style={{ 
                    direction: isRTL ? 'rtl' : 'ltr',
                    position: 'fixed',
                    zIndex: 9999,
                    top: 0,
                    bottom: 0
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-full flex flex-col relative overflow-hidden">
                    {/* Compact Header */}
                    <div className={`relative p-4 ${
                        isDarkTheme 
                            ? 'bg-gradient-to-r from-[#e8b600] via-[#f4c430] to-[#e8b600]' 
                            : 'bg-gradient-to-r from-[#e8b600] to-[#f4c430]'
                    } text-black overflow-hidden`}>
                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-black/20 rounded-xl backdrop-blur-sm">
                                    <Heart size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        {t('title') || 'Favorites'}
                                    </h2>
                                    <p className="text-white/90 text-xs font-medium">
                                        {favoritesCount} {favoritesCount === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-black/20 rounded-xl transition-all duration-300 backdrop-blur-sm transform hover:scale-110"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>
                        
                        {/* Small decorative elements */}
                        <div className="absolute top-2 right-12 opacity-30">
                            <Sparkles size={14} className="text-white animate-pulse" />
                        </div>
                    </div>
                    
                    {/* Content with improved scrolling */}
                    <div className="flex-1 relative overflow-hidden">
                        {loading ? (
                            <div className={`flex items-center justify-center h-full ${
                                isDarkTheme ? 'bg-gradient-to-b from-transparent to-[#1a1a1a]/50' : ''
                            }`}>
                                <div className="text-center">
                                    <div className="relative mb-4">
                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-[#e8b600] border-r-[#e8b600] mx-auto shadow-lg shadow-[#e8b600]/20"></div>
                                        <div className="absolute inset-0 rounded-full h-10 w-10 border-4 border-transparent border-b-[#e8b600]/30 border-l-[#e8b600]/30 animate-pulse"></div>
                                    </div>
                                    <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} font-medium text-sm`}>
                                        Loading favorites...
                                    </p>
                                </div>
                            </div>
                        ) : favorites.length === 0 ? (
                            <div className={`flex-1 flex items-center justify-center flex-col p-6 ${
                                isDarkTheme ? 'bg-gradient-to-b from-transparent via-[#1a1a1a]/30 to-[#0a0a0a]' : ''
                            }`}>
                                <div className="relative mb-6">
                                    <div className={`w-20 h-20 ${
                                        isDarkTheme 
                                            ? 'bg-gradient-to-br from-[#e8b600]/20 to-[#f4c430]/10' 
                                            : 'bg-gradient-to-br from-[#e8b600]/20 to-[#f4c430]/20'
                                    } rounded-2xl flex items-center justify-center shadow-xl ${
                                        isDarkTheme ? 'shadow-[#e8b600]/10' : 'shadow-[#e8b600]/20'
                                    }`}>
                                        <Heart size={32} className="text-[#e8b600]" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-xs font-bold">0</span>
                                    </div>
                                </div>
                                <h3 className={`text-lg font-bold ${
                                    isDarkTheme ? 'text-white' : 'text-gray-800'
                                } mb-2`}>
                                    No favorites yet
                                </h3>
                                <p className={`${
                                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                } text-center text-sm mb-6 leading-relaxed max-w-xs`}>
                                    Start building your personal collection
                                </p>
                                <button
                                    onClick={onClose}
                                    className="bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#e8b600]/25 transition-all duration-300 transform hover:scale-105"
                                >
                                    Explore Perfumes
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Custom scrollbar styling and content */}
                                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#e8b600] scrollbar-track-transparent hover:scrollbar-thumb-[#d4a500] scroll-smooth">
                                    <div className="p-4 space-y-3">
                                        {favorites.filter(perfume => perfume && perfume._id).map((perfume, index) => (
                                            <div 
                                                key={perfume._id} 
                                                className={`${
                                                    isDarkTheme 
                                                        ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border-[#e8b600]/20 hover:border-[#e8b600]/40' 
                                                        : 'bg-white border-gray-200 hover:border-[#e8b600]/40'
                                                } rounded-2xl shadow-lg border backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.02] transform ${
                                                    removingItems.has(perfume._id) ? 'opacity-50 scale-95' : ''
                                                } ${isDarkTheme ? 'hover:shadow-[#e8b600]/10' : ''}`}
                                                style={{ 
                                                    animationDelay: `${index * 100}ms`,
                                                    animation: isOpen ? 'slideInFromRight 0.6s ease-out forwards' : 'none'
                                                }}
                                            >
                                                <div className="p-4">
                                                    <div className="flex space-x-3">
                                                        {/* Compact Product Image */}
                                                        <div className="relative w-16 h-16 flex-shrink-0">
                                                            <div className={`w-full h-full ${
                                                                isDarkTheme 
                                                                    ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]' 
                                                                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                                                            } rounded-xl overflow-hidden shadow-md`}>
                                                                <Image
                                                                    src={`https://api.ardoreperfume.com/${perfume.image}`}
                                                                    alt={getLocalizedText(perfume.title)}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                                                <Heart size={10} className="text-white fill-current" />
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Compact Product Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className={`text-sm font-bold ${
                                                                isDarkTheme ? 'text-[#e8b600]' : 'text-gray-800'
                                                            } truncate mb-1`}>
                                                                {getLocalizedText(perfume.title)}
                                                            </h3>
                                                            <div className="flex items-center space-x-1 mb-2">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={10}
                                                                        className={`${i < 4 ? 'text-yellow-400 fill-current' : isDarkTheme ? 'text-gray-600' : 'text-gray-300'}`}
                                                                    />
                                                                ))}
                                                                <span className={`text-xs ${
                                                                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                                                } ml-1`}>4.8</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-bold text-[#e8b600]">
                                                                    {getPerfumePriceDisplay(perfume)}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleRemoveFromFavorites(perfume._id)}
                                                                    className={`p-1.5 ${
                                                                        isDarkTheme 
                                                                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20' 
                                                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                                    } rounded-lg transition-all duration-300`}
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Compact Size badges */}
                                                    {perfume.sizesPricing && perfume.sizesPricing.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                            {perfume.sizesPricing.map((sizePrice, idx) => (
                                                                <span 
                                                                    key={idx}
                                                                    className={`text-xs ${
                                                                        isDarkTheme 
                                                                            ? 'bg-[#e8b600]/10 text-[#e8b600] border-[#e8b600]/20' 
                                                                            : 'bg-[#e8b600]/10 text-[#e8b600] border-[#e8b600]/20'
                                                                    } px-2 py-0.5 rounded-full border transition-colors duration-300`}
                                                                    title={`${sizePrice.size}ml - ₺${sizePrice.price}`}
                                                                >
                                                                    {sizePrice.size}ml
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Compact Action Buttons */}
                                                    <div className="mt-4 flex space-x-2">
                                                        <button
                                                            onClick={() => handleAddToCart(perfume)}
                                                            disabled={addingToCart.has(perfume._id)}
                                                            className="flex-1 bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-black py-2 px-3 rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-[#e8b600]/25 transition-all duration-300 flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                                        >
                                                            <ShoppingBag size={12} />
                                                            <span>
                                                                {addingToCart.has(perfume._id) ? 'Adding...' : 'Add to Cart'}
                                                            </span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleViewProduct(perfume)}
                                                            className={`px-3 py-2 ${
                                                                isDarkTheme 
                                                                    ? 'border-[#e8b600]/30 text-[#e8b600] hover:bg-[#e8b600]/10' 
                                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            } border rounded-xl font-bold text-xs transition-all duration-300 transform hover:scale-[1.02]`}
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Scroll indicator */}
                                    <div className="h-2"></div>
                                </div>
                                
                                {/* Scroll gradient overlay */}
                                <div className={`absolute bottom-0 left-0 right-0 h-4 ${
                                    isDarkTheme 
                                        ? 'bg-gradient-to-t from-[#0a0a0a] to-transparent' 
                                        : 'bg-gradient-to-t from-white to-transparent'
                                } pointer-events-none`}></div>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Enhanced side glow effect */}
                <div className="absolute inset-y-0 -left-2 w-2 bg-gradient-to-r from-[#e8b600]/10 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Enhanced Animation Styles */}
            <style jsx global>{`
                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(40px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }
                
                /* Custom scrollbar */
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                
                .scrollbar-thumb-\\[\\#e8b600\\]::-webkit-scrollbar-thumb {
                    background: #e8b600;
                    border-radius: 2px;
                }
                
                .scrollbar-track-transparent::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .scroll-smooth {
                    scroll-behavior: smooth;
                }
                
                /* Hover effects for scrollbar */
                .scrollbar-thin:hover::-webkit-scrollbar-thumb {
                    background: #d4a500;
                }
                
                /* Ensure favorites sidebar stays on top during scroll */
                .favorites-sidebar-overlay {
                    position: fixed !important;
                    z-index: 9998 !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                }
                
                .favorites-sidebar-container {
                    position: fixed !important;
                    z-index: 9999 !important;
                    top: 0 !important;
                    bottom: 0 !important;
                }
                
                /* Prevent sidebar from being affected by page scroll */
                .favorites-sidebar-container * {
                    transform-style: preserve-3d;
                    backface-visibility: hidden;
                }
            `}</style>
        </>
    );
} 