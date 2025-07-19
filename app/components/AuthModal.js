"use client"
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../context/AuthContext';
import { X, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const t = useTranslations('Auth');
  const { login, register, isLoading, error, clearError } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setValidationErrors({});
      setAuthSuccess(false);
      clearError();
    }
  }, [isOpen, mode, clearError]);

  // Close modal only on successful authentication
  useEffect(() => {
    if (authSuccess && isOpen) {
      const timer = setTimeout(() => {
        onClose();
        setAuthSuccess(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [authSuccess, isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (mode === 'register') {
      if (!formData.username.trim()) {
        errors.username = t('validation.usernameRequired');
      }
      if (!formData.name.trim()) {
        errors.name = t('validation.nameRequired');
      }
    }

    if (!formData.email.trim()) {
      errors.email = t('validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('validation.emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('validation.passwordRequired');
    } else if (formData.password.length < 6) {
      errors.password = t('validation.passwordMinLength');
    }

    if (mode === 'register') {
      if (!formData.confirmPassword) {
        errors.confirmPassword = t('validation.confirmPasswordRequired');
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = t('validation.passwordsDoNotMatch');
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let result;
    if (mode === 'login') {
      result = await login({
        email: formData.email,
        password: formData.password,
      });
    } else {
      result = await register({
        username: formData.username,
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }

    // Set success state if authentication succeeded
    if (result && result.success) {
      setAuthSuccess(true);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e8b600] to-[#f4c430] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? t('login.title') : t('register.title')}
          </h2>
          <p className="text-white/90 mt-1">
            {mode === 'login' ? t('login.subtitle') : t('register.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Username field (only for register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.username')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e8b600] focus:border-transparent transition-colors ${
                    validationErrors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={t('fields.usernamePlaceholder')}
                />
              </div>
              {validationErrors.username && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.username}</p>
              )}
            </div>
          )}

          {/* Name field (only for register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.name')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e8b600] focus:border-transparent transition-colors ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={t('fields.namePlaceholder')}
                />
              </div>
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#e8b600] focus:border-transparent transition-colors ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('fields.emailPlaceholder')}
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#e8b600] focus:border-transparent transition-colors ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('fields.passwordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password field (only for register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#e8b600] focus:border-transparent transition-colors ${
                    validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={t('fields.confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#e8b600] to-[#f4c430] text-white py-3 rounded-lg font-semibold hover:from-[#d4a500] hover:to-[#e8b600] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {mode === 'login' ? t('login.signingIn') : t('register.registering')}
              </div>
            ) : (
              mode === 'login' ? t('login.signIn') : t('register.signUp')
            )}
          </button>

          {/* Switch mode */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {mode === 'login' ? t('login.noAccount') : t('register.hasAccount')}
            </p>
            <button
              type="button"
              onClick={switchMode}
              className="mt-2 text-[#e8b600] hover:text-[#d4a500] font-semibold transition-colors"
            >
              {mode === 'login' ? t('register.createAccount') : t('login.signInInstead')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal; 