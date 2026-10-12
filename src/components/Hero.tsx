import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onTrackOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onTrackOrder }) => {
  return (
    <section id="hero" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          {/* Left Column: Editorial Messaging */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C82D2D] uppercase mb-4">
              <Flame className="w-3.5 h-3.5" />
              <span>Wood-Fired Neapolitan Sourdough</span>
              <span aria-hidden="true" className="text-[#D6C7B2]">·</span>
              <span className="text-[#78716C]">Est. 1994</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-bold text-[#1F1D1D] tracking-tight leading-[1.12] mb-6 max-w-2xl text-balance">
              Artisan craft pizza baked with fire, heritage, and pure passion.
            </h1>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed mb-8 max-w-xl">
              Slow-fermented for 48 hours using wild sourdough starters, hand-stretched,
              topped with sweet San Marzano tomatoes, and blistered at 900°F in our hand-built volcanic stone oven.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreMenu}
                className="py-3 px-6 text-sm font-semibold text-white bg-[#C82D2D] hover:bg-[#B32424] rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <span>Order Pizza Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTrackOrder}
                className="py-3 px-5 text-sm font-medium text-[#44403C] hover:text-[#1F1D1D] bg-white border border-[#E8DFD0] hover:border-[#D6C7B2] rounded-xl transition-all shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Track Live Delivery
              </button>
            </div>

            {/* Quiet Unboxed Trust Markers */}
            <div className="pt-6 border-t border-[#E8DFD0] flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#78716C]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C82D2D]" />
                <span className="font-semibold text-[#1F1D1D]">48-Hour</span> Sourdough Ferment
              </div>
              <span aria-hidden="true" className="text-[#D6C7B2]">·</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C82D2D]" />
                <span className="font-semibold text-[#1F1D1D]">900°F</span> Volcanic Stone Oven
              </div>
              <span aria-hidden="true" className="text-[#D6C7B2]">·</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C82D2D]" />
                <span className="font-semibold text-[#1F1D1D]">D.O.P.</span> San Marzano Certified
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Hero Photography */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden shadow-lg border border-[#E8DFD0] bg-[#F5EFE6]">
              <img
                src="/src/assets/images/hero_artisanal_pizza_1791819121869.jpg"
                alt="Wood-fired artisanal Neapolitan pizza with blistered crust emerging from stone oven"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Quiet caption card over photography */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#C82D2D] uppercase tracking-wider">Chef's Signature</p>
                    <p className="text-sm font-bold text-[#1F1D1D]">Stone Oven Margherita D.O.P.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#78716C] block">From</span>
                    <span className="text-base font-bold text-[#1F1D1D] tabular-nums">$16.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
