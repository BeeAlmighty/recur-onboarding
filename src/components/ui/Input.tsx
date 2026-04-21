import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="group space-y-2 w-full animate-in fade-in duration-700">
      <label className="text-[10px] font-black text-[#D4AF37] ml-1 uppercase tracking-[0.2em] transition-all group-focus-within:text-[#D4AF37] group-focus-within:translate-x-1">
        {label}
      </label>
      <div className="relative w-full">
        <input
          className={`
            w-full px-6 py-5
            bg-[#121212] border border-white/10
            rounded-2xl 
            text-white font-bold text-lg
            placeholder:text-white
            outline-none transition-all duration-500
            focus:border-[#D4AF37]/40 
            focus:ring-[12px] focus:ring-[#D4AF37]/5 
            focus:shadow-[0_0_40px_-10px_rgba(212,175,55,0.15)]
          `}
          {...props}
        />
      </div>
    </div>
  );
};
