'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from 'next-intl';

export default function FavoritesSidebar({ isOpen, onClose }) {
    const t = useTranslations('Favorites');
    const [favorites, setFavorites] = useState([]);
    const locale = useLocale();
    const isRTL = locale === 'ar';

    useEffect(() => {
        // Fetch favorites from API
        const fetchFavorites = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/perfumes?is_favorite=true');
                const data = await response.json();
                setFavorites(data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        if (isOpen) {
            fetchFavorites();
        }
    }, [isOpen]);

    return (
        <div 
            className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                isOpen 
                    ? 'translate-x-0' 
                    : isRTL 
                        ? '-translate-x-full' 
                        : 'translate-x-full'
            }`}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
            <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                    {favorites.length === 0 ? (
                        <p className="text-center text-gray-500">{t('empty')}</p>
                    ) : (
                        <div className="space-y-4">
                            {favorites.map((perfume) => (
                                <div key={perfume._id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded">
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <Image
                                            src={`http://localhost:4000/${perfume.image}`}
                                            alt={perfume.title}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{perfume.title}</h3>
                                        <p className="text-sm text-gray-600">${perfume.price}</p>
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