import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Mail,
  CheckCircle,
  Loader2,
  ArrowRight,
  Inbox,
  Search,
  MousePointerClick,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../../shared/contexts/AuthContext";

const LOTTIE_EMAIL =
  "https://assets-v2.lottiefiles.com/a/7acde0ee-1b13-11ef-bad5-8bb4fd872ef4/F4JzogyvaW.lottie";

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

const steps = [
  { icon: Inbox, text: "Check your email inbox (and spam folder)" },
  { icon: MousePointerClick, text: "Click the confirmation link in the email" },
  { icon: ArrowRight, text: "Return here to sign in" },
];

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const { resendConfirmation } = useAuth();

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendError(null);
    setResent(false);

    try {
      await resendConfirmation(email);
      setResent(true);
    } catch (err: unknown) {
      setResendError(
        err instanceof Error
          ? err.message
          : "Failed to resend confirmation email",
      );
    } finally {
      setResending(false);
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
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-green-500/5 blur-[140px]" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        {/* brand */}
        <motion.div variants={fadeUp} custom={0} className="text-center mb-5">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              <img
                src="/images/favicon-32x32.png"
                alt="PodcastFlow"
                className="w-10 h-10 rounded-xl"
              />
            </div>
            <span className="text-2xl font-bold text-white">
              Podcast<span className="text-orange-500">Flow</span>
            </span>
          </Link>
        </motion.div>

        {/* card */}
        <motion.div
          variants={fadeUp}
          custom={1}
          className="bg-[#141414] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/40 text-center"
        >
          {/* lottie animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            className="relative mx-auto w-40 h-40 mb-4"
          >
            <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-full" />
            <div className="relative">
              <DotLottieReact src={LOTTIE_EMAIL} loop autoplay />
            </div>
          </motion.div>

          {/* success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-500/10 border border-green-500/20 mb-5"
          >
            <CheckCircle className="h-7 w-7 text-green-400" />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Check Your Email
          </h2>

          <div className="mb-6">
            <Mail className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-3">
              We've sent a confirmation email to:
            </p>
            <p className="text-lg font-semibold text-orange-500 mb-4 break-all">
              {email}
            </p>
          </div>

          {/* steps */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 mb-6 text-left">
            <p className="text-sm font-medium text-gray-300 mb-3">
              Next steps:
            </p>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <step.icon className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <span className="text-sm text-gray-400">{step.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* feedback messages */}
          <AnimatePresence>
            {resendError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-4"
              >
                {resendError}
              </motion.div>
            )}

            {resent && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmation email resent! Check your inbox.
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-gray-500 mb-4">
            Didn't receive the email? Check your spam folder or
          </p>

          {/* resend button */}
          <motion.button
            onClick={handleResend}
            disabled={resending}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:border-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium mb-3 cursor-pointer"
          >
            {resending ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resending...
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Resend Confirmation Email
              </span>
            )}
          </motion.button>

          {/* CTA */}
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            <Search className="h-5 w-5" />
            Go to Sign In
            <ArrowRight className="h-4 w-4 ml-1" />
          </motion.button>

          <p className="mt-5 text-xs text-gray-600">
            If you continue to have issues, please contact support.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
