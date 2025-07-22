"use client"
import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, Tag, Gift, CreditCard, Sparkles, Star } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function CartSidebar({ isOpen, onClose }) {
  const t = useTranslations('Cart');
  const { cart, subtotal, discountAmount, finalTotal, cartCount, updateCartItem, removeFromCart, appliedDiscount } = useOrder();
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const isDarkTheme = locale === 'ar' || locale === 'tr';
  const [removingItems, setRemovingItems] = useState(new Set());

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[locale] || textObj.en || textObj.ar || textObj.tr || '';
    }
    return '';
  };

  // Helper function to get price with fallback
  const getItemPrice = (item) => {
    let price = 0;
    
    if (item.product.sizesPricing && item.product.sizesPricing.length > 0) {
      const sizePricing = item.product.sizesPricing.find(sp => sp.size === item.size);
      price = sizePricing ? sizePricing.price : item.product.sizesPricing[0].price;
    } else {
      price = item.product.discountedPrice || item.product.price || 0;
    }
    
    return isNaN(price) ? 0 : parseFloat(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <>
      {/* Enhanced Overlay */}
      <div 
        className={`cart-sidebar-overlay fixed inset-0 bg-black/70 backdrop-blur-md z-[9998] transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Compact Enhanced Sidebar */}
      <div 
        className={`cart-sidebar-container fixed ${isRTL ? 'left-0' : 'right-0'} top-0 h-screen w-[24rem] max-w-[90vw] ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]' 
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        } shadow-2xl z-[9999] transform transition-all duration-500 ease-out ${
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
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {t('title') || 'Shopping Cart'}
                  </h2>
                  <p className="text-white/90 text-xs font-medium">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
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

          {/* Compact Cart Content */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {cart.length === 0 ? (
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
                    <ShoppingBag size={32} className="text-[#e8b600]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">0</span>
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${
                  isDarkTheme ? 'text-white' : 'text-gray-800'
                } mb-2`}>
                  Your cart is empty
                </h3>
                <p className={`${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                } text-center text-sm mb-6 leading-relaxed max-w-xs`}>
                  Add some amazing perfumes to your cart
                </p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#e8b600]/25 transition-all duration-300 transform hover:scale-105"
                >
                  {t('continueShopping') || 'Continue Shopping'}
                </button>
              </div>
            ) : (
              <>
                {/* Compact Cart Items */}
                <div className="flex-1 relative overflow-hidden">
                  <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#e8b600] scrollbar-track-transparent hover:scrollbar-thumb-[#d4a500] scroll-smooth">
                    <div className="p-4 space-y-3">
                      {cart.map((item, index) => {
                        const price = getItemPrice(item);
                        const isRemoving = removingItems.has(item.id);
                        
                        return (
                          <div 
                            key={item.id} 
                            className={`${
                              isDarkTheme 
                                ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border-[#e8b600]/20 hover:border-[#e8b600]/40' 
                                : 'bg-white border-gray-200 hover:border-[#e8b600]/40'
                            } rounded-2xl shadow-lg border backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-xl transform ${
                              isRemoving ? 'opacity-50 scale-95' : ''
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
                                    {item.product.mainImage && (
                                      <img
                                        src={`https://api.ardoreperfume.com/uploads/${item.product.mainImage}`}
                                        alt={getLocalizedText(item.product.title) || 'Product'}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#e8b600] to-[#f4c430] rounded-full flex items-center justify-center">
                                    <span className="text-black text-xs font-bold">{item.quantity}</span>
                                  </div>
                                </div>
                                
                                {/* Compact Product Details */}
                                <div className="flex-1 min-w-0">
                                  <h3 className={`text-sm font-bold ${
                                    isDarkTheme ? 'text-[#e8b600]' : 'text-gray-800'
                                  } truncate mb-1`}>
                                    {getLocalizedText(item.product.title) || 'Product Name'}
                                  </h3>
                                  <div className="flex items-center space-x-1 mb-2">
                                    <span className={`text-xs ${
                                      isDarkTheme 
                                        ? 'text-[#e8b600] bg-[#e8b600]/10 border-[#e8b600]/20' 
                                        : 'text-gray-500 bg-gray-100 border-gray-200'
                                    } px-2 py-0.5 rounded-full border`}>
                                      {item.size}ml
                                    </span>
                                    <span className={`text-xs ${
                                      isDarkTheme 
                                        ? 'text-[#e8b600] bg-[#e8b600]/10 border-[#e8b600]/20' 
                                        : 'text-gray-500 bg-gray-100 border-gray-200'
                                    } px-2 py-0.5 rounded-full border`}>
                                      {item.quality}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-[#e8b600]">
                                      ₺{price.toFixed(2)}
                                    </span>
                                    <button
                                      onClick={() => handleRemoveItem(item.id)}
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
                              
                              {/* Compact Quantity Controls */}
                              <div className={`flex items-center justify-between mt-3 pt-3 ${
                                isDarkTheme ? 'border-t border-[#e8b600]/20' : 'border-t border-gray-100'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-7 h-7 border border-[#e8b600] rounded-lg flex items-center justify-center text-[#e8b600] hover:bg-[#e8b600] hover:text-black transition-all duration-300 disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className={`px-3 py-1 ${
                                    isDarkTheme ? 'bg-[#1a1a1a] border-[#e8b600]/20' : 'bg-gray-100 border-gray-200'
                                  } border rounded-lg text-xs font-bold min-w-[2.5rem] text-center ${
                                    isDarkTheme ? 'text-[#e8b600]' : 'text-gray-800'
                                  }`}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="w-7 h-7 border border-[#e8b600] rounded-lg flex items-center justify-center text-[#e8b600] hover:bg-[#e8b600] hover:text-black transition-all duration-300"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs ${
                                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                  }`}>Total:</span>
                                  <span className={`text-sm font-bold ${
                                    isDarkTheme ? 'text-white' : 'text-gray-800'
                                  } ml-1`}>
                                    ₺{(price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                </div>

                {/* Compact Footer */}
                <div className={`${
                  isDarkTheme 
                    ? 'border-t border-[#e8b600]/20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]' 
                    : 'border-t border-gray-200 bg-white'
                } p-4 space-y-3 relative`}>
                  {/* Applied Discount Display */}
                  {appliedDiscount && (
                    <div className={`flex items-center justify-between p-3 ${
                      isDarkTheme 
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-400' 
                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400'
                    } rounded-lg`}>
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 ${
                          isDarkTheme ? 'bg-green-500/20' : 'bg-green-100'
                        } rounded-lg`}>
                          <Gift className="text-green-600" size={12} />
                        </div>
                        <div>
                          <span className={`${
                            isDarkTheme ? 'text-green-400' : 'text-green-700'
                          } font-semibold text-xs`}>{appliedDiscount.code}</span>
                          <p className={`${
                            isDarkTheme ? 'text-green-500' : 'text-green-600'
                          } text-xs`}>
                            {appliedDiscount.discountType === 'percentage' 
                              ? `${appliedDiscount.discountValue}% off` 
                              : `₺${appliedDiscount.discountValue} off`}
                          </p>
                        </div>
                      </div>
                      <span className={`${
                        isDarkTheme ? 'text-green-400' : 'text-green-700'
                      } font-bold text-sm`}>
                        -₺{(discountAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Compact Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                      <span className={`font-semibold ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
                        ₺{(subtotal || 0).toFixed(2)}
                      </span>
                    </div>
                    
                    {appliedDiscount && discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600">Discount ({appliedDiscount.code}):</span>
                        <span className="text-green-600 font-semibold">-₺{(discountAmount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </div>
                    
                    <div className={`flex justify-between items-center text-base font-bold ${
                      isDarkTheme ? 'border-t border-[#e8b600]/20' : 'border-t border-gray-200'
                    } pt-2`}>
                      <span className={isDarkTheme ? 'text-white' : 'text-gray-800'}>Total:</span>
                      <span className="text-[#e8b600] text-lg">₺{(finalTotal || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Compact Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-black py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#e8b600]/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                  >
                    <CreditCard size={16} />
                    <span>Proceed to Checkout</span>
                  </button>
                  
                  {/* Continue Shopping Link */}
                  <button
                    onClick={onClose}
                    className={`w-full text-center ${
                      isDarkTheme ? 'text-gray-400 hover:text-[#e8b600]' : 'text-gray-500 hover:text-[#e8b600]'
                    } py-2 text-xs font-medium transition-colors rounded-lg hover:bg-[#e8b600]/5`}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Enhanced side glow effect */}
          <div className="absolute inset-y-0 -left-2 w-2 bg-gradient-to-r from-[#e8b600]/10 to-transparent pointer-events-none"></div>
        </div>
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
        
        /* Ensure sidebars stay on top during scroll */
        .cart-sidebar-overlay {
          position: fixed !important;
          z-index: 9998 !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
        }
        
        .cart-sidebar-container {
          position: fixed !important;
          z-index: 9999 !important;
          top: 0 !important;
          bottom: 0 !important;
        }
        
        /* Prevent sidebar from being affected by page scroll */
        .cart-sidebar-container * {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
}