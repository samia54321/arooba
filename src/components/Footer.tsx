import React from 'react';
import { Flame, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  onOpenMongoSetup: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMongoSetup, onOpenAdmin, onOpenTracking }) => {
  return (
    <footer className="bg-[#1F1D1D] text-[#E7E5E4] pt-16 pb-12 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#292524]">
          {/* Col 1: Brand Wordmark */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#C82D2D] flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-current" />
              </span>
              <span className="font-serif-title text-xl font-bold text-white tracking-tight">
                Vero Forno
              </span>
            </div>
            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Authentic Neapolitan sourdough pizza wood-fired at 900°F. Made with organic Italian Tipo 00 flour and San Marzano D.O.P. tomatoes.
            </p>
            <div className="text-xs text-[#78716C]">
              <span>San Francisco, California</span>
              <span className="mx-2">·</span>
              <span>Since 1994</span>
            </div>
          </div>

          {/* Col 2: Restaurant Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Oven Service Hours
            </h4>
            <div className="text-xs text-[#A8A29E] space-y-2">
              <div className="flex justify-between">
                <span>Mon – Thu</span>
                <span className="text-white font-mono">11:30 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Fri – Sat</span>
                <span className="text-white font-mono">11:30 AM – 11:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-white font-mono">12:00 PM – 9:30 PM</span>
              </div>
            </div>
          </div>

          {/* Col 3: Pizzeria Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Visit The Pizzeria
            </h4>
            <div className="text-xs text-[#A8A29E] space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C82D2D] shrink-0 mt-0.5" />
                <span>842 Valencia St, Mission District, San Francisco, CA 94110</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C82D2D] shrink-0" />
                <span>+1 (415) 883-9201</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C82D2D] shrink-0" />
                <span>ciao@veroforno.com</span>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Navigation & Developer Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform & Tech
            </h4>
            <ul className="text-xs text-[#A8A29E] space-y-2">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors">
                  Track Existing Order
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-white transition-colors">
                  Chef Admin Portal (CRUD)
                </button>
              </li>
              <li>
                <button onClick={onOpenMongoSetup} className="hover:text-white transition-colors text-[#F59E0B]">
                  MongoDB Connection Guide
                </button>
              </li>
              <li>
                <span className="text-[#78716C]">Full-Stack: React + Express + Mongoose</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} Vero Forno Artisanal Pizza Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Freshly Handcrafted Daily</span>
            <span>·</span>
            <span>San Marzano D.O.P.</span>
            <span>·</span>
            <span>Wild Mother Sourdough</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
