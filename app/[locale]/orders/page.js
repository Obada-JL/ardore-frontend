"use client"
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { getUserOrders } from '../../../lib/api/orders';
import { useRouter } from 'next/navigation';
import { Package, Calendar, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function OrdersPage() {
  const t = useTranslations('Orders');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { setLoading, setError } = useOrder();
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLocalLoading] = useState(true);
  const [error, setLocalError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLocalLoading(true);
        const response = await getUserOrders();
        setOrders(response);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLocalError(error.message);
      } finally {
        setLocalLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-500" size={20} />;
      case 'processing':
        return <Package className="text-purple-500" size={20} />;
      case 'shipped':
        return <Truck className="text-indigo-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-purple-600 bg-purple-100';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8b600] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] text-white flex items-center justify-center pt-20 bg-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-[#e8b600] text-black rounded hover:bg-[#d4a500] transition-colors"
          >
            
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-light text-[#e8b600] mb-2">My Orders</h1>
            <p className="text-gray-400">Track and manage your perfume orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto mb-4 text-gray-500" size={64} />
              <h2 className="text-2xl font-light text-gray-400 mb-4">No orders yet</h2>
              <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
              <button
                onClick={() => router.push('/')}
                className="bg-[#e8b600] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#d4a500] transition-colors"
              >
                Browse Perfumes
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-black/40 border border-[#e8b600]/20 rounded-lg p-6 backdrop-blur-sm">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-medium text-[#e8b600] mb-1">
                        Order #{order.orderNumber}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar size={16} className="mr-2" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-gray-400" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.image && (
                            <img
                              src={`http://localhost:5000/${item.product.image}`}
                              alt={item.product?.title?.en || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">
                            {item.product?.title?.en || 'Product Name'}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {item.size}ml - {item.quality} × {item.quantity}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-[#e8b600]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            ${item.price.toFixed(2)}/item
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-[#e8b600]/20 pt-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                        <p className="text-white capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                        
                        {order.notes && (
                          <div className="mt-2">
                            <p className="text-gray-400 text-sm mb-1">Notes</p>
                            <p className="text-white text-sm">{order.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-[#e8b600]">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mt-4 pt-4 border-t border-[#e8b600]/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Customer</p>
                        <p className="text-white">{order.customer.name}</p>
                        <p className="text-gray-400 text-sm">{order.customer.email}</p>
                        <p className="text-gray-400 text-sm">{order.customer.phone}</p>
                      </div>
                      
                      {order.customer.address?.street && (
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Shipping Address</p>
                          <div className="text-white text-sm">
                            <p>{order.customer.address.street}</p>
                            <p>
                              {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zipCode}
                            </p>
                            <p>{order.customer.address.country}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 