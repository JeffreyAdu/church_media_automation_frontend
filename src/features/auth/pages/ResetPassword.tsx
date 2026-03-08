import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "../../../shared/contexts/AuthContext";
import {
  Lock,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const LOTTIE_RESET =
  "https://assets-v2.lottiefiles.com/a/de2d7198-117a-11ee-af83-63fcb53768a2/b70jQc9WzZ.lottie";

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

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update password",
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
            Set your new password
          </h2>
          <p className="text-gray-400">
            Choose a strong password with at least 6 characters.
          </p>
        </motion.div>

        {/* card */}
        <motion.div
          variants={fadeUp}
          custom={2}
          className="bg-[#141414] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/40"
        >
          <AnimatePresence mode="wait">
            {success ? (
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
                    <DotLottieReact src={LOTTIE_RESET} loop autoplay />
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-500/10 border border-green-500/20 mb-5"
                >
                  <CheckCircle2 className="h-7 w-7 text-green-400" />
                </motion.div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  Password updated!
                </h3>
                <p className="text-gray-400 mb-6">
                  Your password has been successfully reset. You can now sign in
                  with your new password.
                </p>
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Go to Sign In
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ) : (
              /* ── form state ── */
              <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                {/* lottie */}
                <div className="relative mx-auto w-32 h-32 mb-6">
                  <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-full" />
                  <div className="relative">
                    <DotLottieReact src={LOTTIE_RESET} loop autoplay />
                  </div>
                </div>

                {/* icon */}
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                  <ShieldCheck className="h-7 w-7 text-orange-500" />
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

                  {/* new password */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="••••••••"
                        autoComplete="new-password"
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
                  </div>

                  {/* confirm password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="••••••••"
                        autoComplete="new-password"
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
                        <ShieldCheck className="h-5 w-5" />
                        Reset Password
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
