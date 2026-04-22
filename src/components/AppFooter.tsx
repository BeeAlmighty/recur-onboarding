import { useNavigate } from "react-router-dom";
import { ShieldCheck, Command, Cpu } from "lucide-react";

export const AppFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="mt-auto py-12 flex flex-col items-center gap-10">
      {/* 1. Staff Entrance Button */}
      <button
        onClick={() => navigate("/staff")}
        className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-[#111111] border border-white/50 transition-all duration-500 hover:border-[#D4AF37]/40 active:scale-95"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-black/40 border border-white/60 group-hover:border-[#D4AF37]/40 transition-colors">
            <ShieldCheck
              size={13}
              className="text-white/60 group-hover:text-[#D4AF37]"
            />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.15em] group-hover:text-white/80 transition-colors">
              Staff Portal
            </span>
            <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1 flex items-center gap-1 group-hover:text-[#D4AF37]/60">
              <Command size={8} /> Terminal Access
            </span>
          </div>
        </div>
      </button>

      {/* 2. Brand & Engineering Signature */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.6em] ml-[0.6em]">
            Recur Registry • Lagos
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        </div>

        <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity duration-500">
          <Cpu
            size={10}
            className="text-[#D4AF37]"
          />
          <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em]">
            Engineered by{" "}
            <span className="text-[#D4AF37]">Geotech Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
