import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import FormField from "../../components/shared/FormField";
import { inputClass } from "../../utils/validation";
import LoginIllustration from "../../assets/Create Account 3.svg";

export default function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.admin));
      toast.success(`Welcome, ${res.data.admin.name}`);
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 via-white to-ink-50/50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-teal/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-muted/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-ink-100/5 blur-3xl" />
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 40px), repeating-linear-gradient(to bottom, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 40px)`
          }}
        />
      </div>

      {/* Main container - Two column layout */}
      <div className="w-full max-w-5xl bg-white/40 backdrop-blur-[2px] rounded-3xl border border-ink-100/50 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* LEFT COLUMN - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-ink-50/50 to-white/30">
            <div className="max-w-md w-full">
              <img
                src={LoginIllustration}
                alt="Admin Login"
                className="w-full h-auto "
              />
              {/* Decorative quote */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-muted/30 border border-teal/10">
                  <ShieldCheck size={12} className="text-teal" />
                  <span className="text-[10px] font-medium text-ink-500 tracking-wide">SECURE ADMIN PORTAL</span>
                </div>
                <p className="text-xs text-ink-400 mt-3 max-w-xs mx-auto">
                  Manage jobs, review applications, and control the hiring pipeline from a single dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Login Form */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Logo and header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className="w-10 h-10 bg-ink rounded-2xl flex items-center justify-center shadow-soft">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <rect
                      x="2"
                      y="6"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="white"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M6 6V5a3 3 0 016 0v1"
                      stroke="white"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-ink text-xl tracking-tight">
                  HirePortal
                </span>
              </div>
              
              <div className="flex justify-center mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-50 border border-ink-100">
                  <ShieldCheck size={12} className="text-teal" />
                  <span className="text-[10px] font-medium text-ink-500 tracking-wide">Admin Access</span>
                </div>
              </div>

              <h1 className="font-semibold text-ink text-2xl tracking-tight">
                Sign in to dashboard
              </h1>
              <p className="text-xs text-ink-400 mt-1">
                Restricted area — authorised personnel only
              </p>
            </div>

            {/* Demo credentials alert */}
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 mb-6">
              <Lock size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[11px] font-medium text-amber-800">Demo Credentials</p>
                <p className="text-[10px] text-amber-700">
                  admin@jobportal.com / Admin@123
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Email" required error={errors.email?.message}>
                <input
                  className={inputClass(errors.email)}
                  type="email"
                  placeholder="admin@jobportal.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </FormField>

              <FormField
                label="Password"
                required
                error={errors.password?.message}
              >
                <div className="relative">
                  <input
                    className={`${inputClass(errors.password)} pr-10`}
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-4 py-3 text-sm font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink transition-colors group"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}