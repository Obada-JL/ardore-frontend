"use client"
import Logo from "../../../public/header_logo.png"
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Heart, Globe } from 'lucide-react';
import FavoritesSidebar from './FavoritesSidebar';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useFavorites } from '../../context/FavoritesContext';

export default function Navbar() {
    const nav = useTranslations('navbar');
    const { favoritesCount } = useFavorites();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const navigationItems = [
      { key: 'collections', href: '/#collections' },
      { key: 'fragrances', href: '/perfumes' },
      { key: 'about', href: '/#about' },
      { key: 'contact', href: '/#contact' }
    ];
  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const switchLanguage = (newLocale) => {
      const currentPathname = pathname;
      const newPath = currentPathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPath);
      setIsLangOpen(false);
    };
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <img
                  // className="h-8 w-auto"
                  src={Logo.src}
                  alt="Ardore"
                  style={{ width: '200px', height: 'auto' }}
                />
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-white hover:text-[#e8b600] transition-colors duration-200 text-sm font-medium"
                >
                  {nav(item.key)}
                </a>
              ))}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="p-2 text-white hover:text-[#e8b600] rounded-full relative cursor-pointer flex items-center"
                >
                  <Globe size={24} />
                  <span className="ml-1 text-sm uppercase">{locale}</span>
                </button>
                
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="py-1">
                      <button 
                        onClick={() => switchLanguage('tr')}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${locale === 'tr' ? 'bg-gray-100' : ''}`}
                      >
                        Türkçe
                      </button>
                      <button 
                        onClick={() => switchLanguage('ar')}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${locale === 'ar' ? 'bg-gray-100' : ''}`}
                      >
                        العربية
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsFavoritesOpen(true)}
                className="p-2 text-white hover:text-[#e8b600] rounded-full relative cursor-pointer"
              >
                <Heart size={24} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-white hover:text-[#e8b600] transition-colors duration-200"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-current transform transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-current mt-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-current mt-1 transform transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-black/95 backdrop-blur-sm border-t border-white/10`}>
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-white hover:text-[#e8b600] transition-colors duration-200 text-base font-medium"
                >
                  {nav(item.key)}
                </a>
              ))}
            </div>

            {/* Mobile Actions Section */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between space-x-4">
                {/* Language Switcher */}
                <div className="relative">
                  <button 
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center space-x-1 px-3 py-2 text-white hover:text-[#e8b600] rounded-lg transition-colors"
                  >
                    <Globe size={20} />
                    <span className="text-sm uppercase">{locale}</span>
                  </button>
                  
                  {isLangOpen && (
                    <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-lg overflow-hidden z-50">
                      <div className="py-1">
                        <button 
                          onClick={() => switchLanguage('tr')}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${locale === 'tr' ? 'bg-gray-100' : ''}`}
                        >
                          Türkçe
                        </button>
                        <button 
                          onClick={() => switchLanguage('ar')}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${locale === 'ar' ? 'bg-gray-100' : ''}`}
                        >
                          العربية
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsFavoritesOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 px-3 py-2 text-white hover:text-[#e8b600] rounded-lg transition-colors relative"
                >
                  <Heart size={20} />
                  <span className="text-sm">Favorites</span>
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <FavoritesSidebar 
          isOpen={isFavoritesOpen} 
          onClose={() => setIsFavoritesOpen(false)} 
        />
      </header>
    )
}
