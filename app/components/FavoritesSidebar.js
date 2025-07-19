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
            // Remove the removing state if the operation failed
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
            // Add to cart with default size and quality
            const defaultSize = perfume.sizes?.[0] || 50;
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
        
        // Close the sidebar and navigate to the product page
        onClose();
        router.push(`/${locale}/perfume/${perfume.urlName}`);
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            
            {/* Sidebar */}
            <div 
                className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-96 max-w-[90vw] bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
                    isOpen 
                        ? 'translate-x-0' 
                        : isRTL 
                            ? '-translate-x-full' 
                            : 'translate-x-full'
                }`}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="relative p-6 bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Heart size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {t('title') || 'Favorites'}
                                    </h2>
                                    <p className="text-white/80 text-sm">
                                        {favoritesCount} {favoritesCount === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }} 
                                className="p-2 hover:bg-white/20 rounded-full transition-colors z-10 relative"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 opacity-20">
                            <Sparkles size={60} className="text-white" />
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8b600]"></div>
                            </div>
                        ) : favorites.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center flex-col p-8">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#e8b600]/20 to-[#f4c430]/20 rounded-full flex items-center justify-center">
                                        <Heart size={40} className="text-[#e8b600]" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">0</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    No favorites yet
                                </h3>
                                <p className="text-gray-500 text-center text-sm mb-6">
                                    Start adding your favorite perfumes to create your personal collection
                                </p>
                                <button
                                    onClick={onClose}
                                    className="bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Explore Perfumes
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4 max-h-full overflow-y-auto">
                                {favorites.filter(perfume => perfume && perfume._id).map((perfume, index) => (
                                    <div 
                                        key={perfume._id} 
                                        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                                            removingItems.has(perfume._id) ? 'opacity-50 scale-95' : ''
                                        }`}
                                        style={{ 
                                            animationDelay: `${index * 100}ms`,
                                            animation: isOpen ? 'slideInFromRight 0.4s ease-out forwards' : 'none'
                                        }}
                                    >
                                        <div className="p-4">
                                            <div className="flex space-x-4">
                                                {/* Product Image */}
                                                <div className="relative w-20 h-20 flex-shrink-0">
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                                                        <Image
                                                            src={`http://localhost:5000/${perfume.image}`}
                                                            alt={getLocalizedText(perfume.title)}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                        <Heart size={12} className="text-white fill-current" />
                                                    </div>
                                                </div>
                                                
                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-800 truncate text-sm mb-1">
                                                        {getLocalizedText(perfume.title)}
                                                    </h3>
                                                    <div className="flex items-center space-x-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                        <span className="text-xs text-gray-500 ml-1">4.8</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-bold text-[#e8b600]">
                                                            ${perfume.price}
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemoveFromFavorites(perfume._id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="mt-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleAddToCart(perfume)}
                                                    disabled={addingToCart.has(perfume._id)}
                                                    className="flex-1 bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-white py-2 px-4 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ShoppingBag size={16} />
                                                    <span>
                                                        {addingToCart.has(perfume._id) ? 'Adding...' : 'Add to Cart'}
                                                    </span>
                                                </button>
                                                <button 
                                                    onClick={() => handleViewProduct(perfume)}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Animation Styles */}
            <style jsx>{`
                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
} 