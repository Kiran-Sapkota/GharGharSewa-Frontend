import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { resetPassword } from "../api/authApi";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { HiOutlineLockClosed } from "react-icons/hi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="p-8 text-center space-y-4">
            <p className="font-bold text-slate-500">Start from forgot password.</p>
            <Link to="/forgot-password" className="text-emerald-500 font-black">
              Forgot password
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({ email, code, newPassword });
      navigate("/login", {
        state: { message: "Password reset. You can log in now." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardBody className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">
              Reset password
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              Code sent to {email}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                required
                className="w-full text-center text-xl tracking-[0.4em] font-black bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl focus:border-emerald-500 outline-none text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">New password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">Confirm password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>

          <p className="text-center text-sm font-bold text-slate-400 mt-6">
            <Link to="/login" className="text-emerald-500 hover:underline">
              Back to login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default ResetPassword;
