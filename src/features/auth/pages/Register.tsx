import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "../../../shared/contexts/AuthContext";
import {
  UserPlus,
  Loader2,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { formatErrorMessage } from "../../../shared/utils/errors";

const LOTTIE_REGISTER =
  "https://assets-v2.lottiefiles.com/a/6beb774c-1166-11ee-a6f1-4788c8724adf/hCt60059mY.lottie";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    organizationName: z.string().min(1, "Organization name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/* -- animation helpers --------------------------------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Register() {
  const navigate = useNavigate();
  const { signUp, session, loading } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (session) return <Navigate to="/app/dashboard" replace />;

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    try {
      await signUp(data.email, data.password, {
        organization_name: data.organizationName,
        first_name: data.firstName,
        last_name: data.lastName,
      });
      navigate(`/confirm-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      setError(
        formatErrorMessage(
          err instanceof Error
            ? err.message
            : "Failed to create account. Please try again.",
        ),
      );
    }
  };

  /* shared input classes */
  const inputCls =
    "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all";

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] relative overflow-hidden">
      {/* ── top nav ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 lg:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <Link
          to="/login"
          className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
        >
          Sign in
        </Link>
      </div>

      {/* ── ambient glows ── */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[140px]" />

      {/* ── LEFT: branding + Lottie (desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-end relative p-12 pr-8">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                <img
                  src="/images/favicon-32x32.png"
                  alt="PodcastFlow AI"
                  className="w-12 h-12 rounded-xl"
                />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">
                Podcast<span className="text-orange-500">Flow</span>
                <span className="text-orange-400 text-lg ml-1 font-semibold">
                  AI
                </span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full" />
            <div className="relative w-full max-w-md mx-auto">
              <DotLottieReact src={LOTTIE_REGISTER} loop autoplay />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-gray-400 text-lg leading-relaxed"
          >
            Join thousands of creators using our AI to produce professional
            podcasts.
          </motion.p>
        </div>
      </div>

      {/* ── RIGHT: registration form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:justify-start lg:pl-8 lg:pr-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* mobile brand */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="lg:hidden mb-5 text-center"
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl">
                <img
                  src="/images/favicon-32x32.png"
                  alt="PodcastFlow AI"
                  className="w-10 h-10 rounded-xl"
                />
              </div>
              <span className="text-2xl font-bold text-white">
                Podcast<span className="text-orange-500">Flow</span>
                <span className="text-orange-400 text-sm ml-1 font-semibold">
                  AI
                </span>
              </span>
            </Link>
          </motion.div>

          {/* heading */}
          <motion.div variants={fadeUp} custom={1}>
            <h2 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h2>
            <p className="text-gray-400 mb-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* form card */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="bg-[#141414] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/40"
          >
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                >
                  <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                  {error}
                </motion.div>
              )}

              {/* name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                    <input
                      id="firstName"
                      type="text"
                      {...register("firstName")}
                      className={inputCls}
                      placeholder="First name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                    <input
                      id="lastName"
                      type="text"
                      {...register("lastName")}
                      className={inputCls}
                      placeholder="Last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* organization */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Organization Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                  <input
                    id="organizationName"
                    type="text"
                    {...register("organizationName")}
                    className={inputCls}
                    placeholder="Your Organization"
                  />
                </div>
                {errors.organizationName && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              {/* email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password")}
                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* divider */}
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          {/* footer */}
          <motion.p
            variants={fadeUp}
            custom={3}
            className="mt-6 text-center text-xs text-gray-600"
          >
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
