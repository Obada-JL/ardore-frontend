"use client"
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import { User, Settings, ShoppingBag, Heart, LogOut, ChevronDown } from 'lucide-react';

const UserMenu = () => {
  const t = useTranslations('UserMenu');
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: User,
      label: t('profile'),
      href: '/profile',
    },
    {
      icon: ShoppingBag,
      label: t('orders'),
      href: '/orders',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-white hover:text-[#e8b600] rounded-full transition-colors"
      >
        <div className="w-8 h-8 bg-[#e8b600] rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user?.fullName || t('guest')}
        </span>
        <ChevronDown 
          size={16} 
          className={`hidden md:block transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#e8b600] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {console.log(user)}
                  {user?.fullName || t('guest')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#e8b600] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} className="mr-3" />
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 