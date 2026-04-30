import React, { useState, useCallback, useMemo } from "react";
import {
  Trophy,
  AlertCircle,
  Fingerprint,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { Button } from "./ui/Button";
import { recurClient } from "../api/client";
import { COUNTRIES, type Country } from "../constants/countries";
import type { LoyaltyCheckResponse } from "../types";

interface StepOneProps {
  onRegistered: (data: LoyaltyCheckResponse) => void;
  onNotRegistered: (phone: string) => void;
}

export const StepOne = ({ onRegistered, onNotRegistered }: StepOneProps) => {
  const [inputNumber, setInputNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === "+234") || COUNTRIES[0],
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ type: string; message: string } | null>(
    null,
  );
  const [shake, setShake] = useState(false);

  // Memoized filter for performance during searches
  const filteredCountries = useMemo(
    () =>
      COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.includes(searchTerm),
      ),
    [searchTerm],
  );

  const triggerError = useCallback((type: string, message: string) => {
    setError({ type, message });
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNumber || inputNumber.length < 7) {
      triggerError("VALIDATION", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sanitizedNumber = inputNumber.replace(/^0+/, "");
      const fullNumber = `${selectedCountry.code}${sanitizedNumber}`;
      const data = await recurClient.checkCustomer(fullNumber);

      data.exists ? onRegistered(data) : onNotRegistered(fullNumber);
    } catch (err) {
      triggerError("CONNECTION", "Secure registry link interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleCheck}
        className={`space-y-8 transition-all duration-300 ${shake ? "animate-shake" : ""}`}
      >
        {/* Header Section */}
        <div className="space-y-6 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40">
              <Fingerprint
                size={12}
                className="text-[#D4AF37]"
              />
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">
                Identity Verification
              </span>
            </div>
            <h3 className="text-white font-black text-2xl tracking-tight">
              Unlock Digital Menu
            </h3>
            <p className="text-white/80 text-sm font-medium px-6 leading-relaxed">
              Please enter your registered WhatsApp number to access our Menu.
            </p>
          </div>

          {/* Input Group */}
          <div
            className={`group flex gap-2 p-1.5 bg-white/10 rounded-[2.2rem] border transition-all duration-500 ease-out ${
              error
                ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                : "border-white/20 focus-within:border-[#D4AF37] focus-within:bg-[#D4AF37]/5"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="flex items-center gap-2 px-5 bg-black/90 border border-white/10 rounded-[1.6rem] hover:bg-white/5 transition-all"
            >
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="text-[#D4AF37] font-black text-xs tracking-widest">
                {selectedCountry.code}
              </span>
            </button>

            <input
              type="tel"
              placeholder="Phone Number"
              disabled={loading}
              className="flex-1 px-3 py-5 bg-transparent text-white font-bold text-xl outline-none placeholder:text-white/20"
              value={inputNumber}
              onChange={(e) => {
                if (error) setError(null);
                setInputNumber(e.target.value.replace(/\D/g, ""));
              }}
            />
          </div>
        </div>

        {/* Action Section */}
        <div className="space-y-6">
          <Button
            isLoading={loading}
            variant="gold"
            type="submit"
            className="py-7 rounded-[1.8rem] group"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Trophy
                  size={18}
                  strokeWidth={3}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="tracking-widest uppercase">View Menu</span>
                <ChevronRight size={18} />
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={14} />
              <span className="text-[11px] font-black uppercase tracking-widest">
                {error.message}
              </span>
            </div>
          )}
        </div>
      </form>

      {/* Country Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-[380px] bg-[#111] border border-white/10 rounded-[2.5rem] flex flex-col max-h-[75vh]">
            <div className="p-6 border-b border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-black text-xs uppercase tracking-widest">
                  Select Country
                </h4>
                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  size={16}
                />
                <input
                  autoFocus
                  placeholder="Search name or code..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
              {filteredCountries.map((c) => (
                <button
                  key={`${c.code}-${c.name}`}
                  onClick={() => {
                    setSelectedCountry(c);
                    setIsPickerOpen(false);
                    setSearchTerm("");
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#D4AF37]/10 rounded-[1.5rem] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-sm font-bold text-white/70 group-hover:text-white">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#D4AF37]">
                    {c.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
