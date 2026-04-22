import { useState } from "react";
import { StepOne } from "./components/StepOne";
import { StepTwo } from "./components/StepTwo";
import { SuccessMessage } from "./components/SuccessMessage";
import { Crown } from "lucide-react";
import { AppFooter } from "./components/AppFooter";

type AppView = "CHECK" | "REGISTER" | "ALREADY_IN";

export default function OnboardingFlow() {
  const [view, setView] = useState<AppView>("CHECK");
  const [phone, setPhone] = useState<string>("");
  const [userContext, setUserContext] = useState({
    greeting: "",
    firstName: "",
    fullName: "",
    isNewUser: false,
  });

  const handleSuccess = (data: any, isNew: boolean) => {
    setUserContext({
      greeting:
        data.greeting ||
        (isNew ? "Welcome to the Inner Circle" : "Good Evening"),
      firstName: data.firstName || "Member",
      fullName: data.fullName || "",
      isNewUser: isNew,
    });
    setView("ALREADY_IN");
    // Auto-redirect to menu after 8 seconds
    setTimeout(() => {
      window.location.href =
        "https://drive.google.com/file/d/1gXVpco1RFQCdQrHMJ0iPwHVrPs7U9PBa/view";
    }, 8000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#080808] text-white font-sans selection:bg-[#D4AF37]/30 flex flex-col">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[20%] w-[70%] h-[50%] bg-[#D4AF37]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] mx-auto px-6 pt-16 flex-1 flex flex-col">
        <header className="text-center mb-12 animate-in fade-in duration-1000">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] border border-white/10 mb-8 shadow-2xl">
            <Crown className="text-[#D4AF37] w-12 h-12" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-3 uppercase">
            RECUR<span className="text-[#D4AF37]">.</span>
          </h1>
          <p className="text-white/60 max-w-[280px] mx-auto leading-relaxed text-[13px] uppercase tracking-[0.3em] font-bold">
            Experience Remastered
          </p>
        </header>

        <main className="w-full">
          <div className="w-full bg-[#111111] backdrop-blur-3xl rounded-[3rem] p-8 shadow-2xl border border-white/10 relative">
            {view === "CHECK" && (
              <StepOne
                onRegistered={(data) => handleSuccess(data, false)}
                onNotRegistered={(validatedPhone) => {
                  setPhone(validatedPhone);
                  setView("REGISTER");
                }}
              />
            )}

            {view === "REGISTER" && (
              <StepTwo
                phone={phone}
                onComplete={(data) => handleSuccess(data, true)}
              />
            )}

            {view === "ALREADY_IN" && (
              <SuccessMessage
                greeting={userContext.greeting}
                firstName={userContext.firstName}
                type={userContext.isNewUser ? "NEW" : "RETURNING"}
              />
            )}
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
