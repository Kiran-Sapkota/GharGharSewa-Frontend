import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const successMessage = location.state?.message;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(formData);
      login(res.data.user, res.data.token);
      
      const role = res.data.user.role;
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.requiresVerification && data?.email) {
        navigate("/verify-email", { state: { email: data.email } });
        return;
      }
      setError(data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200 dark:bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-200 dark:bg-emerald-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl shadow-green-100/50">
        <CardBody className="p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium mt-2">Log in to manage your home services</p>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl mb-6 text-sm font-bold">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
              <HiOutlineLockClosed />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 px-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <HiOutlineMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoFocus
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-green-500 dark:text-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1 flex justify-between">
                <span>Password</span>
                <Link to="/forgot-password" className="text-green-600 dark:text-emerald-400 text-xs hover:underline">
                  Forgot?
                </Link>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                  <HiOutlineLockClosed size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-green-500 dark:text-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-lg group"
            >
              {loading ? "Verifying..." : (
                <span className="flex items-center gap-2">
                  Log In <HiOutlineArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              New to GharGhar Sewa?{" "}
              <Link to="/register" className="text-green-600 font-bold hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;