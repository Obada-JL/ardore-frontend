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
  const [removingItems, setRemovingItems] = useState(new Set());

  // Helper function to get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[locale] || textObj.en || textObj.ar || textObj.tr || '';
    }
    return '';
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
        className={`fixed ${isRTL ? 'left-0' : 'right-0'} top-0 h-full w-96 max-w-[90vw] bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? '-translate-x-full' 
              : 'translate-x-full'
        }`}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {t('title') || 'Shopping Cart'}
                </h2>
                <p className="text-white/80 text-sm">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
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

        {/* Cart Content */}
        <div className="flex-1 flex flex-col h-full">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col p-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#e8b600]/20 to-[#f4c430]/20 rounded-full flex items-center justify-center">
                  <ShoppingBag size={40} className="text-[#e8b600]" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">0</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-center text-sm mb-6">
                Add some amazing perfumes to your cart and create your signature scent collection
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {t('continueShopping') || 'Continue Shopping'}
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {cart.map((item, index) => {
                    // Calculate price based on size and product structure
                    let price;
                    if (item.product.sizesPricing && item.product.sizesPricing.length > 0) {
                      // Use new structure - find price for specific size
                      const sizePricing = item.product.sizesPricing.find(sp => sp.size === item.size);
                      price = sizePricing ? sizePricing.price : (item.product.discountedPrice || item.product.price || 0);
                    } else {
                      // Fallback to old structure
                      price = item.product.discountedPrice || item.product.price || 0;
                    }
                    const isRemoving = removingItems.has(item.id);
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                          isRemoving ? 'opacity-50 scale-95' : ''
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
                                {item.product.mainImage && (
                                  <img
                                    src={`https://api.ardoreperfume.com/uploads/${item.product.mainImage}`}
                                    alt={getLocalizedText(item.product.title) || 'Product'}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#e8b600] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{item.quantity}</span>
                              </div>
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 truncate text-sm mb-1">
                                {getLocalizedText(item.product.title) || 'Product Name'}
                              </h3>
                              <div className="flex items-center space-x-1 mb-2">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {item.size}ml
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {item.quality}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#e8b600]">
                                  ${price}
                                </span>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-8 h-8 border-2 border-[#e8b600] rounded-full flex items-center justify-center text-[#e8b600] hover:bg-[#e8b600] hover:text-white transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 border-2 border-[#e8b600] rounded-full flex items-center justify-center text-[#e8b600] hover:bg-[#e8b600] hover:text-white transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-500">Total:</span>
                              <span className="text-lg font-bold text-gray-800 ml-2">
                                ${(price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 space-y-4 bg-white">
                {/* Applied Discount Display */}
                {appliedDiscount && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Gift className="text-green-600" size={16} />
                      </div>
                      <div>
                        <span className="text-green-700 font-semibold text-sm">{appliedDiscount.code}</span>
                        <p className="text-green-600 text-xs">
                          {appliedDiscount.discountType === 'percentage' 
                            ? `${appliedDiscount.discountValue}% off` 
                            : `$${appliedDiscount.discountValue} off`}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-700 font-bold">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600">Discount ({appliedDiscount.code}):</span>
                      <span className="text-green-600 font-semibold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-[#e8b600] text-xl">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Proceed to Checkout</span>
                </button>
                
                {/* Continue Shopping Link */}
                <button
                  onClick={onClose}
                  className="w-full text-center text-gray-500 hover:text-[#e8b600] py-2 text-sm font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
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