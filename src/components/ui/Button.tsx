import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "gold";
}

export const Button = ({
  children,
  isLoading,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white border border-white/10 shadow-2xl",
    secondary:
      "bg-white/5 backdrop-blur-md hover:bg-white/10 text-white border border-white/5",
    gold: "bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-black hover:opacity-90 shadow-[0_0_25px_rgba(212,175,55,0.3)]",
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`
        w-full px-8 rounded-2xl font-black flex items-center justify-center gap-3 
        transition-all duration-500 active:scale-[0.98] disabled:opacity-40 
        uppercase tracking-widest text-sm
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-3 py-1">
          <Loader2
            className="animate-spin text-inherit"
            size={20}
          />
          <span className="font-bold">Authenticating...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
