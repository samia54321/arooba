import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Copy, Check, RefreshCw, Terminal, ExternalLink } from 'lucide-react';
import { DbStatusInfo } from '../types.ts';

interface MongoSetupModalProps {
  onClose: () => void;
}

export const MongoSetupModal: React.FC<MongoSetupModalProps> = ({ onClose }) => {
  const [dbStatus, setDbStatus] = useState<DbStatusInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats/status');
      const data = await res.json();
      if (data.success) {
        setDbStatus(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText('MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/veroforno?retryWrites=true&w=majority"');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DFD0] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD0] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif-title font-bold text-[#1F1D1D]">
                MongoDB Engine Architecture & Setup
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Full-stack Mongoose ODM integration with seamless failover
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:text-[#1F1D1D] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-grow">
          {/* Current Status Box */}
          <div className={`p-4 rounded-xl border ${
            dbStatus?.isMongoConnected
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-[#FAF7F2] border-[#E8DFD0]'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                {dbStatus?.isMongoConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <h3 className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">
                    Current Database Driver State
                  </h3>
                  <p className="text-sm font-semibold text-[#1F1D1D] mt-0.5">
                    {dbStatus?.isMongoConnected
                      ? 'Connected to Live MongoDB Cluster (Mongoose 9.x)'
                      : 'Active Resilient Persistent Storage Mode (MongoDB Ready)'}
                  </p>
                </div>
              </div>
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="py-1.5 px-2.5 bg-white border border-[#E8DFD0] hover:border-[#D6C7B2] rounded-lg text-xs font-semibold text-[#57534E] flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <p className="text-xs text-[#57534E] mt-3 leading-relaxed">
              {dbStatus?.isMongoConnected
                ? `Mongoose ODM is actively reading and writing to your connected MongoDB instance with full indexing and schema validation.`
                : `The backend has full Mongoose schemas (PizzaModel, OrderModel, UserModel). Because no remote MongoDB URI is configured in this sandbox, all pizzas, orders, and auth data persist smoothly to disk and automatically sync to MongoDB as soon as a URI is provided.`}
            </p>
          </div>

          {/* Quick Setup Instructions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider">
              How to Connect Your MongoDB Instance
            </h4>

            {/* Step 1 */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#1F1D1D]">
                Step 1: Get your connection string
              </p>
              <p className="text-xs text-[#57534E]">
                From <strong>MongoDB Atlas</strong> (free cluster at mongodb.com) or a local MongoDB server:
              </p>
              <div className="relative bg-[#1E1E24] text-[#E2E8F0] p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                <span className="truncate pr-2">
                  mongodb+srv://&lt;user&gt;:&lt;password&gt;@cluster0.mongodb.net/veroforno
                </span>
                <button
                  onClick={copyEnvSnippet}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#1F1D1D]">
                Step 2: Add MONGODB_URI to your environment
              </p>
              <p className="text-xs text-[#57534E]">
                Add this line to your project's <code>.env</code> file:
              </p>
              <div className="bg-[#FAF7F2] border border-[#E8DFD0] p-3 rounded-xl font-mono text-xs text-[#1F1D1D]">
                MONGODB_URI="mongodb+srv://chef:secret@cluster0.mongodb.net/veroforno?retryWrites=true&w=majority"
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#1F1D1D]">
                Step 3: Restart & Automatic Seeding
              </p>
              <p className="text-xs text-[#57534E]">
                Upon starting, <code>server/db.ts</code> runs <code>mongoose.connect()</code> and automatically seeds your initial artisan menu and default accounts if the collections are empty.
              </p>
            </div>
          </div>

          {/* Database Schema Summary */}
          <div className="pt-2 border-t border-[#F5EFE6]">
            <h4 className="text-xs font-bold text-[#1F1D1D] uppercase tracking-wider mb-2">
              Implemented Mongoose Collections & Models
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-[#FAF7F2] border border-[#E8DFD0] rounded-lg">
                <p className="font-bold text-[#1F1D1D]">pizzas</p>
                <p className="text-[11px] text-[#78716C]">Sizes, crusts, toppings, pricing, badges</p>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] border border-[#E8DFD0] rounded-lg">
                <p className="font-bold text-[#1F1D1D]">orders</p>
                <p className="text-[11px] text-[#78716C]">5-step pipeline, customer info, delivery</p>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] border border-[#E8DFD0] rounded-lg">
                <p className="font-bold text-[#1F1D1D]">users</p>
                <p className="text-[11px] text-[#78716C]">Roles, passwords, saved contact details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFD0] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-[#C82D2D] hover:bg-[#B32424] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
