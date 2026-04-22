import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const Input = ({
  label,
  helperText,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="group space-y-2.5 w-full animate-in fade-in duration-700">
      <div className="flex flex-col gap-1 ml-1">
        <label className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.2em] transition-all group-focus-within:translate-x-1">
          {label}
        </label>
        {helperText && (
          <span className="text-[12px] text-white/80 font-medium tracking-wide italic">
            {helperText}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <input
          className={cn(
            `
            w-full px-6 py-6
            bg-[#121212] border border-white/20
            rounded-[1.8rem] 
            text-white font-bold text-lg
            placeholder:text-white/60
            outline-none transition-all duration-500
            focus:border-[#D4AF37] 
            focus:ring-[12px] focus:ring-[#D4AF37]/10 
            focus:shadow-[0_0_50px_-10px_rgba(212,175,55,0.2)]
          `,
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
};
