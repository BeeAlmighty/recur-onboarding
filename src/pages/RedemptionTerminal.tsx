import { useState } from "react";
import {
  Ticket,
  Gift,
  CheckCircle2,
  XCircle,
  Loader2,
  History,
} from "lucide-react";
import { Button } from "../components/ui/Button";

interface VoucherData {
  id: string;
  code: string;
  offer: string;
  status: "UNUSED" | "USED" | "EXPIRED";
  customerName: string;
}

export const RedemptionTerminal = () => {
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);
  const [status, setStatus] = useState<
    "IDLE" | "LOADING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLookupVoucher = async () => {
    if (!voucherCode) return;
    setStatus("LOADING");
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

  const handleRedeemAction = async () => {
    if (!voucherData) return;
    setStatus("LOADING");

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

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 md:mb-16 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
            Voucher Portal
          </h1>
          <p className="text-[#D4AF37] font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] mt-1">
            Status Verification
          </p>
        </header>

        <div className="space-y-6 md:space-y-8">
          {/* Input Section - Made stackable on mobile */}
          <section className="bg-[#0A0A0A] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-inner">
            <label className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">
              <Ticket
                size={14}
                className="text-[#D4AF37]"
              />
              Privilege Access Code
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="RECUR-XXXX-XXXX"
                className="flex-1 bg-black text-lg md:text-xl font-black p-5 md:p-6 rounded-[1.5rem] md:rounded-[1.8rem] border border-white/5 outline-none focus:border-[#D4AF37]/40 text-white placeholder:text-white/10 uppercase transition-all"
              />
              <Button
                onClick={handleLookupVoucher}
                variant="gold"
                disabled={status === "LOADING"}
                className="w-full sm:w-auto px-10 py-5 sm:py-0 rounded-[1.5rem] md:rounded-[1.8rem] font-black uppercase tracking-widest text-xs h-auto sm:h-auto"
              >
                {status === "LOADING" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </section>

          {/* Result Card - Optimized spacing */}
          {voucherData && (
            <div
              className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border animate-in slide-in-from-bottom-4 duration-500 ${
                voucherData.status === "USED"
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-[#D4AF37]/5 border-[#D4AF37]/20 shadow-2xl"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-1">
                    {voucherData.offer}
                  </h3>
                  <p className="text-white/40 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
                    Guest: {voucherData.customerName}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest self-start sm:self-auto ${
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
                  disabled={status === "LOADING"}
                  variant="gold"
                  className="w-full py-6 md:py-8 rounded-[1.5rem] md:rounded-[1.8rem] text-sm font-black uppercase tracking-[0.2em]"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Gift size={18} /> Confirm Redemption
                  </span>
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-3 text-red-500/60 p-5 md:p-6 bg-red-500/5 rounded-[1.5rem] md:rounded-[1.8rem] border border-red-500/10">
                  <History size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
                    Already redeemed in registry
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Status Messages - Multi-line support */}
          {status === "SUCCESS" && (
            <div className="flex items-start md:items-center gap-4 bg-green-500/10 text-green-500 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-green-500/20 animate-in zoom-in-95">
              <CheckCircle2
                size={24}
                className="shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">
                  Privilege Claimed
                </span>
                <span className="text-[9px] md:text-[10px] font-bold opacity-70">
                  Airtable registry successfully updated.
                </span>
              </div>
            </div>
          )}

          {status === "ERROR" && !voucherData && (
            <div className="flex items-start md:items-center gap-4 bg-red-500/10 text-red-500 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-red-500/20 animate-in zoom-in-95">
              <XCircle
                size={24}
                className="shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">
                  Invalid Entry
                </span>
                <span className="text-[9px] md:text-[10px] font-bold opacity-70">
                  {errorMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
