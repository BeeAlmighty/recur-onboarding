import React, { useState } from "react";
import {
  Phone,
  Receipt,
  CheckCircle2,
  XCircle,
  Loader2,
  Utensils,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export const LoyaltyTerminal = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("IDLE");

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const response = await fetch(
        "https://n8n.geotech.agency/webhook/record-transaction-recur",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: cleanPhone,
            amount: Number(amount),
            timestamp: new Date().toISOString(),
            source: "RECUR_TERMINAL",
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setStatus("SUCCESS");
        setAmount("");
        setPhone("");
        setTimeout(() => setStatus("IDLE"), 4000);
      } else {
        setStatus("ERROR");
        setErrorMessage(
          data.message || "Member not found. Onboard guest first.",
        );
      }
    } catch (error) {
      setStatus("ERROR");
      setErrorMessage("Network Interruption: Check Geotech Agency uplink.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Elite Terminal
          </h1>
          <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.5em] mt-1">
            Loyalty Log Interface
          </p>
        </header>

        <form
          onSubmit={handleSubmitPoints}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 focus-within:border-[#D4AF37]/40 transition-all">
              <label className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">
                <Phone
                  size={14}
                  className="text-[#D4AF37]"
                />{" "}
                Member Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234..."
                className="w-full bg-transparent text-2xl font-black outline-none text-white placeholder:text-white/5"
              />
            </div>

            <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 focus-within:border-[#D4AF37]/40 transition-all">
              <label className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">
                <Receipt
                  size={14}
                  className="text-[#D4AF37]"
                />{" "}
                Bill Amount (₦)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl font-black outline-none text-white placeholder:text-white/5"
              />
            </div>
          </div>

          {status === "SUCCESS" && (
            <div className="flex items-center gap-4 bg-[#D4AF37]/10 text-[#D4AF37] p-6 rounded-[2rem] border border-[#D4AF37]/20 animate-in slide-in-from-top-4">
              <CheckCircle2
                size={24}
                className="shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">
                  Transaction Verified
                </span>
                <span className="text-[10px] font-bold opacity-70">
                  Loyalty points synchronized with RECUR Cloud.
                </span>
              </div>
            </div>
          )}

          {status === "ERROR" && (
            <div className="flex items-center gap-4 bg-red-500/10 text-red-500 p-6 rounded-[2rem] border border-red-500/20 animate-in slide-in-from-top-4">
              <XCircle
                size={24}
                className="shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">
                  Entry Refused
                </span>
                <span className="text-[10px] font-bold opacity-70">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            variant="gold"
            className="w-full py-10 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-4">
                <Utensils
                  size={24}
                  strokeWidth={3}
                />{" "}
                Log Experience
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
