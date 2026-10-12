import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, Flame, Clock, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onOpenCustomerOrders: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenTracking,
  onOpenAdmin,
  onOpenCustomerOrders,
  activeSection,
  setActiveSection
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
            className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#1F1D1D] hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <span className="w-9 h-9 rounded-full bg-[#C82D2D] flex items-center justify-center text-white shadow-sm">
              <Flame className="w-5 h-5 fill-current" />
            </span>
            <span className="font-serif-title font-bold tracking-tight text-[#1F1D1D]">
              Vero Forno
            </span>
          </a>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]">
          <button
            onClick={() => scrollTo('menu')}
            className={`transition-colors whitespace-nowrap hover:text-[#C82D2D] ${
              activeSection === 'menu' ? 'text-[#C82D2D] font-semibold' : ''
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => scrollTo('craft')}
            className={`transition-colors whitespace-nowrap hover:text-[#C82D2D] ${
              activeSection === 'craft' ? 'text-[#C82D2D] font-semibold' : ''
            }`}
          >
            Our Craft
          </button>
          <button
            onClick={onOpenTracking}
            className="transition-colors whitespace-nowrap hover:text-[#C82D2D] flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-[#A8A29E]" />
            Track Order
          </button>
          <button
            onClick={onOpenAdmin}
            className="transition-colors whitespace-nowrap hover:text-[#C82D2D] flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#A8A29E]" />
            Admin Portal
          </button>
        </nav>

        {/* Zone 3: Primary Action & User Account Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Account / Auth Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 py-2 px-3 text-xs font-semibold text-[#1F1D1D] bg-white border border-[#E8DFD0] rounded-lg hover:border-[#D6C7B2] shadow-xs transition-all whitespace-nowrap"
              >
                <div className="w-6 h-6 rounded-full bg-[#F3ECE0] text-[#C82D2D] font-bold flex items-center justify-center text-xs">
                  {user?.name.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E8DFD0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#F5EFE6]">
                    <p className="text-xs font-semibold text-[#1F1D1D] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#78716C] truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-[#C82D2D] uppercase tracking-wider">
                        Master Chef Admin
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenCustomerOrders();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#44403C] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#78716C]" />
                    My Order History
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#C82D2D] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Open Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-[#F5EFE6] mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#DC2626] hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="py-2 px-3 text-xs font-medium text-[#57534E] hover:text-[#1F1D1D] bg-white/80 border border-[#E8DFD0] rounded-lg hover:border-[#D6C7B2] shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Cart Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View Shopping Cart"
            className="relative flex items-center gap-2 py-2 px-4 text-xs font-semibold text-white bg-[#C82D2D] hover:bg-[#B32424] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="bg-white text-[#C82D2D] text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center tabular-nums">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
