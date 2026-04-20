import { useNavigate } from "react-router-dom";
import { ShieldCheck, Command } from "lucide-react";

export const AppFooter = () => {
  const navigate = useNavigate();

  const goToTerminal = () => {
    navigate("/terminal");
  };

  return (
    <footer className="mt-auto py-12 flex flex-col items-center gap-8 border-t border-white/[0.02]">
      {/* 1. Brand Signature */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.5em]">
          Recur Elite Club
        </p>
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      </div>

      {/* 2. Elevated Staff Entrance */}
      <button
        onClick={goToTerminal}
        className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md transition-all duration-700 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 active:scale-95"
      >
        {/* Ambient Hover Glow */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 blur-xl transition-all duration-700" />

        <div className="relative flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 group-hover:border-[#D4AF37]/40 transition-colors">
            <ShieldCheck
              size={13}
              className="text-white/20 group-hover:text-[#D4AF37] transition-colors"
            />
          </div>

          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-hover:text-white/80 transition-colors">
              Staff Portal
            </span>
            <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1 flex items-center gap-1 group-hover:text-[#D4AF37]/60">
              <Command size={8} /> Terminal Access
            </span>
          </div>
        </div>
      </button>

      {/* 3. Copyright & Legal */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-[8px] text-white font-bold uppercase tracking-widest">
          © 2026 Recur Registry • Lagos
        </p>
      </div>
    </footer>
  );
};
