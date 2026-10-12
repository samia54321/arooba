import React, { useState, useMemo } from 'react';
import { Search, Flame, Leaf, Check, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Pizza } from '../types.ts';
import { PizzaCard } from './PizzaCard.tsx';

interface MenuSectionProps {
  pizzas: Pizza[];
  onSelectPizza: (pizza: Pizza) => void;
  onQuickAdd: (pizza: Pizza) => void;
  loading: boolean;
}

const CATEGORIES = ['All', 'Classic', 'Specialty', 'White & Truffle', 'Spicy', 'Vegan'] as const;

export const MenuSection: React.FC<MenuSectionProps> = ({
  pizzas,
  onSelectPizza,
  onQuickAdd,
  loading
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyVegetarian, setOnlyVegetarian] = useState<boolean>(false);
  const [onlySpicy, setOnlySpicy] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const filteredPizzas = useMemo(() => {
    return pizzas.filter(pizza => {
      // Category filter
      if (selectedCategory !== 'All' && pizza.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pizza.name.toLowerCase().includes(q);
        const matchesDesc = pizza.description.toLowerCase().includes(q);
        const matchesIng = pizza.ingredients.some(i => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }
      // Dietary filters
      if (onlyVegetarian && !pizza.isVegetarian) return false;
      if (onlySpicy && !pizza.isSpicy) return false;
      if (onlyInStock && !pizza.inStock) return false;

      return true;
    });
  }, [pizzas, selectedCategory, searchQuery, onlyVegetarian, onlySpicy, onlyInStock]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setOnlyVegetarian(false);
    setOnlySpicy(false);
    setOnlyInStock(false);
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery !== '' || onlyVegetarian || onlySpicy || onlyInStock;

  return (
    <section id="menu" className="py-16 lg:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-[#C82D2D] uppercase mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Neapolitan Wood-Fired Menu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#1F1D1D] mb-4">
            Baked to blistered perfection.
          </h2>
          <p className="text-sm text-[#57534E]">
            Every pizza begins with 48-hour fermented heritage sourdough and imported Italian ingredients, flash-baked in seconds at 900°F.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Search pizzas, ingredients (e.g. Truffle, Soppressata)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E8DFD0] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D] shadow-2xs placeholder:text-[#A8A29E]"
              />
            </div>

            {/* Dietary Toggle Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setOnlyVegetarian(!onlyVegetarian)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  onlyVegetarian
                    ? 'border-[#16A34A] bg-emerald-50 text-[#16A34A] shadow-2xs'
                    : 'border-[#E8DFD0] bg-white text-[#57534E] hover:border-[#D6C7B2]'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Vegetarian</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlySpicy(!onlySpicy)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  onlySpicy
                    ? 'border-[#DC2626] bg-red-50 text-[#DC2626] shadow-2xs'
                    : 'border-[#E8DFD0] bg-white text-[#57534E] hover:border-[#D6C7B2]'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Spicy</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  onlyInStock
                    ? 'border-[#C82D2D] bg-[#FDF5F5] text-[#C82D2D] shadow-2xs'
                    : 'border-[#E8DFD0] bg-white text-[#57534E] hover:border-[#D6C7B2]'
                }`}
              >
                <span>In Stock Only</span>
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="py-2 px-3 text-xs font-medium text-[#78716C] hover:text-[#1F1D1D] flex items-center gap-1 whitespace-nowrap"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs (Functional Segmented Buttons per 1.A) */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8DFD0] rounded-xl overflow-x-auto shadow-2xs">
            {CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`py-2 px-4 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#C82D2D] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#1F1D1D] hover:bg-[#FAF7F2]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Pizza Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-[#E8DFD0]/40 animate-pulse border border-[#E8DFD0]" />
            ))}
          </div>
        ) : filteredPizzas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFD0] p-8 max-w-lg mx-auto space-y-3">
            <Flame className="w-10 h-10 text-[#D6C7B2] mx-auto" />
            <h3 className="text-base font-bold text-[#1F1D1D]">No Pizzas Match Your Filters</h3>
            <p className="text-xs text-[#78716C]">
              Try adjusting your search keywords or clearing the dietary filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 py-2 px-4 bg-[#C82D2D] hover:bg-[#B32424] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPizzas.map(pizza => (
              <PizzaCard
                key={pizza.id || pizza._id}
                pizza={pizza}
                onSelect={onSelectPizza}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
