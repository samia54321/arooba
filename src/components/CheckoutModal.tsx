import React, { useState } from 'react';
import { X, Check, MapPin, Phone, User, CreditCard, Banknote, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Order } from '../types.ts';

interface CheckoutModalProps {
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onOrderPlaced }) => {
  const { items, subtotal, deliveryFee, tax, discount, total, clearCart } = useCart();
  const { user } = useAuth();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address || '');
  const [city, setCity] = useState('San Francisco');
  const [zipCode, setZipCode] = useState('94103');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'apple_pay'>('card');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculatedTip = customTip
    ? Number(parseFloat(customTip) || 0)
    : Number(((subtotal * tipPercent) / 100).toFixed(2));

  const actualDeliveryFee = orderType === 'pickup' ? 0 : deliveryFee;
  const finalTotal = Number((subtotal - discount + tax + actualDeliveryFee + calculatedTip).toFixed(2));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please provide your name and phone number for delivery updates.');
      return;
    }

    if (orderType === 'delivery' && !street.trim()) {
      setErrorMsg('Please provide a delivery street address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || 'guest@veroforno.com',
        customerPhone: customerPhone.trim(),
        orderType,
        address: orderType === 'delivery' ? {
          street: street.trim(),
          city: city.trim(),
          zipCode: zipCode.trim(),
          notes: notes.trim()
        } : undefined,
        items: items.map(item => ({
          pizzaId: item.pizzaId,
          name: item.name,
          price: item.sizePrice,
          size: item.size,
          crust: item.crust,
          extraToppings: item.extraToppings.map(t => t.name),
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        })),
        subtotal,
        tax,
        deliveryFee: actualDeliveryFee,
        tip: calculatedTip,
        total: finalTotal,
        paymentMethod,
        userId: user?.id || user?._id
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success && data.data) {
        clearCart();
        onOrderPlaced(data.data);
      } else {
        setErrorMsg(data.error || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network communication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DFD0] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div>
            <h2 className="text-xl font-serif-title font-bold text-[#1F1D1D]">Checkout & Order</h2>
            <p className="text-xs text-[#78716C] mt-0.5">Wood-fired perfection prepared upon confirmation</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#1F1D1D] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 flex-grow">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* 1. Order Type Switcher */}
          <div>
            <label className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider block mb-2">
              Service Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0]">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  orderType === 'delivery'
                    ? 'bg-white text-[#C82D2D] shadow-xs'
                    : 'text-[#78716C] hover:text-[#1F1D1D]'
                }`}
              >
                🚴 Fast Courier Delivery (~35 mins)
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  orderType === 'pickup'
                    ? 'bg-white text-[#C82D2D] shadow-xs'
                    : 'text-[#78716C] hover:text-[#1F1D1D]'
                }`}
              >
                🍕 Restaurant Pickup (~20 mins)
              </button>
            </div>
          </div>

          {/* 2. Customer Contact */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider block">
              Contact Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#78716C] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#78716C] block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-medium text-[#78716C] block mb-1">Email for Receipt</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Address (if Delivery) */}
          {orderType === 'delivery' && (
            <div className="space-y-3 pt-2 border-t border-[#F5EFE6]">
              <label className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider block">
                Delivery Address
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#78716C] block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#78716C] block mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#78716C] block mb-1">Gate code / Delivery instructions</label>
                  <input
                    type="text"
                    placeholder="Leave with doorman or ring doorbell"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Payment Method */}
          <div className="space-y-3 pt-2 border-t border-[#F5EFE6]">
            <label className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider block">
              Payment Choice
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card' as const, label: 'Credit / Debit', icon: CreditCard },
                { id: 'cod' as const, label: 'Cash on Arrival', icon: Banknote },
                { id: 'apple_pay' as const, label: 'Apple / Google', icon: ShieldCheck }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-[#C82D2D] bg-[#FDF5F5] text-[#C82D2D] ring-1 ring-[#C82D2D]'
                        : 'border-[#E8DFD0] bg-white text-[#57534E] hover:border-[#D6C7B2]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Driver / Kitchen Tip */}
          <div className="space-y-2 pt-2 border-t border-[#F5EFE6]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">
                Support The Kitchen Team (Tip)
              </label>
              <span className="text-xs font-semibold text-[#1F1D1D] tabular-nums">
                +${calculatedTip.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[10, 15, 20].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip('');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all tabular-nums ${
                    tipPercent === pct && !customTip
                      ? 'border-[#C82D2D] bg-[#FDF5F5] text-[#C82D2D]'
                      : 'border-[#E8DFD0] bg-white text-[#57534E]'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="Custom $"
                value={customTip}
                onChange={(e) => {
                  setCustomTip(e.target.value);
                }}
                className="w-24 text-xs p-2 text-center rounded-lg border border-[#E8DFD0] bg-white tabular-nums"
              />
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0] space-y-2 text-xs text-[#57534E]">
            <div className="flex justify-between">
              <span>{items.reduce((s, i) => s + i.quantity, 0)} Pizza(s) Subtotal</span>
              <span className="tabular-nums font-medium text-[#1F1D1D]">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#16A34A]">
                <span>Discount</span>
                <span className="tabular-nums font-medium">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="tabular-nums font-medium text-[#1F1D1D]">
                {actualDeliveryFee === 0 ? <strong className="text-[#16A34A]">FREE</strong> : `$${actualDeliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax & Surcharges</span>
              <span className="tabular-nums font-medium text-[#1F1D1D]">${tax.toFixed(2)}</span>
            </div>
            {calculatedTip > 0 && (
              <div className="flex justify-between">
                <span>Crew Gratuity</span>
                <span className="tabular-nums font-medium text-[#1F1D1D]">${calculatedTip.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-[#1F1D1D] pt-2 border-t border-[#E8DFD0]">
              <span>Final Total</span>
              <span className="tabular-nums text-[#C82D2D]">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#C82D2D] hover:bg-[#B32424] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transmitting to Kitchen Oven...</span>
                </>
              ) : (
                <>
                  <span>Place Pizza Order • ${finalTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-[#78716C] mt-2">
              By placing your order, you agree to Vero Forno fresh artisanal baking standards.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
