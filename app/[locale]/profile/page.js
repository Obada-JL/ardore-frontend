"use client"
import { useAuth } from '../../context/AuthContext';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { userStatsAPI } from '../../../lib/api';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const t = useTranslations('Profile');
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    ordersCount: 0,
    favoritesCount: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Set form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Fetch user statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || isLoading) return;
      
      try {
        setStatsLoading(true);
        const [userOrders, favoritesCount] = await Promise.all([
          userStatsAPI.getUserOrders(),
          userStatsAPI.getFavoritesCount()
        ]);
        
        setStats({
          ordersCount: userOrders.length,
          favoritesCount: favoritesCount
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, isLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // In a real app, you would make an API call to update the user
    // For now, we'll just update the local state
    updateUser({
      ...user,
      fullName: formData.fullName,
      email: formData.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e8b600]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 pb-12 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t?.('title') || 'My Profile'}
            </h1>
            <p className="text-gray-300 text-lg">
              {t?.('subtitle') || 'Manage your account information'}
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#e8b600] to-[#f4c430] p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#e8b600] text-2xl font-bold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {user?.fullName || 'User'}
                    </h2>
                    <p className="text-white/80">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                >
                  {isEditing ? <X size={20} /> : <Edit size={20} />}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="mr-3 text-[#e8b600]" size={24} />
                    {t?.('personalInfo') || 'Personal Information'}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t?.('name') || 'Full Name'}
                      </label>
                      {isEditing ? (
                        <input
                          key={`fullName-${isEditing}`}
                          type="text"
                          name="fullName"
                          value={formData.fullName || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8b600] focus:border-transparent transition-colors"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                          {user?.fullName || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline mr-2" size={16} />
                        {t?.('email') || 'Email Address'}
                      </label>
                      {isEditing ? (
                        <input
                          key={`email-${isEditing}`}
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8b600] focus:border-transparent transition-colors"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                          {user?.email || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline mr-2" size={16} />
                        {t?.('memberSince') || 'Member Since'}
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  {isEditing && (
                    <div className="mt-8 flex space-x-4">
                      <button
                        onClick={handleSave}
                        className="flex items-center px-6 py-3 bg-[#e8b600] text-white rounded-lg hover:bg-[#d4a500] transition-colors"
                      >
                        <Save size={18} className="mr-2" />
                        {t?.('save') || 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={18} className="mr-2" />
                        {t?.('cancel') || 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Account Stats */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {t?.('accountStats') || 'Account Statistics'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            {t?.('totalOrders') || 'Total Orders'}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {statsLoading ? '...' : stats.ordersCount}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xl">📦</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            {t?.('favorites') || 'Favorite Products'}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {statsLoading ? '...' : stats.favoritesCount}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-xl">❤️</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            {t?.('accountType') || 'Account Type'}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 capitalize">
                            {user?.role || 'User'}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xl">👤</span>
                        </div>
                      </div>
                    </div>
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