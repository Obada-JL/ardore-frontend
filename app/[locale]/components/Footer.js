"use client"
import Logo from "../../../public/header_logo.png"
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="py-16 bg-black border-t border-[#e8b600]/20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600] to-transparent"></div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-[#e8b600] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              transform: `scale(${Math.random() * 2 + 0.5})`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-[#e8b600] text-3xl font-bold tracking-widest mb-6 group">
              <Link href={`/${locale}`} className="block transform transition-transform duration-300 group-hover:scale-105">
                <img src={Logo.src} width={200} alt="Ardore Perfume" className="filter drop-shadow-lg" />
              </Link>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed hover:text-gray-300 transition-colors duration-300">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              {[
                { icon: 'fa-cc-visa', title: 'Visa' },
                { icon: 'fa-cc-mastercard', title: 'Mastercard' },
                { icon: 'fa-cc-amex', title: 'American Express' },
                { icon: 'fa-cc-paypal', title: 'PayPal' }
              ].map((payment, index) => (
                <div 
                  key={index} 
                  className="text-[#e8b600]/70 hover:text-[#e8b600] transition-all duration-300 tooltip transform hover:scale-110"
                  title={payment.title}
                >
                  <i className={`fab ${payment.icon} text-2xl`}></i>
                </div>
              ))}
            </div>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-medium mb-6 relative inline-block group">
              {t('quickLinks')}
              <span className="absolute -bottom-1 left-0 w-1/2 h-px bg-[#e8b600]/50 group-hover:w-full transition-all duration-300"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { key: 'home', href: `/${locale}` },
                { key: 'aboutUs', href: '#about' },
                { key: 'collections', href: '#collections' },
                { key: 'fragrances', href: '#fragrances' },
                { key: 'contact', href: '#contact' }
              ].map((link) => (
                <li key={link.key}>
                  {link.key === 'home' ? (
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-[#e8b600] transition-all duration-300 flex items-center group"
                    >
                      <span className="w-0 h-px bg-[#e8b600] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {t(`links.${link.key}`)}
                    </Link>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-[#e8b600] transition-all duration-300 flex items-center group"
                    >
                      <span className="w-0 h-px bg-[#e8b600] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {t(`links.${link.key}`)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-medium mb-6 relative inline-block group">
              {t('customerService')}
              <span className="absolute -bottom-1 left-0 w-1/2 h-px bg-[#e8b600]/50 group-hover:w-full transition-all duration-300"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { key: 'faq', href: '#faq' },
                { key: 'shippingReturns', href: '#shipping-returns' },
                { key: 'privacyPolicy', href: '#privacy-policy' },
                { key: 'termsConditions', href: '#terms-conditions' },
                { key: 'trackOrder', href: '#track-order' }
              ].map((link) => (
                <li key={link.key}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-[#e8b600] transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 h-px bg-[#e8b600] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                    {t(`links.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-lg font-medium mb-6 relative inline-block group">
              {t('openingHours')}
              <span className="absolute -bottom-1 left-0 w-1/2 h-px bg-[#e8b600]/50 group-hover:w-full transition-all duration-300"></span>
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex justify-between group hover:text-gray-300 transition-colors duration-300">
                <span>{t('hours.mondayFriday')}</span>
                <span className="text-[#e8b600]/80 group-hover:text-[#e8b600] transition-colors duration-300">{t('hours.mondayFridayHours')}</span>
              </li>
              <li className="flex justify-between group hover:text-gray-300 transition-colors duration-300">
                <span>{t('hours.saturday')}</span>
                <span className="text-[#e8b600]/80 group-hover:text-[#e8b600] transition-colors duration-300">{t('hours.saturdayHours')}</span>
              </li>
              <li className="flex justify-between group hover:text-gray-300 transition-colors duration-300">
                <span>{t('hours.sunday')}</span>
                <span className="text-[#e8b600]/80 group-hover:text-[#e8b600] transition-colors duration-300">{t('hours.sundayHours')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#e8b600]/20 pt-8 text-center text-gray-500 text-sm">
          <p className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="mt-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {t('tagline')} <i className="fas fa-heart text-[#e8b600] animate-pulse-slow"></i>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s forwards ease-out;
        }
      `}</style>
    </footer>
  );
} 