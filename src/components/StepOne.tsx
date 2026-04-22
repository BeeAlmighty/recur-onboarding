import React, { useState, useCallback } from "react";
import { Trophy, AlertCircle, Fingerprint, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";
import { recurClient } from "../api/client";
import type { LoyaltyCheckResponse } from "../types";

interface StepOneProps {
  onRegistered: (data: LoyaltyCheckResponse) => void;
  onNotRegistered: (phone: string) => void;
}

export const StepOne = ({ onRegistered, onNotRegistered }: StepOneProps) => {
  const [inputNumber, setInputNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ type: string; message: string } | null>(
    null,
  );
  const [shake, setShake] = useState(false);

  const triggerError = useCallback((type: string, message: string) => {
    setError({ type, message });
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for Nigerian numbers (typically 10-11 digits)
    if (!inputNumber || inputNumber.length < 10) {
      triggerError(
        "VALIDATION",
        "Please enter a valid phone number to continue.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await recurClient.checkCustomer(inputNumber);
      if (data.exists) {
        onRegistered(data);
      } else {
        const finalNumber = data.formattedNumber || `234${inputNumber}`;
        onNotRegistered(finalNumber);
      }
    } catch (err) {
      triggerError("CONNECTION", "Secure registry link interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCheck}
      className={`space-y-8 transition-all duration-300 ${shake ? "animate-shake" : ""}`}
    >
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
            Please enter your registered WhatsApp number to access our selection
            and current offers.
          </p>
        </div>

        {/* Input Container with Focus Transitions */}
        <div
          className={`group flex gap-3 p-2 bg-white/10 rounded-[2.2rem] border transition-all duration-500 ease-out ${
            error
              ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              : "border-white/20 focus-within:border-[#D4AF37] focus-within:bg-[#D4AF37]/5 focus-within:shadow-[0_0_30px_rgba(212,175,55,0.15)] focus-within:scale-[1.02]"
          }`}
        >
          <div className="flex items-center justify-center px-6 bg-[#181818] border border-white/20 rounded-2xl text-[#D4AF37] font-black text-sm tracking-widest transition-colors group-focus-within:border-[#D4AF37]/40">
            +234
          </div>
          <input
            type="tel"
            placeholder="812 345 6789"
            disabled={loading}
            className="flex-1 px-2 py-5 bg-transparent text-white font-bold text-xl outline-none placeholder:text-white/60"
            value={inputNumber}
            onChange={(e) => {
              if (error) setError(null);
              // Sanitize input to only allow digits
              setInputNumber(e.target.value.replace(/\D/g, ""));
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
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
              <span className="tracking-widest uppercase">
                View Menu & Rewards
              </span>
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
  );
};
