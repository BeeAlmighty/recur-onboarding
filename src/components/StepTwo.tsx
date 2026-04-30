import React, { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { recurClient } from "../api/client";

interface StepTwoProps {
  phone: string;
  onComplete: (data: any) => void;
}

export const StepTwo = ({ phone, onComplete }: StepTwoProps) => {
  const [name, setName] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<{ type: string; message: string } | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dobMonth || !dobDay) {
      setError({
        type: "VALIDATION",
        message: "Please complete your guest profile.",
      });
      return;
    }
    setLoading(true);
    try {
      const data = await recurClient.registerCustomer({
        phone,
        name,
        dob: `${dobMonth}-${dobDay}`,
        consent: true,
      });
      if (data.success) onComplete({ ...data, fullName: name });
    } catch (err) {
      setError({
        type: "CONNECTION",
        message: "Network sync failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <div className="text-center space-y-2 mb-2">
        <h3 className="text-white font-black text-xl uppercase tracking-tight">
          Create Guest Profile
        </h3>
        <p className="text-white/60 text-xs font-medium">
          One-time registration to unlock full access.
        </p>
      </div>

      <Input
        label="Full Name"
        helperText="As you'd like it to appear on your digital invites."
        placeholder="e.g. Moses Maduakonam"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-[2.2rem]"
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-1 ml-6">
          <label className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">
            Annual Celebration
          </label>
          <span className="text-[12px] text-white/80 font-medium">
            Receive exclusive treats on your special day.
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 p-3 bg-white/10 rounded-[2.2rem] border border-white/20">
          <select
            className="w-full px-4 py-6 bg-[#181818] rounded-[1.6rem] text-white font-bold outline-none border border-white/20 cursor-pointer appearance-none"
            value={dobMonth}
            onChange={(e) => setDobMonth(e.target.value)}
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
            className="w-full px-6 py-6 bg-[#181818] rounded-[1.6rem] text-white font-bold outline-none border border-white/20 placeholder:text-white/60"
            value={dobDay}
            onChange={(e) => setDobDay(e.target.value)}
          />
        </div>
      </div>

      <div
        onClick={() => setConsent(!consent)}
        className={`flex items-center gap-5 p-7 rounded-[2.5rem] border transition-all duration-500 cursor-pointer ${
          consent
            ? "bg-[#D4AF37]/10 border-[#D4AF37]"
            : "bg-white/5 border-white/10 opacity-60"
        }`}
      >
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
            consent ? "bg-[#D4AF37] text-black" : "bg-white/20 text-white/40"
          }`}
        >
          <CheckCircle2
            size={24}
            strokeWidth={3}
          />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-white">
            Elite Access Consent
          </p>
          <p className="text-[11px] font-medium text-white/70 leading-relaxed mt-1">
            I agree to receive VIP menus and personalized rewards.
          </p>
        </div>
      </div>

      <Button
        isLoading={loading}
        variant="gold"
        type="submit"
        className="py-8 rounded-[2.2rem]"
      >
        <span className="flex items-center gap-3 tracking-[0.25em] uppercase font-black text-sm">
          {loading ? "Syncing..." : "Unlock Access"}
          <Sparkles size={18} />
        </span>
      </Button>
    </form>
  );
};
