import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "../../../shared/contexts/AuthContext";
import {
  Mail,
  Loader2,
  ArrowLeft,
  KeyRound,
  Send,
  CheckCircle,
} from "lucide-react";

const LOTTIE_FORGOT =
  "https://assets-v2.lottiefiles.com/a/2377a3fc-117d-11ee-a5b9-53d6e60e5d99/HHhVxmVYla.lottie";

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

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4 py-12">
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
      <div className="pointer-events-none absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-orange-600/5 blur-[140px]" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* brand */}
        <motion.div variants={fadeUp} custom={0} className="text-center mb-5">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
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
        <motion.div variants={fadeUp} custom={1} className="text-center mb-5">
          <h2 className="text-3xl font-bold text-white mb-2">
            Reset your password
          </h2>
          <p className="text-gray-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </motion.div>

        {/* card */}
        <motion.div
          variants={fadeUp}
          custom={2}
          className="bg-[#141414] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/40"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              /* ── success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* lottie */}
                <div className="relative mx-auto w-36 h-36 mb-4">
                  <div className="absolute inset-0 bg-green-500/10 blur-[40px] rounded-full" />
                  <div className="relative">
                    <DotLottieReact src={LOTTIE_FORGOT} loop autoplay />
                  </div>
                </div>

                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-500/10 border border-green-500/20 mb-5">
                  <CheckCircle className="h-7 w-7 text-green-400" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  Check your email
                </h3>
                <p className="text-gray-400 mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="text-lg font-semibold text-orange-500 mb-6 break-all">
                  {email}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Click the link in the email to set a new password. Check your
                  spam folder if you don't see it.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </motion.div>
            ) : (
              /* ── form state ── */
              <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                {/* lottie */}
                <div className="relative mx-auto w-32 h-32 mb-6">
                  <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-full" />
                  <div className="relative">
                    <DotLottieReact src={LOTTIE_FORGOT} loop autoplay />
                  </div>
                </div>

                {/* icon */}
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                  <KeyRound className="h-7 w-7 text-orange-500" />
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
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
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Reset Link
                      </>
                    )}
                  </motion.button>
                </form>

                {/* back link */}
                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
