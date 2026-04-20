import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Gift,
  AlertTriangle,
  History,
} from "lucide-react";
import { Button } from "../components/ui/Button";

type TerminalStatus = "IDLE" | "VERIFYING" | "REDEEMING" | "SUCCESS" | "ERROR";

interface VoucherData {
  id: string;
  code: string;
  offer: string;
  status: "UNUSED" | "USED" | 'EXPIRED';
  customerName: string;
}

export const RedemptionTerminal = () => {
  const navigate = useNavigate();

  // Auth State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");

  // Logic States
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);
  const [status, setStatus] = useState<TerminalStatus>("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  // Clear errors on input
  useEffect(() => {
    if (status === "ERROR") {
      setStatus("IDLE");
      setErrorMessage("");
    }
  }, [passcode, voucherCode]);

  /**
   * STAGE 1: PIN VERIFICATION (Staff Auth)
   */
  const handleVerifyAccess = async () => {
    setStatus("VERIFYING");
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
      if (data?.authorized) {
        setIsAuthorized(true);
        setStatus("IDLE");
      } else {
        throw new Error("ACCESS DENIED: Invalid Terminal PIN.");
      }
    } catch (err: any) {
      setStatus("ERROR");
      setErrorMessage(err.message || "Uplink to Geotech interrupted.");
    }
  };

  /**
   * STAGE 2: VOUCHER SEARCH (Check Airtable)
   */
  const handleLookupVoucher = async () => {
    if (!voucherCode) return;
    setStatus("VERIFYING");
    setVoucherData(null);

    try {
      const response = await fetch(
        "https://n8n.geotech.agency/webhook/verify-voucher-recur",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voucherCode }),
        },
      );
      const data = await response.json();

      if (response.ok && data.found) {
        setVoucherData(data.voucher);
        setStatus("IDLE");
      } else {
        throw new Error(data.message || "Voucher code not recognized.");
      }
    } catch (err: any) {
      setStatus("ERROR");
      setErrorMessage(err.message);
    }
  };

  /**
   * STAGE 3: REDEEM VOUCHER (Update Airtable to "USED")
   */
  const handleRedeemAction = async () => {
    if (!voucherData) return;
    setStatus("REDEEMING");

    try {
      const response = await fetch(
        "https://n8n.geotech.agency/webhook/redeem-voucher-recur",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recordId: voucherData.id,
            voucherCode: voucherData.code,
          }),
        },
      );

      if (response.ok) {
        setStatus("SUCCESS");
        setVoucherCode("");
        setTimeout(() => setStatus("IDLE"), 5000);
      } else {
        throw new Error("Redemption failed. Try again.");
      }
    } catch (err: any) {
      setStatus("ERROR");
      setErrorMessage(err.message);
    }
  };

  // --- RENDER: STAFF LOCK SCREEN ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#0A0A0A] rounded-[2.5rem] p-10 border border-white/5 text-center relative">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10">
            <ShieldCheck
              className={status === "ERROR" ? "text-red-500" : "text-[#D4AF37]"}
              size={40}
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-2">
            Redemption Lock
          </h1>
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.4em] mb-10">
            Lagos Sector Terminal
          </p>

          {status === "ERROR" && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 animate-in zoom-in-95">
              <AlertTriangle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {errorMessage}
              </span>
            </div>
          )}

          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••"
            className="w-full text-center text-4xl tracking-[0.6em] font-black p-6 bg-black rounded-[2rem] border border-white/5 text-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none mb-8"
          />

          <Button
            onClick={handleVerifyAccess}
            variant="gold"
            disabled={status === "VERIFYING"}
            className="w-full py-8 rounded-[2rem] font-black uppercase tracking-widest"
          >
            {status === "VERIFYING" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Unlock System"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // --- RENDER: REDEMPTION INTERFACE ---
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 animate-in fade-in duration-700 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsAuthorized(false)}
              className="p-4 bg-white/5 rounded-[1.5rem] text-white/20 hover:text-[#D4AF37] transition-all border border-white/5"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Voucher Portal
              </h1>
              <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.5em] mt-1">
                Status Verification
              </p>
            </div>
          </div>
          <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-[#D4AF37]/20">
            Secure Terminal Active
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Input Section */}
          <section className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
            <label className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">
              <Ticket
                size={14}
                className="text-[#D4AF37]"
              />{" "}
              Privilege Access Code
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="RECUR-XXXX-XXXX"
                className="flex-1 bg-black text-xl font-black p-6 rounded-[1.8rem] border border-white/5 outline-none focus:border-[#D4AF37]/40 transition-all text-white placeholder:text-white/5 uppercase"
              />
              <Button
                onClick={handleLookupVoucher}
                variant="gold"
                disabled={status === "VERIFYING"}
                className="px-10 rounded-[1.8rem] font-black uppercase tracking-widest text-xs"
              >
                {status === "VERIFYING" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </section>

          {/* Result Card */}
          {voucherData && (
            <div
              className={`p-8 rounded-[2.5rem] border animate-in slide-in-from-bottom-4 duration-500 ${
                voucherData.status === "USED"
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-[#D4AF37]/5 border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(212,175,55,0.05)]"
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
                    {voucherData.offer}
                  </h3>
                  <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">
                    Guest: {voucherData.customerName}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    voucherData.status === "USED"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-[#D4AF37]/20 text-[#D4AF37]"
                  }`}
                >
                  {voucherData.status}
                </div>
              </div>

              {voucherData.status === "UNUSED" ? (
                <Button
                  onClick={handleRedeemAction}
                  isLoading={status === "REDEEMING"}
                  variant="gold"
                  className="w-full py-8 rounded-[1.8rem] text-sm font-black uppercase tracking-[0.2em]"
                >
                  <span className="flex items-center gap-3">
                    <Gift size={18} /> Confirm Redemption
                  </span>
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-3 text-red-500/60 p-6 bg-red-500/5 rounded-[1.8rem] border border-red-500/10">
                  <History size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Already redeemed in current session
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Feedback Messages */}
          {status === "SUCCESS" && (
            <div className="flex items-center gap-4 bg-green-500/10 text-green-500 p-6 rounded-[2rem] border border-green-500/20 animate-in zoom-in-95">
              <CheckCircle2 size={24} />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">
                  Privilege Claimed
                </span>
                <span className="text-[10px] font-bold opacity-70">
                  Airtable registry successfully updated to 'USED'.
                </span>
              </div>
            </div>
          )}

          {status === "ERROR" && !voucherData && (
            <div className="flex items-center gap-4 bg-red-500/10 text-red-500 p-6 rounded-[2rem] border border-red-500/20 animate-in zoom-in-95">
              <XCircle size={24} />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">
                  Invalid Entry
                </span>
                <span className="text-[10px] font-bold opacity-70">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-20 flex flex-col items-center gap-4">
          <button
            // onClick={() => setIsAuthorized(false)}
            onClick={() => navigate("/")}
            className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em] hover:text-[#D4AF37] transition-all"
          >
            Lock System Terminal
          </button>
          <p className="text-white/5 text-[8px] font-bold uppercase tracking-widest">
            Engineered by Geotech Solutions • Lagos Sector
          </p>
        </div>
      </div>
    </div>
  );
};
