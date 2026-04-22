import { useEffect, useRef } from "react";
import {
  Star,
  Martini,
  Ticket,
  ExternalLink,
  Menu,
} from "lucide-react";
import { Button } from "./ui/Button";

interface SuccessMessageProps {
  greeting: string;
  firstName: string;
  fullName?: string;
  type: "RETURNING" | "NEW";
}

export const SuccessMessage = ({
  greeting,
  firstName,
  type,
}: SuccessMessageProps) => {
  const isNew = type === "NEW";
  const actionSectionRef = useRef<HTMLDivElement>(null);
  const MENU_URL =
    "https://drive.google.com/file/d/1gXVpco1RFQCdQrHMJ0iPwHVrPs7U9PBa/view";

  useEffect(() => {
    const timer = setTimeout(() => {
      actionSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center animate-in zoom-in-95 duration-1000 ease-out">
      <div className="flex justify-center mb-8">
        <div className="p-6 rounded-[2.5rem] relative bg-gradient-to-b from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/20 shadow-2xl">
          <Star className="text-[#D4AF37] w-14 h-14 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
            {isNew ? "✨" : "💎"}
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">
        {greeting}, <span className="text-[#D4AF37]">{firstName}</span>!
      </h2>

      <p className="text-white/60 mb-10 leading-relaxed text-[13px] font-medium px-4">
        {isNew
          ? "Access granted. You've officially joined the Recur Elite. Your table and digital menu are ready."
          : "Welcome back. Your status is verified. Redirecting you to today's curated selection."}
      </p>

      <div className="bg-white/5 p-7 rounded-[2.5rem] mb-10 text-left border border-white/5">
        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-6">
          Immediate Perks
        </p>
        <ul className="space-y-6">
          <li className="flex items-start gap-5">
            <div className="bg-[#0A0A0A] p-3 rounded-2xl border border-[#D4AF37]/20">
              {isNew ? (
                <Martini className="w-5 h-5 text-[#D4AF37]" />
              ) : (
                <Ticket className="w-5 h-5 text-[#D4AF37]" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white">
                {isNew ? "Welcome Toast" : "Priority Guest"}
              </span>
              <span className="text-[11px] text-white/70">
                {isNew
                  ? "Show this screen to your server for a gift."
                  : "Enjoy expedited service today."}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div
        ref={actionSectionRef}
        className="space-y-5 pt-2"
      >
        <Button
          variant="gold"
          onClick={() => (window.location.href = MENU_URL)}
          className="py-7 rounded-2xl font-black text-lg group"
        >
          <Menu
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
          <span className="uppercase tracking-widest">Open Digital Menu</span>
          <ExternalLink
            size={18}
            className="opacity-50"
          />
        </Button>
      </div>
    </div>
  );
};
