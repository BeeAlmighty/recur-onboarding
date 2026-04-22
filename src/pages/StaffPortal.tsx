import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Users,
  Ticket,
  LogOut,
  Loader2,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "../components/ui/Button";

// Import terminal components
import { LoyaltyTerminal } from "./LoyaltyTerminal";
import { RedemptionTerminal } from "./RedemptionTerminal";

type PortalView = "MENU" | "LOYALTY" | "REDEMPTION";

export const StaffPortal = () => {
  const navigate = useNavigate();

  // Auth & Persistence
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [view, setView] = useState<PortalView>("MENU");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for saved session on mount (Saved Password feature)
  useEffect(() => {
    const savedAuth = localStorage.getItem("recur_terminal_auth");
    if (savedAuth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const handleVerifyAccess = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://n8n.geotech.agency/webhook/verify-terminal-code-recur",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: passcode }),
        },
      );

      const data = await response.json();

      if (data && data.authorized === true) {
        setIsAuthorized(true);
        // Persist session locally
        localStorage.setItem("recur_terminal_auth", "true");
      } else {
        setError("ACCESS DENIED: Unauthorized Terminal PIN.");
      }
    } catch (err) {
      setError("SYSTEM ERROR: Geotech Agency uplink failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("recur_terminal_auth");
    setIsAuthorized(false);
    setView("MENU");
    setPasscode("");
  };

  // --- STAGE 1: LOCK SCREEN ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#0A0A0A] rounded-[3rem] p-10 border border-white/5 shadow-2xl text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Lock
              className="text-[#D4AF37]"
              size={40}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-2">
            Terminal Lock
          </h1>
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.4em] mb-10">
            Lagos Sector • Recur System
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest animate-in zoom-in-95">
              {error}
            </div>
          )}

          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••"
            className="w-full text-center text-4xl tracking-[0.6em] font-black p-6 bg-black rounded-[2rem] border border-white/5 text-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none mb-8 transition-all"
          />

          <Button
            onClick={handleVerifyAccess}
            disabled={isLoading}
            variant="gold"
            className="w-full py-8 rounded-[2rem] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(212,175,55,0.1)]"
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

  // --- STAGE 2: DEPARTMENT SELECTION ---
  if (view === "MENU") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans text-white">
        <div className="w-full max-w-4xl animate-in fade-in duration-700">
          <header className="text-center mb-20">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-2">
              Staff Portal
            </h1>
            <p className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.6em]">
              Management Interface • RECUR
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setView("LOYALTY")}
              className="group bg-[#0A0A0A] border border-white/5 p-12 rounded-[3.5rem] flex flex-col items-center hover:border-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-500"
            >
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Users
                  size={48}
                  className="text-white/20 group-hover:text-[#D4AF37] transition-colors"
                />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-2 italic">
                Loyalty Portal
              </h2>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Log Member Experience
              </p>
            </button>

            <button
              onClick={() => setView("REDEMPTION")}
              className="group bg-[#0A0A0A] border border-white/5 p-12 rounded-[3.5rem] flex flex-col items-center hover:border-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-500"
            >
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Ticket
                  size={48}
                  className="text-white/20 group-hover:text-[#D4AF37] transition-colors"
                />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-2 italic">
                Redeem Voucher
              </h2>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Verify Privilege Access
              </p>
            </button>
          </div>

          <div className="mt-24 flex flex-col items-center gap-6">
            <div className="flex gap-12">
              <button
                onClick={() => navigate("/")}
                className="text-white/60 text-[9px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
              >
                <ArrowLeft
                  size={12}
                  className="inline mr-2"
                />{" "}
                Guest Onboarding
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500/80 text-[9px] font-black uppercase tracking-[0.4em] hover:text-red-500 transition-colors"
              >
                <LogOut
                  size={12}
                  className="inline mr-2"
                />{" "}
                Decommission Device
              </button>
            </div>
            <p className="text-white/80 text-[8px] font-bold uppercase tracking-widest italic">
              Engineered by Geotech Solutions • © 2026
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- STAGE 3: TERMINAL VIEW ---
  return (
    <div className="relative animate-in slide-in-from-right-4 duration-500">
      <button
        onClick={() => setView("MENU")}
        className="fixed top-8 right-8 z-50 bg-[#D4AF37] text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
      >
        <LayoutDashboard size={14} /> Back to Portal Menu
      </button>

      {view === "LOYALTY" ? <LoyaltyTerminal /> : <RedemptionTerminal />}
    </div>
  );
};
