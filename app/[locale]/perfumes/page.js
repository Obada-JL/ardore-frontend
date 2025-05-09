"use client"
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function PerfumesPage() {
  const t = useTranslations('perfumes');

  const perfumes = [
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 1,
      name: "Midnight Elixir",
      description: "A mysterious blend of dark woods and exotic spices",
      image: "https://public.readdy.ai/ai/img_res/70f966ad64f11c0e542e5f99c6395c40.jpg",
      price: "$299"
    },
    {
      id: 2,
      name: "Golden Oud",
      description: "Luxurious oud with golden amber notes",
      image: "https://public.readdy.ai/ai/img_res/a35b0a0fb47e454f900b819ffb453550.jpg",
      price: "$399"
    },
    {
      id: 3,
      name: "Rose Velvet",
      description: "Rich rose essence with velvety undertones",
      image: "https://public.readdy.ai/ai/img_res/4841a36892e9c4158d32b500dab9892a.jpg",
      price: "$249"
    },
    {
      id: 4,
      name: "Ocean Mist",
      description: "Fresh aquatic notes with marine elements",
      image: "https://public.readdy.ai/ai/img_res/9418720651b1d258707af724c61229a0.jpg",
      price: "$199"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://public.readdy.ai/ai/img_res/a35b0a0fb47e454f900b819ffb453550.jpg" 
            alt="Perfume Collection" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-light text-[#e8b600] mb-4 animate-fade-in-up">Our Collection</h1>
            <p className="text-gray-300 text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover our exquisite range of fragrances, each crafted with precision and passion
            </p>
          </div>
        </div>
      </div>

      {/* Perfumes Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {perfumes.map((perfume, index) => (
            <Link 
              href={`/perfume/${perfume.id}`} 
              key={perfume.id}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg bg-black/30 backdrop-blur-sm border border-[#e8b600]/20 hover:border-[#e8b600]/40 transition-all duration-500">
                <div className="aspect-square relative">
                  <img 
                    src={perfume.image} 
                    alt={perfume.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-light text-[#e8b600] mb-2">{perfume.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{perfume.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#e8b600]">{perfume.price}</span>
                    <span className="text-[#e8b600] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>

                {/* Hover border animation */}
                <div className="absolute inset-0 border border-[#e8b600]/0 group-hover:border-[#e8b600]/30 transition-all duration-500"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full bg-[#e8b600]/5 filter blur-3xl"></div>
      </div>
    </div>
  );
} 