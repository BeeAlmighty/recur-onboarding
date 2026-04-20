import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Phone,
  Receipt,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Terminal,
  Utensils,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export const LoyaltyTerminal = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  // Form States
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  // Reset error when user starts typing a new code
  useEffect(() => {
    if (status === "ERROR") {
      setStatus("IDLE");
      setErrorMessage("");
    }
  }, [passcode]);

  /**
   * STAGE 1: PIN VERIFICATION
   */
  const handleVerifyAccess = async () => {
    setIsLoading(true);
    setStatus("IDLE");
    try {
      const response = await fetch(
        "https://n8n.geotech.agency/webhook/verify-terminal-code-recur",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: passcode }),
        },
      );

      if (!response.ok) throw new Error("Auth sync failed");
      const data = await response.json();

      if (data && data.authorized === true) {
        setIsAuthorized(true);
        setStatus("IDLE");
      } else {
        setStatus("ERROR");
        setErrorMessage("ACCESS DENIED: Unauthorized Terminal PIN.");
      }
    } catch (err) {
      setStatus("ERROR");
      setErrorMessage(
        "SYSTEM ERROR: Connection to server failed!. Check Recur status.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * STAGE 2: TRANSACTION SUBMISSION
   */
  const handleSubmitPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("IDLE");
    setErrorMessage("");

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
        setTimeout(() => navigate("/"), 4000);
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

  // --- RENDER: SYSTEM LOCK SCREEN ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#0A0A0A] rounded-[3rem] p-10 border border-white/5 shadow-2xl text-center relative overflow-hidden">
          {/* Animated Background Pulse on Error */}
          {status === "ERROR" && (
            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
          )}

          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 relative z-10">
            <ShieldAlert
              className={status === "ERROR" ? "text-red-500" : "text-[#D4AF37]"}
              strokeWidth={1.5}
              size={40}
            />
          </div>

          <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-3 relative z-10">
            Terminal Locked
          </h1>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-10 relative z-10">
            Internal Access Only • Restaurant
          </p>

          {/* LOCK SCREEN ERROR TOAST */}
          {status === "ERROR" && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 animate-in zoom-in-95 duration-300 relative z-10">
              <AlertTriangle
                size={18}
                className="shrink-0"
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-left leading-tight">
                {errorMessage}
              </span>
            </div>
          )}

          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••"
            className="w-full text-center text-4xl tracking-[0.6em] font-black p-6 bg-black rounded-[2rem] border border-white/5 text-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all mb-8 placeholder:text-white/5 relative z-10"
          />

          <Button
            onClick={handleVerifyAccess}
            disabled={isLoading}
            variant="gold"
            className="w-full py-8 rounded-[2rem] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(212,175,55,0.1)] relative z-10"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Unlock System"}
          </Button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-12 flex items-center gap-2 text-white/20 font-black text-[9px] uppercase tracking-[0.4em] hover:text-[#D4AF37] transition-all"
        >
          <ArrowLeft size={12} /> Return to Onboarding
        </button>
      </div>
    );
  }

  // --- RENDER: SERVICE TERMINAL ---
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 animate-in fade-in duration-700 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 mb-16">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="p-4 bg-white/5 rounded-[1.5rem] text-white/20 hover:text-[#D4AF37] hover:bg-white/10 transition-all border border-white/5"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Elite Terminal
              </h1>
              <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.5em] mt-1">
                Recur Management Interface
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start md:self-center bg-[#D4AF37]/10 text-[#D4AF37] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-[#D4AF37]/20">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            Live Sync: Geotech
          </div>
        </div>

        <form
          onSubmit={handleSubmitPoints}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 focus-within:border-[#D4AF37]/40 transition-all shadow-inner">
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

            <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 focus-within:border-[#D4AF37]/40 transition-all shadow-inner">
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

          {/* Status Feedback */}
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
                  Loyalty points have been synchronized.
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

        <div className="flex flex-col items-center mt-16 gap-6">
          <button
            onClick={() => setIsAuthorized(false)}
            className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em] hover:text-red-500 transition-colors flex items-center gap-2"
          >
            <Terminal size={12} /> Decommission Terminal
          </button>
          <p className="text-white/5 text-[8px] font-bold uppercase tracking-widest">
            Engineered by Geotech Solutions • © 2026
          </p>
        </div>
      </div>
    </div>
  );
};
