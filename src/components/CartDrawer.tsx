import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout, onExploreMenu }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    deliveryFee,
    tax,
    discount,
    appliedPromo,
    applyPromo,
    removePromo,
    total,
    itemCount
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const freeDeliveryThreshold = 35;
  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E8DFD0]">
          {/* Header */}
          <div className="p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C82D2D]" />
              <h2 className="text-lg font-serif-title font-bold text-[#1F1D1D]">
                Your Order ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#1F1D1D] hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-[#FDF9F3] border-b border-[#EFE5D5] text-xs">
              {amountUntilFreeDelivery > 0 ? (
                <div>
                  <p className="text-[#57534E] mb-1.5">
                    Add <strong className="text-[#C82D2D] tabular-nums">${amountUntilFreeDelivery.toFixed(2)}</strong> more for <strong className="text-[#1F1D1D]">Free Delivery</strong>
                  </p>
                  <div className="w-full bg-[#E8DFD0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C82D2D] h-full rounded-full transition-all duration-300"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>You've unlocked FREE Delivery!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 divide-y divide-[#F5EFE6]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8DFD0] flex items-center justify-center text-[#A8A29E]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-serif-title font-bold text-[#1F1D1D]">Your cart is empty</h3>
                  <p className="text-xs text-[#78716C] mt-1 max-w-xs">
                    Fresh wood-fired sourdough pizzas are waiting for you. Customize your pie now!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreMenu();
                  }}
                  className="py-2.5 px-5 bg-[#C82D2D] hover:bg-[#B32424] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Browse Artisan Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F5EFE6] border border-[#E8DFD0] shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#1F1D1D] leading-snug">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#A8A29E] hover:text-[#DC2626] transition-colors p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#78716C] mt-0.5 space-y-0.5">
                      <p className="capitalize">{item.size} (12") · {item.crust}</p>
                      {item.extraToppings.length > 0 && (
                        <p className="text-[#A8A29E]">
                          + {item.extraToppings.map(t => t.name).join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="italic text-[#A8A29E]">"{item.specialInstructions}"</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#E8DFD0] rounded-lg bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-[#57534E] hover:text-[#1F1D1D]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums text-[#1F1D1D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#57534E] hover:text-[#1F1D1D]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#1F1D1D] tabular-nums">
                        ${item.itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8DFD0] bg-[#FAF7F2] space-y-4 shrink-0">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                    <input
                      type="text"
                      placeholder="Promo (FORNO5 / PIZZA10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E8DFD0] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-3 bg-white border border-[#E8DFD0] hover:border-[#D6C7B2] text-xs font-semibold text-[#1F1D1D] rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-[11px] text-[#16A34A] font-medium">
                    <span>Coupon '{appliedPromo}' active</span>
                    <button type="button" onClick={removePromo} className="underline text-[#78716C] hover:text-red-600">
                      Remove
                    </button>
                  </div>
                )}
                {promoMessage && !appliedPromo && (
                  <p className={`text-[11px] ${promoMessage.isError ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-[#57534E] pt-2 border-t border-[#E8DFD0]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#1F1D1D]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#16A34A]">
                    <span>Discount</span>
                    <span className="tabular-nums font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="tabular-nums font-medium text-[#1F1D1D]">
                    {deliveryFee === 0 ? <strong className="text-[#16A34A]">FREE</strong> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8.5%)</span>
                  <span className="tabular-nums font-medium text-[#1F1D1D]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1F1D1D] pt-2 border-t border-[#E8DFD0]">
                  <span>Total</span>
                  <span className="tabular-nums text-base text-[#C82D2D]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-[#C82D2D] hover:bg-[#B32424] text-white rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
