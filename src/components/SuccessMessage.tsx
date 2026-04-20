import { useEffect, useRef } from "react";
import {
  CheckCircle2,
  Star,
  Sparkles,
  Gift,
  Clock,
  Martini,
  Ticket,
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
  fullName,
  type,
}: SuccessMessageProps) => {
  const isNew = type === "NEW";
  const actionSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      actionSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppAction = () => {
    const message = isNew
      ? encodeURIComponent(
          `Hi Recur! I'm ${fullName || firstName}. Just joined the Elite Club—I'm ready for my welcome treat!`,
        )
      : encodeURIComponent(
          `Hi Recur, I'm ${firstName}. Checking in for my visit today!`,
        );

    window.location.href = `https://wa.me/2347079797963?text=${message}`;
  };

  return (
    <div className="text-center animate-in zoom-in-95 duration-1000 ease-out">
      <div className="flex justify-center mb-8">
        <div className="p-6 rounded-[2.5rem] relative bg-gradient-to-b from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/20 shadow-2xl">
          <Star className="text-[#D4AF37] w-14 h-14 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg text-lg animate-bounce">
            {isNew ? "✨" : "💎"}
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">
        {greeting}, <span className="text-[#D4AF37]">{firstName}</span>!
      </h2>

      <p className="text-white/40 mb-10 leading-relaxed text-[13px] font-medium px-4">
        {isNew
          ? "You've officially joined the Recur Elite. Your journey into fine dining excellence begins today."
          : "Welcome back, Member. Your status is active and your table is being prepared."}
      </p>

      {/* Guest Perks Grid */}
      <div className="bg-white/5 p-7 rounded-[2.5rem] mb-10 text-left border border-white/5 shadow-inner">
        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-6">
          {isNew ? "Membership Benefits" : "Elite Status Perks"}
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
              <span className="text-sm font-black text-white tracking-tight">
                {isNew ? "Welcome Toast" : "Skip the Queue"}
              </span>
              <span className="text-[11px] text-white/70 leading-tight">
                {isNew
                  ? "Complimentary signature drink on your first visit."
                  : "Access to discounts and promotions"}
              </span>
            </div>
          </li>

          <li className="flex items-start gap-5">
            <div className="bg-[#0A0A0A] p-3 rounded-2xl border border-[#D4AF37]/50">
              <Gift className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-tight">
                Birthday Indulgence
              </span>
              <span className="text-[11px] text-white/60 leading-tight">
                A treat on your birth day.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-5">
            <div className="bg-[#0A0A0A] p-3 rounded-2xl border border-[#D4AF37]/50">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-tight">
                Flash Events
              </span>
              <span className="text-[11px] text-white/60 leading-tight">
                Discounts and free treats as Loyalty Perks.
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
          onClick={handleWhatsAppAction}
          className="py-6 rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
        >
          {isNew ? <Sparkles size={20} /> : <CheckCircle2 size={20} />}
          {isNew ? "Claim Welcome Drink" : "Check-in at Reception"}
        </Button>

        <div className="flex items-center justify-center gap-3">
          <span className="h-1 w-1 bg-[#D4AF37]/40 rounded-full" />
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
            {isNew ? "Offer Valid for 24 Hours" : "Point Updates Instantly"}
          </p>
          <span className="h-1 w-1 bg-[#D4AF37]/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
