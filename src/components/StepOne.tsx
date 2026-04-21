import React, { useState, useCallback } from "react";
import { Trophy, AlertCircle, WifiOff } from "lucide-react";
import { Button } from "./ui/Button";
import { recurClient } from "../api/client";
import type { LoyaltyCheckResponse } from "../types"; // Using the types from your index.ts

interface StepOneProps {
  onRegistered: (data: LoyaltyCheckResponse) => void;
  onNotRegistered: (phone: string) => void;
}

type ErrorState = {
  type: "VALIDATION" | "CONNECTION";
  message: string;
};

export const StepOne = ({ onRegistered, onNotRegistered }: StepOneProps) => {
  const [inputNumber, setInputNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [shake, setShake] = useState(false);

  const triggerError = useCallback(
    (type: "VALIDATION" | "CONNECTION", message: string) => {
      setError({ type, message });
      setShake(true);
      // 2026 UX: Brief shake duration to maintain "snappiness"
      setTimeout(() => setShake(false), 500);
    },
    [],
  );

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation Logic
    if (!inputNumber || inputNumber.length < 7) {
      triggerError("VALIDATION", "Valid WhatsApp number required.");
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
      // 2. Rebranded Connection Error (n8n unreachable)
      triggerError("CONNECTION", "Secure link interrupted. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCheck}
      className={`space-y-8 transition-all duration-500 ${shake ? "animate-shake" : ""}`}
    >
      <div className="space-y-3 group text-center">
        <label
          className={`text-[14px] font-black uppercase tracking-[0.4em] transition-colors duration-300 ${
            error
              ? "text-red-500"
              : "text-white group-focus-within:text-[#D4AF37]"
          }`}
        >
          {error?.type === "CONNECTION"
            ? "Registry Link Offline"
            : "WhatsApp Number"}
        </label>

        <div
          className={`flex gap-3 p-2 bg-white/5 backdrop-blur-2xl rounded-[1.5rem] border transition-all duration-500 ${
            error
              ? "border-red-500/30 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.1)]"
              : "border-white group-focus-within:border-[#D4AF37]/30 shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
          }`}
        >
          <div className="flex items-center justify-center px-6 bg-[#050505] border border-white/5 rounded-xl text-[#D4AF37] font-black text-sm tracking-widest shadow-inner">
            +234
          </div>
          <input
            type="tel"
            placeholder="812 345 6789"
            disabled={loading}
            className="flex-1 px-4 py-5 bg-transparent text-white font-bold text-xl outline-none placeholder:text-white/5 disabled:opacity-30"
            value={inputNumber}
            onChange={(e) => {
              if (error) setError(null);
              setInputNumber(e.target.value.replace(/\D/g, ""));
            }}
          />
        </div>
      </div>

      {/* LAYOUT FIX: Error Toast 
          The wrapper has a fixed height (h-4) and absolute positioning 
          to ensure it never pushes the button or overlaps the text.
      */}
      <div className="relative h-4 flex items-center justify-center">
        {error && (
          <div className="absolute -top-4 flex items-center gap-2 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-500/10 py-1.5 px-5 rounded-full border border-red-500/20 backdrop-blur-md">
            {error.type === "CONNECTION" ? (
              <WifiOff
                size={12}
                strokeWidth={3}
              />
            ) : (
              <AlertCircle
                size={12}
                strokeWidth={3}
              />
            )}
            <span className="text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
              {error.message}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button
          isLoading={loading}
          variant="gold"
          type="submit"
          className={`py-7 text-base shadow-2xl transition-all active:scale-[0.97] ${
            error?.type === "CONNECTION"
              ? "opacity-40 grayscale pointer-events-none"
              : "hover:shadow-[#D4AF37]/10"
          }`}
        >
          <Trophy
            size={18}
            strokeWidth={3}
            className="mr-2"
          />
          <span className="tracking-[0.2em] uppercase font-black">
            {loading ? "Syncing..." : "Claim Gift"}
          </span>
        </Button>

        {error?.type === "CONNECTION" && (
          <p className="text-center text-[9px] text-white/20 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-1000">
            Internal network delay. Please re-attempt in a moment.
          </p>
        )}
      </div>
    </form>
  );
};
