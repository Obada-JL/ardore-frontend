"use client"
import Logo from "../../../public/header_logo.png"
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Heart, Globe } from 'lucide-react';
import FavoritesSidebar from './FavoritesSidebar';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function Navbar() {
    const t = useTranslations('navbar');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
  
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
<header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-[#e8b600] text-3xl font-bold tracking-widest relative">
            <a href="/">
            <img src={Logo.src} width={200}/>
            </a>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e8b600] group-hover:w-full transition-all duration-300"></span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {['Collections', 'Fragrances', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-white hover:text-[#e8b600] transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e8b600] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#e8b600] focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
          
          <div className="flex items-center space-x-4">
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
                      onClick={() => switchLanguage('en')}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${locale === 'en' ? 'bg-gray-100' : ''}`}
                    >
                      English
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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden bg-black/95 overflow-hidden transition-all duration-500 ${
            isMenuOpen ? 'max-h-64 py-4 border-b border-[#e8b600]/30' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-6">
            {['Collections', 'Fragrances', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="block py-3 text-white hover:text-[#e8b600] transition-all duration-300 border-b border-[#e8b600]/10 pl-2 hover:pl-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <FavoritesSidebar 
          isOpen={isFavoritesOpen} 
          onClose={() => setIsFavoritesOpen(false)} 
        />
      </header>

    )
}
