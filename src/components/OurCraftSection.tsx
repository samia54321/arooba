import React from 'react';
import { Flame, Clock, Heart, Award } from 'lucide-react';

export const OurCraftSection: React.FC = () => {
  return (
    <section id="craft" className="py-20 lg:py-28 bg-[#F5EFE6] border-y border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-[#E8DFD0]">
              <img
                src="/src/assets/images/pizza_margherita_classic_1791819140145.jpg"
                alt="Neapolitan Margherita with puffed leopard cornicione"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-red-200">The Vero Method</span>
                <p className="text-lg font-serif-title font-bold">Unadulterated Neapolitan Tradition</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Craft Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C82D2D] uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Disciplined Culinary Heritage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#1F1D1D] leading-tight text-balance">
              Why our crust is lighter, crispier, and naturally digestible.
            </h2>

            <p className="text-sm text-[#57534E] leading-relaxed">
              We reject industrial baker's yeast and rapid proofs. Every single ball of Vero Forno dough is mixed from 100% Italian Tipo 00 wheat flour and wild mother culture starter, then cold-fermented for two full days.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8DFD0]">
              <div className="p-4 bg-white/80 rounded-xl border border-[#E8DFD0]">
                <div className="w-8 h-8 rounded-lg bg-[#C82D2D]/10 text-[#C82D2D] flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider mb-1">
                  48-Hour Cold Proof
                </h4>
                <p className="text-xs text-[#78716C]">
                  Extended enzymatic breakdown yields complex aromas and an ultra-airy cornicione that never feels heavy.
                </p>
              </div>

              <div className="p-4 bg-white/80 rounded-xl border border-[#E8DFD0]">
                <div className="w-8 h-8 rounded-lg bg-[#C82D2D]/10 text-[#C82D2D] flex items-center justify-center mb-2">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider mb-1">
                  900°F Stone Blister
                </h4>
                <p className="text-xs text-[#78716C]">
                  Bakes in under 90 seconds, flash-sealing tomato moisture while caramelizing the outer crust with signature leopard spots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
