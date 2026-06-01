import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { forgotPassword } from "../api/authApi";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { HiOutlineMail } from "react-icons/hi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await forgotPassword(email.trim());
      navigate("/reset-password", { state: { email: email.trim().toLowerCase() } });
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
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
              Forgot password
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              We will email you a reset code
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 px-1">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send reset code"}
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

export default ForgotPassword;
