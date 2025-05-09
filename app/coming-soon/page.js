import { useTranslations } from 'next-intl';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#050505] text-white font-serif">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://public.readdy.ai/ai/img_res/731db9a2972a79abc44a1e1e28b80367.jpg" 
            alt="Luxury Perfume" 
            className="w-full h-full object-cover object-top opacity-80 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          
          {/* Gold particle overlay */}
          <div className="absolute inset-0 bg-[#e8b600]/10 mix-blend-overlay"></div>
          
          {/* Animated diagonal lines */}
          <div className="absolute inset-0 opacity-15">
            <div className="h-full w-full" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #e8b600 0, #e8b600 1px, transparent 1px, transparent 20px)',
            }}></div>
          </div>
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-light text-[#e8b600] mb-6 animate-fade-in-up">
            Coming Soon
          </h1>
          <div className="w-24 h-0.5 bg-[#e8b600]/50 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We're crafting something extraordinary. Stay tuned for our upcoming collection.
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {['facebook', 'instagram', 'twitter', 'pinterest'].map((social) => (
              <a 
                key={social} 
                href={`#${social}`} 
                className="text-[#e8b600]/80 hover:text-[#e8b600] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <i className={`fab fa-${social} text-2xl`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s forwards ease-out;
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 30s alternate infinite ease-in-out;
        }
      `}</style>
    </div>
  );
} 