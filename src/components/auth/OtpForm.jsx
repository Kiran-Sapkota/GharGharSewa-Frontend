import { useState } from "react";
import { Button } from "../ui/Button";

const OtpForm = ({
  email,
  onSubmit,
  onResend,
  loading,
  resendLoading,
  submitLabel = "Verify",
  resendLabel = "Resend code",
}) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(code.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm font-bold text-slate-500 text-center">
        Code sent to <span className="text-slate-800 dark:text-white">{email}</span>
      </p>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">
          6-digit code
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          required
          className="w-full text-center text-2xl tracking-[0.5em] font-black bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-4 py-4 rounded-2xl focus:border-emerald-500 outline-none"
        />
      </div>

      <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
        {loading ? "Please wait..." : submitLabel}
      </Button>

      {onResend && (
        <button
          type="button"
          onClick={onResend}
          disabled={resendLoading}
          className="w-full text-sm font-black text-emerald-500 hover:underline disabled:opacity-50"
        >
          {resendLoading ? "Sending..." : resendLabel}
        </button>
      )}
    </form>
  );
};

export default OtpForm;
