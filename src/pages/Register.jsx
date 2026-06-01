import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineShieldCheck
} from 'react-icons/hi';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    address: "",
    latitude: "",
    longitude: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email and password are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        location: {
          address: formData.address,
          latitude: Number(formData.latitude) || 27.7172,
          longitude: Number(formData.longitude) || 85.324,
        },
      };

      const res = await registerUser(payload);

      if (res.data.requiresVerification) {
        navigate("/verify-email", {
          state: { email: res.data.email, role: payload.role },
        });
        return;
      }

      login(res.data.user, res.data.token);
      if (res.data.user.role === "provider") {
        navigate("/provider-dashboard");
      } else if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 lg:py-24 relative overflow-hidden">
      {/* Abstract Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 dark:bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 dark:bg-emerald-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000" />

      <Card className="w-full max-w-xl relative z-10 shadow-2xl shadow-green-100/50">
        <CardBody className="p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium mt-2">Join the GharGhar Sewa community today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-2">
              <HiOutlineShieldCheck size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                    <HiOutlineUser size={20} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-green-500 dark:text-white outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                    <HiOutlineMail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-green-500 dark:text-white outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                  <HiOutlineLockClosed size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-green-500 dark:text-white outline-none transition-all font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">At least 6 characters required</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">Register As</label>
              <div className="grid grid-cols-2 gap-4">
                {['user', 'provider'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({...formData, role})}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold capitalize ${
                      formData.role === role 
                        ? 'bg-green-50 dark:bg-emerald-500/10 border-green-500 text-green-700 dark:text-emerald-400 shadow-sm' 
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-600'
                    }`}
                  >
                    {role === 'user' ? <HiOutlineUser size={20} /> : <HiOutlineUserGroup size={20} />}
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 px-1">Address / Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                  <HiOutlineLocationMarker size={20} />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 pl-11 pr-4 py-3 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-green-500 dark:text-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-lg mt-4 shadow-green-200"
            >
              {loading ? "Creating Account..." : "Join Now"}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-bold hover:underline underline-offset-4 transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;