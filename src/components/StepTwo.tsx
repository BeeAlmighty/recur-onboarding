import React, { useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, WifiOff, Utensils } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { recurClient } from "../api/client";

interface StepTwoProps {
  phone: string;
  onComplete: (data: any) => void;
}

type ErrorState = {
  type: "VALIDATION" | "CONNECTION";
  message: string;
};

export const StepTwo = ({ phone, onComplete }: StepTwoProps) => {
  const [name, setName] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [shake, setShake] = useState(false);

  const triggerError = useCallback(
    (type: "VALIDATION" | "CONNECTION", message: string) => {
      setError({ type, message });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation Logic
    if (!name || !dobMonth || !dobDay) {
      triggerError("VALIDATION", "Please complete your profile.");
      return;
    }

    if (!consent) {
      triggerError("VALIDATION", "Guest consent is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await recurClient.registerCustomer({
        phone,
        name,
        dob: `${dobMonth}-${dobDay}`,
        consent: true,
      });

      if (data.success) {
        onComplete({ ...data, fullName: name });
      }
    } catch (err) {
      // 2. n8n Connection Failure Branding
      triggerError("CONNECTION", "Secure link interrupted. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-7 transition-all duration-500 ${shake ? "animate-shake" : ""}`}
    >
      {/* GUEST NAME: Restored padding & 2026 Hyper-Radius */}
      <div className="space-y-3 group">
        <Input
          label="Guest Name"
          required
          placeholder="e.g. Jon Jones"
          value={name}
          onChange={(e) => {
            if (error) setError(null);
            setName(e.target.value);
          }}
          // Conventional 2026 luxury styling: py-7, text-lg, and rounded-[2.2rem]
          className={`py-7 px-8 text-lg rounded-[2.2rem] transition-all duration-500 ${
            error?.type === "VALIDATION" && !name
              ? "border-red-500/40 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.1)]"
              : "border-white bg-[#050505] group-focus-within:border-[#D4AF37]/40 group-focus-within:bg-black group-focus-within:shadow-[0_0_50px_rgba(212,175,55,0.05)]"
          }`}
        />
      </div>

      {/* BIRTHDAY SELECTION: Squircle-themed Grid */}
      <div className="space-y-3 group">
        <label className="text-[10px] font-black text-[#D4AF37] ml-6 uppercase tracking-[0.4em] group-focus-within:text-[#D4AF37] transition-all">
          Birth month and day
        </label>
        <div className="grid grid-cols-2 gap-4 p-2 bg-white/5 backdrop-blur-3xl rounded-[2.2rem] border border-white/10 group-focus-within:border-[#D4AF37]/20 transition-all">
          <select
            required
            className="appearance-none w-full px-6 py-5 bg-[#0A0A0A] rounded-[1.6rem] text-white font-bold text-base outline-none border border-white/5 cursor-pointer hover:border-[#D4AF37]/30 transition-colors"
            value={dobMonth}
            onChange={(e) => {
              if (error) setError(null);
              setDobMonth(e.target.value);
            }}
          >
            <option
              value=""
              disabled
            >
              Month
            </option>
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m) => (
              <option
                key={m}
                value={m}
              >
                {m}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Day"
            min="1"
            max="31"
            required
            className="w-full px-6 py-5 bg-[#0A0A0A] rounded-[1.6rem] text-white font-bold text-base outline-none border border-white/5 placeholder:text-white"
            value={dobDay}
            onChange={(e) => {
              if (error) setError(null);
              setDobDay(e.target.value);
            }}
          />
        </div>
      </div>

      {/* CONSENT CARD: High-End Toggle UI */}
      <div
        onClick={() => {
          setError(null);
          setConsent(!consent);
        }}
        className={`relative flex items-center gap-5 p-6 rounded-[2.2rem] border transition-all duration-700 cursor-pointer select-none 
          ${error?.type === "VALIDATION" && !consent ? "border-red-500/40 bg-red-500/5" : ""}
          ${!error && consent ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(212,175,55,0.1)]" : "bg-white/5 border-white/5 hover:bg-white/10"}
        `}
      >
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 
          ${error?.type === "VALIDATION" && !consent ? "bg-red-500 text-white" : consent ? "bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,175,55,0.4)]" : "bg-white/40"}
        `}
        >
          {error?.type === "VALIDATION" && !consent ? (
            <AlertCircle size={26} />
          ) : (
            <CheckCircle2
              size={26}
              strokeWidth={3}
              className={consent ? "text-black" : "text-white/10"}
            />
          )}
        </div>
        <div className="flex-1">
          <p
            className={`text-[13px] font-black uppercase tracking-widest ${error?.type === "VALIDATION" && !consent ? "text-red-400" : consent ? "text-white" : "text-white"}`}
          >
            Elite Club Terms
          </p>
          <p
            className={`text-[11px] font-medium leading-relaxed mt-1 ${error?.type === "VALIDATION" && !consent ? "text-red-400/60" : "text-white/60"}`}
          >
            I agree to receive VIP invites & gifts.
          </p>
        </div>
      </div>

      {/* FLOATING ERROR TOAST: Non-obstructive Layout */}
      <div className="relative h-4 flex items-center justify-center">
        {error && (
          <div className="absolute -top-4 flex items-center gap-2 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-500/10 py-1.5 px-6 rounded-full border border-red-500/20 backdrop-blur-xl whitespace-nowrap">
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
            <span className="text-[9px] font-black uppercase tracking-[0.25em]">
              {error.message}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button
          variant="gold"
          isLoading={loading}
          type="submit"
          className={`w-full py-8 transition-all duration-700 rounded-[2.2rem] active:scale-[0.98] ${
            error?.type === "CONNECTION"
              ? "opacity-80 grayscale pointer-events-none"
              : !consent
                ? "opacity-80 grayscale"
                : ""
          }`}
        >
          <span className="flex items-center gap-3 tracking-[0.25em] uppercase font-black text-sm">
            {loading ? "Establishing Access..." : "Claim Welcome Gift"}
            {!loading && (
              <Utensils
                size={18}
                strokeWidth={3}
              />
            )}
          </span>
        </Button>

        {error?.type === "CONNECTION" && (
          <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-1000">
            Internal sync delay. Retrying in 5s...
          </p>
        )}
      </div>
    </form>
  );
};
