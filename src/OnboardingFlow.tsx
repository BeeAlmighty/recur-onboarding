import { useState } from "react";
import { Link } from "react-router-dom"; // Add this import
import { StepOne } from "./components/StepOne";
import { StepTwo } from "./components/StepTwo";
import { SuccessMessage } from "./components/SuccessMessage";
import { Crown, Star, Gift, Ticket, Lock } from "lucide-react"; // Added Ticket & Lock
import { AppFooter } from "./components/AppFooter";

// Explicit type-only import for 2026 TS standards
import type { LoyaltyCheckResponse } from "./types";

type AppView = "CHECK" | "REGISTER" | "ALREADY_IN";

interface UserContext {
  greeting: string;
  firstName: string;
  fullName?: string;
  isNewUser: boolean;
}

export default function OnboardingFlow() {
  const [view, setView] = useState<AppView>("CHECK");
  const [phone, setPhone] = useState<string>("");
  const [userContext, setUserContext] = useState<UserContext>({
    greeting: "",
    firstName: "",
    isNewUser: false,
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37]/30 overflow-x-hidden">
      {/* Luxury Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[20%] w-[70%] h-[50%] bg-[#D4AF37]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[60%] -right-[20%] w-[80%] h-[60%] bg-[#B8860B]/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] mx-auto px-6 pt-12 pb-16 min-h-screen flex flex-col box-border">
        {/* NEW: Discreet Staff Navigation */}
        <div className="flex justify-end mb-4 px-2">
          <Link
            to="/voucher"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group"
          >
            <Lock className="w-2.5 h-2.5 text-white/20 group-hover:text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-[#D4AF37]">
              Staff Portal
            </span>
          </Link>
        </div>

        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] border border-white/10 mb-8 shadow-2xl">
            <Crown className="text-[#D4AF37] w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-3 uppercase">
            RECUR<span className="text-[#D4AF37]">.</span>
          </h1>
          <p className="text-white/40 max-w-[280px] mx-auto leading-relaxed text-[13px] uppercase tracking-[0.25em] font-medium">
            The Elite Guest Lounge,
            <span className="text-[#D4AF37] block mt-1 font-black italic">
              Experience Remastered.
            </span>
          </p>
        </header>

        <main className="flex-1 w-full">
          <div className="w-full bg-[#0A0A0A]/80 backdrop-blur-3xl rounded-[3rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 ring-1 ring-white/10 box-border overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

            {view === "CHECK" && (
              <StepOne
                onRegistered={(data: LoyaltyCheckResponse) => {
                  setUserContext({
                    greeting: data.greeting || "Good Evening",
                    firstName: data.firstName || "Distinguished Guest",
                    isNewUser: false,
                  });
                  setView("ALREADY_IN");
                }}
                onNotRegistered={(validatedPhone) => {
                  setPhone(validatedPhone);
                  setView("REGISTER");
                }}
              />
            )}

            {view === "REGISTER" && (
              <StepTwo
                phone={phone}
                onComplete={(data) => {
                  setUserContext({
                    greeting: "Welcome to the Inner Circle",
                    firstName: data.firstName || "New Member",
                    fullName: data.fullName,
                    isNewUser: true,
                  });
                  setView("ALREADY_IN");
                }}
              />
            )}

            {view === "ALREADY_IN" && (
              <SuccessMessage
                greeting={userContext.greeting}
                firstName={userContext.firstName}
                fullName={userContext.fullName}
                type={userContext.isNewUser ? "NEW" : "RETURNING"}
              />
            )}
          </div>

          {/* Premium Core Pillars */}
          {view === "CHECK" && (
            <div className="grid grid-cols-2 gap-3 mt-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 w-full box-border">
              {/* Existing Pillars... */}
              <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex flex-col items-center text-center group">
                <Star className="text-[#D4AF37] mb-2 w-6 h-6" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/50 mb-1">
                  Rewards
                </h3>
                <p className="text-[11px] font-bold text-white/80 uppercase">
                  Loyalty Bonuses
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex flex-col items-center text-center group">
                <Crown className="text-[#D4AF37] mb-2 w-6 h-6" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/50 mb-1">
                  Status
                </h3>
                <p className="text-[11px] font-bold text-white/80 uppercase">
                  VIP Access
                </p>
              </div>

              {/* Redesigned Birthday/Voucher Pillar */}
              <Link
                to="/voucher"
                className="col-span-2 bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex items-center justify-center gap-4 group hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/20 transition-all duration-500"
              >
                <Ticket className="text-[#D4AF37] w-6 h-6 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/50 mb-0.5">
                    Redeem
                  </h3>
                  <p className="text-[11px] font-bold text-white/80 uppercase tracking-wide">
                    Vouchers & Gifts
                  </p>
                </div>
              </Link>
            </div>
          )}
        </main>

        <footer className="mt-auto pt-12 text-center w-full">
          <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.4em] mb-3">
            RECUR ELITE CLUB
          </p>
          <p className="text-[10px] text-white/80 flex items-center justify-center gap-2 font-bold italic mb-4">
            Engineered by
            <span className="text-[#D4AF37] font-black not-italic tracking-wider uppercase hover:text-[#D4AF37] transition-all cursor-crosshair">
              GeoTech Solutions
            </span>
          </p>
          <AppFooter />
        </footer>
      </div>
    </div>
  );
}
