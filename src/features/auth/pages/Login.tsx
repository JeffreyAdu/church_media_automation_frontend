import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "../../../shared/contexts/AuthContext";
import {
  LogIn,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { formatErrorMessage } from "../../../shared/utils/errors";

const LOTTIE_LOGIN =
  "https://assets-v2.lottiefiles.com/a/7ed64552-1180-11ee-a916-ab928951c9e0/Vltasg1Fu2.lottie";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/* -- animation helpers --------------------------------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Login() {
  const navigate = useNavigate();
  const { signIn, session, loading } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (session) return <Navigate to="/app/dashboard" replace />;

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      await signIn(data.email, data.password);
      navigate("/app/dashboard");
    } catch (err: unknown) {
      setError(
        formatErrorMessage(
          err instanceof Error ? err.message : "Failed to sign in",
        ),
      );
    }
  };

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
          to="/register"
          className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
        >
          Create account
        </Link>
      </div>

      {/* ── ambient background glows ── */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[140px]" />

      {/* ── LEFT: branding + Lottie (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-end relative p-12 pr-8">
        <div className="max-w-md w-full text-center">
          {/* brand */}
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

          {/* lottie */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full" />
            <div className="relative w-full max-w-md mx-auto">
              <DotLottieReact src={LOTTIE_LOGIN} loop autoplay />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-gray-400 text-lg leading-relaxed"
          >
            Automate your podcast from YouTube to every major platform —
            effortlessly.
          </motion.p>
        </div>
      </div>

      {/* ── RIGHT: sign-in form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:justify-start lg:pl-8 lg:pr-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* mobile brand (shown <lg) */}
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
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400 mb-5">
              Sign in to your account to continue{" "}
              <span className="lg:hidden">
                or{" "}
                <Link
                  to="/register"
                  className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                >
                  create a new account
                </Link>
              </span>
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
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
                    <LogIn className="h-5 w-5" />
                    Sign in
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* divider */}
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>

          {/* footer text */}
          <motion.p
            variants={fadeUp}
            custom={3}
            className="mt-6 text-center text-xs text-gray-600"
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </motion.div>
      </div>

      {/* ── css animations for background ── */}
      <style>{`
        @keyframes auth-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
