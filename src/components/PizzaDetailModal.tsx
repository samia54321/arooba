import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Leaf, Check } from 'lucide-react';
import { Pizza, PizzaSize, CartExtra } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface PizzaDetailModalProps {
  pizza: Pizza | null;
  onClose: () => void;
}

const AVAILABLE_EXTRAS: CartExtra[] = [
  { name: 'Fresh Fior di Latte Mozzarella', price: 2.50 },
  { name: 'White Truffle Oil Drizzle', price: 3.00 },
  { name: 'Calabrian Hot Honey', price: 2.00 },
  { name: '24mo Shaved Parmigiano-Reggiano', price: 2.50 },
  { name: 'Slow Roasted Garlic Confit', price: 1.75 },
  { name: 'Extra Fragrant Basil', price: 1.00 }
];

export const PizzaDetailModal: React.FC<PizzaDetailModalProps> = ({ pizza, onClose }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('classic');
  const [selectedCrust, setSelectedCrust] = useState<string>('Traditional Neapolitan');
  const [selectedExtras, setSelectedExtras] = useState<CartExtra[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');

  if (!pizza) return null;

  const sizePrice = pizza.sizes ? pizza.sizes[selectedSize] : pizza.price;
  const crustExtra = selectedCrust.includes('Stuffed') ? 3.00 : 0;
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const singleItemPrice = sizePrice + crustExtra + extrasTotal;
  const totalItemPrice = Number((singleItemPrice * quantity).toFixed(2));

  const toggleExtra = (extra: CartExtra) => {
    setSelectedExtras(prev => {
      const exists = prev.some(e => e.name === extra.name);
      if (exists) {
        return prev.filter(e => e.name !== extra.name);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handleAddToCart = () => {
    addItem({
      pizzaId: pizza.id || pizza._id || '',
      name: pizza.name,
      basePrice: pizza.price,
      size: selectedSize,
      sizePrice: sizePrice + crustExtra,
      crust: selectedCrust,
      extraToppings: selectedExtras,
      quantity,
      specialInstructions: instructions.trim() || undefined,
      image: pizza.image
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DFD0] flex flex-col">
        {/* Sticky Header with Close */}
        <div className="relative h-64 sm:h-72 w-full bg-[#F5EFE6] shrink-0">
          <img
            src={pizza.image}
            alt={pizza.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1F1D1D] flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            {pizza.isSpicy && (
              <span className="bg-white/95 text-[#DC2626] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" /> Spicy
              </span>
            )}
            {pizza.isVegetarian && (
              <span className="bg-white/95 text-[#16A34A] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 fill-current" /> Vegetarian
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-grow">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C82D2D] uppercase tracking-wider mb-1">
              <span>{pizza.category}</span>
              <span aria-hidden="true" className="text-[#D6C7B2]">·</span>
              <span>48h Ferment Sourdough</span>
            </div>
            <h2 className="text-2xl font-serif-title font-bold text-[#1F1D1D] mb-2">{pizza.name}</h2>
            <p className="text-sm text-[#57534E] leading-relaxed">{pizza.description}</p>
          </div>

          {/* Ingredients list */}
          <div>
            <p className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider mb-2">Ingredients</p>
            <div className="flex flex-wrap gap-2 text-xs text-[#57534E]">
              {pizza.ingredients.map((ing, idx) => (
                <span key={idx} className="bg-[#FAF7F2] border border-[#E8DFD0] px-2.5 py-1 rounded-md">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* 1. Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">Select Size</span>
              <span className="text-xs text-[#78716C]">Choose 1</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'personal' as PizzaSize, label: '10" Personal', desc: '4 Slices', price: pizza.sizes?.personal || pizza.price * 0.85 },
                { id: 'classic' as PizzaSize, label: '12" Classic', desc: '6 Slices', price: pizza.sizes?.classic || pizza.price },
                { id: 'grande' as PizzaSize, label: '14" Grande', desc: '8 Slices', price: pizza.sizes?.grande || pizza.price * 1.3 }
              ].map(size => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedSize === size.id
                      ? 'border-[#C82D2D] bg-[#FDF5F5] ring-1 ring-[#C82D2D]'
                      : 'border-[#E8DFD0] hover:border-[#D6C7B2] bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-[#1F1D1D]">{size.label}</p>
                  <p className="text-[11px] text-[#78716C] mb-1">{size.desc}</p>
                  <p className="text-xs font-semibold text-[#C82D2D] tabular-nums">${size.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Crust Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">Crust Choice</span>
              <span className="text-xs text-[#78716C]">Choose 1</span>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Traditional Neapolitan', note: 'Airy, charred, pillowy cornicione', price: 0 },
                { name: 'Crispy Thin Roman Style', note: 'Extra thin, crunchy bite', price: 0 },
                { name: 'Garlic Butter Stuffed Crust', note: 'Mozzarella & roasted garlic inside rim', price: 3.00 }
              ].map(crust => (
                <button
                  key={crust.name}
                  type="button"
                  onClick={() => setSelectedCrust(crust.name)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    selectedCrust === crust.name
                      ? 'border-[#C82D2D] bg-[#FDF5F5] ring-1 ring-[#C82D2D]'
                      : 'border-[#E8DFD0] hover:border-[#D6C7B2] bg-white'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#1F1D1D]">{crust.name}</p>
                    <p className="text-[11px] text-[#78716C]">{crust.note}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#57534E] tabular-nums">
                    {crust.price > 0 ? `+$${crust.price.toFixed(2)}` : 'Included'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Extra Artisanal Add-ons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">Gourmet Add-ons</span>
              <span className="text-xs text-[#78716C]">Optional</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_EXTRAS.map(extra => {
                const isSelected = selectedExtras.some(e => e.name === extra.name);
                return (
                  <button
                    key={extra.name}
                    type="button"
                    onClick={() => toggleExtra(extra)}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#C82D2D] bg-[#FDF5F5] text-[#1F1D1D]'
                        : 'border-[#E8DFD0] hover:border-[#D6C7B2] bg-white text-[#57534E]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-[#C82D2D] border-[#C82D2D] text-white' : 'border-[#D6C7B2]'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium">{extra.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#78716C] tabular-nums">
                      +${extra.price.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Special Instructions */}
          <div>
            <label htmlFor="instructions" className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider block mb-1">
              Special Instructions
            </label>
            <input
              id="instructions"
              type="text"
              placeholder="e.g. Well-done, sliced into 8, sauce on the side..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] focus:outline-hidden focus:ring-2 focus:ring-[#C82D2D] focus:border-transparent bg-[#FAF7F2]"
            />
          </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-[#E8DFD0] p-4 sm:p-5 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#E8DFD0] rounded-xl p-1 bg-[#FAF7F2]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-white transition-colors disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#1F1D1D] tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-grow py-3 px-6 bg-[#C82D2D] hover:bg-[#B32424] text-white rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-between active:scale-[0.99] cursor-pointer"
          >
            <span>Add to Order</span>
            <span className="tabular-nums font-bold">${totalItemPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
