import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { verifyEmail, resendVerificationOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Card, CardBody } from "../components/ui/Card";
import OtpForm from "../components/auth/OtpForm";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email || "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  if (!email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="p-8 text-center space-y-4">
            <p className="font-bold text-slate-500">No email to verify.</p>
            <Link to="/register" className="text-emerald-500 font-black">
              Go to register
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const redirectAfterLogin = (user) => {
    if (user.role === "provider") navigate("/provider-dashboard");
    else if (user.role === "admin") navigate("/admin-dashboard");
    else navigate("/");
  };

  const handleVerify = async (code) => {
    setError("");
    try {
      setLoading(true);
      const res = await verifyEmail({ email, code });
      login(res.data.user, res.data.token);
      if (res.data.pendingApproval) {
        setPendingApproval(true);
      } else {
        redirectAfterLogin(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      setResendLoading(true);
      await resendVerificationOtp(email);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  if (pendingApproval) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardBody className="p-8 md:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mx-auto text-3xl">
              ⏳
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">
              Registration Submitted!
            </h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Your provider registration request has been submitted successfully.
              Please contact the admin to get your account approved before you
              can start accepting bookings.
            </p>
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-700 dark:text-amber-400 text-sm font-bold">
                You will receive an email once your account is approved.
              </p>
            </div>
            <Link
              to="/provider-dashboard"
              className="block w-full py-3 rounded-xl bg-emerald-500 text-white font-black hover:bg-emerald-600 transition-colors"
            >
              Go to Dashboard
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardBody className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">
              Verify your email
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              Enter the 6-digit code we sent you
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold">
              {error}
            </div>
          )}

          <OtpForm
            email={email}
            onSubmit={handleVerify}
            onResend={handleResend}
            loading={loading}
            resendLoading={resendLoading}
          />

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

export default VerifyEmail;
