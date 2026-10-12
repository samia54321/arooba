import React from 'react';
import { Plus, Flame, Leaf, Sparkles } from 'lucide-react';
import { Pizza } from '../types.ts';

interface PizzaCardProps {
  pizza: Pizza;
  onSelect: (pizza: Pizza) => void;
  onQuickAdd: (pizza: Pizza) => void;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onSelect, onQuickAdd }) => {
  return (
    <div
      onClick={() => onSelect(pizza)}
      className="group relative bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Visual Slot (65-70% visual height) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFE6]">
        <img
          src={pizza.image}
          alt={pizza.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Styled CSS fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Quiet Top Markers */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {pizza.isPopular && (
            <span className="bg-white/95 backdrop-blur-sm text-[#C82D2D] text-[11px] font-semibold px-2 py-0.5 rounded shadow-2xs">
              Popular
            </span>
          )}
          {pizza.isSpicy && (
            <span className="bg-white/95 backdrop-blur-sm text-[#DC2626] text-[11px] font-semibold px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              Spicy
            </span>
          )}
          {pizza.isVegetarian && (
            <span className="bg-white/95 backdrop-blur-sm text-[#16A34A] text-[11px] font-semibold px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
              <Leaf className="w-3 h-3 fill-current" />
              Veg
            </span>
          )}
        </div>

        {!pizza.inStock && (
          <div className="absolute inset-0 bg-[#FAF7F2]/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-[#1F1D1D] text-white text-xs font-semibold px-3 py-1 rounded-md">
              Sold Out Today
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[#C82D2D]">{pizza.category}</span>
            <span aria-hidden="true" className="text-[#D6C7B2]">·</span>
            <span>{pizza.sizes ? '3 Sizes' : 'Artisanal'}</span>
          </div>

          {/* Pizza Title */}
          <h3 className="text-lg font-serif-title font-bold text-[#1F1D1D] group-hover:text-[#C82D2D] transition-colors leading-snug mb-2">
            {pizza.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed mb-4">
            {pizza.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] text-[#A8A29E] block">Starting from</span>
            <span className="text-lg font-bold text-[#1F1D1D] tabular-nums">
              ${pizza.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pizza);
              }}
              className="py-1.5 px-3 text-xs font-semibold text-[#57534E] hover:text-[#1F1D1D] bg-[#FAF7F2] hover:bg-[#F3ECE0] rounded-lg transition-colors"
            >
              Customize
            </button>
            <button
              disabled={!pizza.inStock}
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(pizza);
              }}
              title="Add Classic 12-inch to cart"
              className="p-2 text-white bg-[#C82D2D] hover:bg-[#B32424] rounded-lg transition-colors shadow-2xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
