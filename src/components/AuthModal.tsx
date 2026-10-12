import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { login, register, loginAsDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setErrorMsg(res.error || 'Invalid credentials');
        }
      } else {
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined
        });
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setErrorMsg(res.error || 'Failed to create account');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'admin' | 'customer') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginAsDemo(role);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg('Demo sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E8DFD0] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h2 className="text-xl font-serif-title font-bold text-[#1F1D1D]">
              {isAdminMode ? 'Master Chef Admin' : activeTab === 'login' ? 'Customer Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              {isAdminMode ? 'Manage pizzas & restaurant orders' : 'Track orders, re-order favorites & get member perks'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#1F1D1D] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not admin mode */}
        {!isAdminMode ? (
          <div className="flex border-b border-[#E8DFD0] bg-[#FDF9F3]">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
              className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-[#C82D2D] text-[#C82D2D] bg-white'
                  : 'border-transparent text-[#78716C] hover:text-[#1F1D1D]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
              className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-[#C82D2D] text-[#C82D2D] bg-white'
                  : 'border-transparent text-[#78716C] hover:text-[#1F1D1D]'
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="px-5 py-2.5 bg-red-50 border-b border-red-100 flex items-center justify-between text-xs text-[#C82D2D]">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Admin Portal Login
            </span>
            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="text-[11px] underline text-[#78716C] hover:text-[#1F1D1D]"
            >
              Back to Customer
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl">
              {errorMsg}
            </div>
          )}

          {activeTab === 'register' && !isAdminMode && (
            <div>
              <label className="text-[11px] font-medium text-[#78716C] block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-[#78716C] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="email"
                required
                placeholder={isAdminMode ? 'admin@veroforno.com' : 'elena@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#78716C] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
              />
            </div>
          </div>

          {activeTab === 'register' && !isAdminMode && (
            <>
              <div>
                <label className="text-[11px] font-medium text-[#78716C] block mb-1">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#78716C] block mb-1">Delivery Address (Optional)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="text"
                    placeholder="742 Evergreen Terrace"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C82D2D]"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#C82D2D] hover:bg-[#B32424] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99] mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isAdminMode ? 'Enter Admin Dashboard' : activeTab === 'login' ? 'Sign In' : 'Join Vero Forno'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Access Pills */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFD0] space-y-2">
          <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider text-center">
            Instant Demo Sign-In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemo('customer')}
              className="py-2 px-3 text-xs font-semibold bg-white border border-[#E8DFD0] hover:border-[#D6C7B2] text-[#44403C] rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#C82D2D]" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemo('admin')}
              className="py-2 px-3 text-xs font-semibold bg-white border border-[#E8DFD0] hover:border-[#D6C7B2] text-[#C82D2D] rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>

          {!isAdminMode && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(true);
                  setEmail('admin@veroforno.com');
                  setPassword('admin123password');
                  setErrorMsg(null);
                }}
                className="text-[11px] text-[#78716C] hover:text-[#C82D2D] transition-colors"
              >
                Are you a staff member or chef? <span className="underline">Admin Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
