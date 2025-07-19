"use client"
import { useState, useEffect } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../../lib/api/orders';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Lock, CheckCircle, Tag, X } from 'lucide-react';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const { cart, subtotal, discountAmount, finalTotal, clearCart, setLoading, setError, appliedDiscount, validateDiscount, removeDiscount, discountLoading, discountError } = useOrder();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  // Pre-populate user info if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || user.fullName || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/');
    }
  }, [cart.length, orderPlaced, router]);

  const handleCustomerInfoChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    const result = await validateDiscount(discountCode.trim());
    if (result.success) {
      setDiscountCode(''); // Clear input after successful application
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setDiscountCode('');
  };

  const validateStep1 = () => {
    return customerInfo.name && customerInfo.email && customerInfo.phone;
  };

  const validateStep2 = () => {
    return paymentMethod;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1() || !validateStep2()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        customer: customerInfo,
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          quality: item.quality
        })),
        paymentMethod,
        notes,
        discountCode: appliedDiscount?.code || null
      };

      const response = await createOrder(orderData);
      setOrderNumber(response.orderNumber);
      setOrderPlaced(true);
      clearCart();
      setStep(3);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      setError('Please fill in all required fields');
      return;
    }
    setStep(step + 1);
    setError(null);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError(null);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] flex items-center justify-center p-4 bg-black">
        <div className="bg-gray-900 border border-[#e8b600]/20 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto mb-4 text-[#e8b600]" size={64} />
          <h2 className="text-2xl font-bold text-white mb-4">{t('orderPlaced')}</h2>
          <p className="text-gray-300 mb-4">{t('orderPlacedMessage')}</p>
          <div className="bg-gray-800 border border-[#e8b600]/30 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-400">{t('orderNumber')}</p>
            <p className="text-lg font-semibold text-[#e8b600]">{orderNumber}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-[#e8b600] text-black py-3 rounded-lg font-semibold hover:bg-[#d4a500] transition-colors"
          >
            {t('continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] py-8 pt-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-[#e8b600] text-black' : 'bg-gray-700 text-gray-400'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#e8b600]' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-[#e8b600] text-black' : 'bg-gray-700 text-gray-400'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-[#e8b600]' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-[#e8b600] text-black' : 'bg-gray-700 text-gray-400'
              }`}>
                3
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 border border-[#e8b600]/20 rounded-lg shadow-xl p-6">
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Truck className="mr-2 text-[#e8b600]" size={24} />
                      {t('shippingInfo')}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {t('name')} *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                            value={customerInfo.name}
                            disabled={true}
                            onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {t('email')} *
                          </label>
                          <input
                            type="email"
                            disabled={true}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                            value={customerInfo.email}
                            onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {t('phone')} *
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                          value={customerInfo.phone}
                          onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {t('street')}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                          value={customerInfo.address.street}
                          onChange={(e) => handleCustomerInfoChange('address.street', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {t('city')}
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                            value={customerInfo.address.city}
                            onChange={(e) => handleCustomerInfoChange('address.city', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {t('state')}
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                            value={customerInfo.address.state}
                            onChange={(e) => handleCustomerInfoChange('address.state', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {t('zipCode')}
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                            value={customerInfo.address.zipCode}
                            onChange={(e) => handleCustomerInfoChange('address.zipCode', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {t('country')}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                          value={customerInfo.address.country}
                          onChange={(e) => handleCustomerInfoChange('address.country', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <CreditCard className="mr-2 text-[#e8b600]" size={24} />
                      {t('paymentMethod')}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { value: 'cash', label: t('cash'), icon: '💵' },
                          { value: 'card', label: t('card'), icon: '💳' },
                          { value: 'bank_transfer', label: t('bankTransfer'), icon: '🏦' },
                          { value: 'other', label: t('other'), icon: '💰' }
                        ].map(method => (
                          <label key={method.value} className="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={paymentMethod === method.value}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="mr-3 text-[#e8b600] focus:ring-[#e8b600]"
                            />
                            <span className="mr-3 text-xl">{method.icon}</span>
                            <span className="font-medium text-white">{method.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {t('notes')}
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={t('notesPlaceholder')}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {t('back')}
                    </button>
                  ) : <div></div>}
                  
                  {step < 2 ? (
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-[#e8b600] text-black rounded-lg hover:bg-[#d4a500] transition-colors"
                    >
                      {t('next')}
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      className="px-6 py-2 bg-[#e8b600] text-black rounded-lg hover:bg-[#d4a500] transition-colors flex items-center"
                    >
                      <Lock className="mr-2" size={16} />
                      {t('placeOrder')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-gray-900 border border-[#e8b600]/20 rounded-lg shadow-xl p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-white mb-4">{t('orderSummary')}</h3>
                
                {/* Discount Code Section */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Tag className="mr-2 text-[#e8b600]" size={16} />
                    <label className="text-sm font-medium text-gray-300">Discount Code</label>
                  </div>
                  
                  {appliedDiscount ? (
                    <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <div>
                        <span className="text-green-400 font-medium">{appliedDiscount.code}</span>
                        <p className="text-xs text-green-300">
                          {appliedDiscount.discountType === 'percentage' 
                            ? `${appliedDiscount.discountValue}% off` 
                            : `$${appliedDiscount.discountValue} off`}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveDiscount}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={discountLoading || !discountCode.trim()}
                        className="px-4 py-2 bg-[#e8b600] text-black rounded-md hover:bg-[#d4a500] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {discountLoading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  
                  {discountError && (
                    <p className="text-red-400 text-xs mt-2">{discountError}</p>
                  )}
                </div>
                
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {cart.map((item) => {
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
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-white">{item.product.title?.en}</p>
                          <p className="text-gray-400">{item.size}ml - {item.quality} × {item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-300">${(price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pricing Breakdown */}
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-gray-300">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Discount ({appliedDiscount.code}):</span>
                      <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-700 pt-2">
                    <span className="text-white">{t('total')}:</span>
                    <span className="text-[#e8b600]">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 