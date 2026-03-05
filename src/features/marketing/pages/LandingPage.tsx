import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Youtube,
  Podcast,
  Rss,
  Zap,
  Headphones,
  Upload,
  Star,
  Menu,
  X,
  Mic,
  Radio,
  BarChart3,
  Settings,
  Globe,
  Music,
  FileText,
  CheckCircle,
  Volume2,
  Wand2,
  Layers,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Lottie animation URLs (LottieFiles CDN – free, Lottie Simple Lic) */
/* ------------------------------------------------------------------ */
const LOTTIE_HERO =
  "https://assets-v2.lottiefiles.com/a/685d97d2-8659-11ee-9d1e-df61609df49a/Vc8v1uLN9H.lottie";
const LOTTIE_CTA =
  "https://assets-v2.lottiefiles.com/a/9404d370-118b-11ee-91b3-4b6f49da5453/sck60WiTnc.lottie";

/* ------------------------------------------------------------------ */
/*  Shared animation variants                                         */
/* ------------------------------------------------------------------ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.1,
    },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
  }),
};

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ------------------------------------------------------------------ */
/*  useInView helper                                                   */
/* ------------------------------------------------------------------ */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");
  const num = parseInt(value, 10);
  const isNumber = !isNaN(num);

  useEffect(() => {
    if (!inView || !isNumber) {
      if (!isNumber && inView) setDisplay(value);
      return;
    }
    let start = 0;
    const end = num;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / end), 16);
    const timer = setInterval(() => {
      start += 1;
      setDisplay(String(start));
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, num, isNumber, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated audio waveform bars (pure CSS)                           */
/* ------------------------------------------------------------------ */
function AudioWaveform({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`}>
      {[40, 70, 50, 80, 35, 65, 45].map((h, i) => (
        <span
          key={i}
          className="inline-block w-[3px] rounded-full bg-orange-500"
          style={{
            height: `${h}%`,
            animation: "waveform 1.2s ease-in-out infinite alternate",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ========================= LANDING PAGE ========================= */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Section refs for scroll-triggered animations */
  const aboutReveal = useReveal();
  const howItWorksReveal = useReveal();
  const pipelineReveal = useReveal();
  const featuresReveal = useReveal();
  const featureCardsReveal = useReveal();

  /* Parallax for hero glow */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(heroScroll, [0, 1], [0, 120]);
  const glowScale = useTransform(heroScroll, [0, 1], [1, 1.4]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ---------- keyframe injection ---------- */}
      <style>{`
        @keyframes waveform {
          0%   { transform: scaleY(.4) }
          100% { transform: scaleY(1) }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) }
          50%      { transform: translateY(-12px) }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: .45 }
          50%      { opacity: .8 }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
      `}</style>

      {/* ========================= NAVBAR ========================= */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 rounded-lg"
            >
              <img
                src="/images/favicon-32x32.png"
                alt="PodcastFlow"
                className="w-8 h-8 rounded-lg"
              />
            </motion.div>
            <span className="text-lg font-bold tracking-tight">
              Podcast<span className="text-orange-500">Flow</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <motion.a
              href="#features"
              className="hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              Features
            </motion.a>
            <motion.a
              href="#how-it-works"
              className="hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              How It Works
            </motion.a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
              >
                Sign In
                <motion.span
                  className="absolute bottom-0 left-1/2 h-[2px] bg-orange-500 rounded-full"
                  initial={{ width: 0, x: "-50%" }}
                  whileHover={{ width: "80%", x: "-50%" }}
                  transition={{ duration: 0.25 }}
                />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.07,
                boxShadow: "0 0 20px rgba(249,115,22,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg"
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 text-black text-sm font-bold rounded-lg hover:bg-orange-400 transition-all"
              >
                Get Started
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile menu — animated */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-[#111] border-t border-white/5 overflow-hidden"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="px-4 pb-6 pt-4 space-y-4"
              >
                <motion.a
                  variants={fadeUp}
                  href="#features"
                  className="block text-gray-300 hover:text-white text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </motion.a>
                <motion.a
                  variants={fadeUp}
                  href="#how-it-works"
                  className="block text-gray-300 hover:text-white text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </motion.a>
                <hr className="border-white/10" />
                <motion.div
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/login"
                    className="block text-gray-300 hover:text-white text-sm font-medium"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(249,115,22,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg"
                >
                  <Link
                    to="/register"
                    className="block w-full text-center px-5 py-2.5 bg-orange-500 text-black text-sm font-bold rounded-lg hover:bg-orange-400 relative overflow-hidden"
                  >
                    Get Started
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{
                        animation: "shimmer 3s infinite",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ========================= HERO ========================= */}
      <section
        ref={heroRef}
        className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 px-4 sm:px-6 lg:px-8"
      >
        {/* Ambient glow — parallax */}
        <motion.div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-orange-500/10 blur-[120px]"
          style={{
            y: glowY,
            scale: glowScale,
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left – copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6"
            >
              <Zap className="h-4 w-4" />
              YouTube-to-Podcast Automation
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6"
            >
              Podcasts That
              <br />
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-orange-500 inline-block"
              >
                Stand Out
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
            >
              Connect your YouTube channel once and let PodcastFlow handle the
              rest — automatic audio extraction, custom branding, and
              distribution to every major platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 30px rgba(249,115,22,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl"
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-black rounded-xl hover:bg-orange-400 transition-all font-bold text-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Start Free</span>
                  <motion.span
                    className="relative z-10 inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                  {/* Shimmer overlay */}
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    style={{
                      animation: "shimmer 3s infinite",
                      backgroundSize: "200% 100%",
                    }}
                  />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.06,
                  borderColor: "rgba(249,115,22,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl"
              >
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-white rounded-xl hover:border-orange-500/40 hover:bg-white/5 transition-all font-semibold text-lg"
                >
                  See How It Works
                  <motion.span
                    className="inline-block"
                    animate={{ y: [0, 3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="h-5 w-5 rotate-90" />
                  </motion.span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Right – Lottie hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative flex items-center justify-center"
            style={{ animation: "float 5s ease-in-out infinite" }}
          >
            <div className="w-full max-w-md lg:max-w-lg aspect-square">
              <DotLottieReact src={LOTTIE_HERO} loop autoplay />
            </div>
            {/* Decorative ring — pulsing */}
            <motion.div
              animate={{ scale: [1.1, 1.15, 1.1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-orange-500/10"
            />
          </motion.div>
        </div>
      </section>

      {/* ================== ANNOUNCEMENT BANNER ================== */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-black py-6 px-4 mt-22 relative overflow-hidden"
      >
        {/* Shimmer sweep across the banner */}
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          style={{
            animation: "shimmer 4s infinite",
            backgroundSize: "200% 100%",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-7xl mx-auto flex items-center justify-center gap-3 text-base sm:text-lg font-bold text-center"
        >
          <motion.div
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
          >
            <Radio className="h-5 w-5 shrink-0" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Your YouTube content deserves a wider audience.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="hidden sm:inline"
          >
            Let automation do the heavy lifting.
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="sm:hidden"
          >
            Let automation do the heavy lifting.
          </motion.span>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="h-5 w-5 shrink-0" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ==================== ABOUT / VALUE ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
        <motion.div
          ref={aboutReveal.ref}
          initial="hidden"
          animate={aboutReveal.inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Decorative audio wave */}
          <motion.div variants={scaleIn} className="flex justify-center mb-8">
            <div className="w-24 h-16 flex items-center">
              <AudioWaveform className="h-full w-full" />
            </div>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-2xl sm:text-3xl text-gray-300 leading-relaxed"
          >
            We automatically convert your YouTube videos into podcast episodes
            and distribute them to every major platform — so you can focus on
            creating content, not managing feeds.
          </motion.p>
        </motion.div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={howItWorksReveal.ref}
            initial="hidden"
            animate={howItWorksReveal.inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-extrabold mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-xl max-w-2xl mx-auto"
            >
              Three simple steps to go from YouTube uploads to podcast
              distribution
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={howItWorksReveal.inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: 1,
                icon: Youtube,
                title: "Connect YouTube",
                desc: "Paste your YouTube channel URL. We detect new uploads automatically and start processing within minutes.",
              },
              {
                step: 2,
                icon: Zap,
                title: "Auto Processing",
                desc: "Audio is extracted, your custom intro/outro is added, episode metadata is generated — all hands-free.",
              },
              {
                step: 3,
                icon: Rss,
                title: "Publish Everywhere",
                desc: "Your RSS feed updates automatically. Submit once to Spotify, Apple Podcasts, Google, and Amazon.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                custom={step - 1}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="relative group"
              >
                {/* Step number */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={
                    howItWorksReveal.inView ? { scale: 1 } : { scale: 0 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.3 + (step - 1) * 0.15,
                  }}
                  className="absolute -top-4 -left-2 w-10 h-10 bg-orange-500 text-black rounded-full flex items-center justify-center text-lg font-extrabold z-10 shadow-lg shadow-orange-500/20"
                >
                  {step}
                </motion.div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 pt-10 h-full hover:border-orange-500/30 transition-colors">
                  <Icon className="h-10 w-10 text-orange-500 mb-5" />
                  <h3 className="text-2xl font-bold mb-3">{title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================ DETAILED PROCESS PIPELINE ================ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            ref={pipelineReveal.ref}
            initial="hidden"
            animate={pipelineReveal.inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div
              variants={scaleIn}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6"
            >
              <Layers className="h-4 w-4" />
              The Full Pipeline
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-extrabold mb-4"
            >
              From Upload to&nbsp;
              <span className="text-orange-500">Every Ear</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-xl max-w-2xl mx-auto"
            >
              Here's exactly what happens behind the scenes every time you
              publish a new video.
            </motion.p>
          </motion.div>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Centre line — grows on scroll */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={pipelineReveal.inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              style={{ transformOrigin: "top" }}
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/40 via-orange-500/20 to-transparent"
            />

            {[
              {
                icon: Youtube,
                title: "Video Detected",
                desc: "Our system monitors your YouTube channel around the clock. The moment a new video goes live, PodcastFlow picks it up automatically — no manual trigger needed.",
                color: "text-red-400",
                bg: "bg-red-500/10 border-red-500/20",
              },
              {
                icon: Volume2,
                title: "Audio Extraction",
                desc: "High-fidelity audio is separated from the video source at the original bitrate, preserving every detail of your voice and sound design.",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
              {
                icon: Wand2,
                title: "Audio Enhancement",
                desc: "Levels are normalized, loudness is balanced to podcast standards (-16 LUFS), and any low-quality artifacts are cleaned up.",
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
              },
              {
                icon: Music,
                title: "Branding Applied",
                desc: "Your custom intro and outro are seamlessly stitched to the audio. Every episode sounds consistent and professional.",
                color: "text-pink-400",
                bg: "bg-pink-500/10 border-pink-500/20",
              },
              {
                icon: FileText,
                title: "Metadata Generated",
                desc: "Episode title, description, artwork, and chapter markers are auto-created from your video metadata — ready for every directory.",
                color: "text-teal-400",
                bg: "bg-teal-500/10 border-teal-500/20",
              },
              {
                icon: Rss,
                title: "RSS Feed Updated",
                desc: "Your podcast's RSS feed is instantly refreshed with the new episode. Directories pick it up within minutes.",
                color: "text-orange-400",
                bg: "bg-orange-500/10 border-orange-500/20",
              },
              {
                icon: Globe,
                title: "Global Distribution",
                desc: "The episode goes live on Spotify, Apple Podcasts, Amazon Music, Google Podcasts, and every connected platform — simultaneously.",
                color: "text-green-400",
                bg: "bg-green-500/10 border-green-500/20",
              },
            ].map(({ icon: Icon, title, desc, color, bg }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={isLeft ? slideFromLeft : slideFromRight}
                  className={`relative flex flex-col md:flex-row items-center gap-6 mb-12 last:mb-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content card */}
                  <div
                    className={`flex-1 ${
                      isLeft
                        ? "md:text-right md:pr-12"
                        : "md:text-left md:pl-12"
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 md:hidden">
                      <Icon className={`h-6 w-6 ${color}`} />
                      {title}
                    </h3>
                    <h3 className={`text-2xl font-bold mb-2 hidden md:block`}>
                      {title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Centre dot (desktop) — pops in */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="hidden md:flex items-center justify-center z-10"
                  >
                    <div
                      className={`w-12 h-12 rounded-full border ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                  </motion.div>

                  {/* Spacer for opposite side */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f] scroll-mt-20"
      >
        <motion.div
          ref={featuresReveal.ref}
          initial="hidden"
          animate={featuresReveal.inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left – Lottie / visual */}
          <motion.div
            variants={scaleIn}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Bright container so the animation is visible */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent rounded-3xl p-8 border border-orange-500/10"
              >
                <div className="aspect-square">
                  <DotLottieReact src={LOTTIE_CTA} loop autoplay />
                </div>
              </motion.div>
              {/* Platform badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={featuresReveal.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-full"
              >
                <span className="text-sm text-gray-400 font-medium">
                  Available on
                </span>
                <Headphones className="h-5 w-5 text-orange-400" />
                <Podcast className="h-5 w-5 text-orange-400" />
                <Radio className="h-5 w-5 text-orange-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right – feature checklist */}
          <div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-extrabold mb-4"
            >
              Best Tools For
              <br />
              Your Podcast Growth
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 mb-10 text-xl">
              Everything you need to turn your YouTube channel into a thriving
              podcast — built in from day one.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={featuresReveal.inView ? "visible" : "hidden"}
              className="space-y-5"
            >
              {[
                {
                  icon: Mic,
                  label: "High-quality audio extraction",
                },
                {
                  icon: Rss,
                  label: "Auto-generated RSS feed",
                },
                {
                  icon: Upload,
                  label: "Custom intro & outro branding",
                },
                {
                  icon: BarChart3,
                  label: "Episode analytics & tracking",
                },
                {
                  icon: Settings,
                  label: "Full episode management",
                },
              ].map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-11 h-11 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-orange-500" />
                  </motion.div>
                  <span className="text-gray-200 font-medium text-lg">
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============== FEATURE CARDS (full-width) ============== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={featureCardsReveal.ref}
            initial="hidden"
            animate={featureCardsReveal.inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-extrabold mb-4"
            >
              Everything You Need
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-xl max-w-2xl mx-auto"
            >
              Professional-grade features for content creators who want to reach
              new audiences
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={featureCardsReveal.inView ? "visible" : "hidden"}
            variants={staggerFast}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Youtube,
                title: "Channel Monitoring",
                desc: "We watch your YouTube channel 24/7 and pick up new uploads instantly.",
              },
              {
                icon: Zap,
                title: "Auto-Processing",
                desc: "Audio extraction, normalization, and metadata — fully automated.",
              },
              {
                icon: Rss,
                title: "RSS Feed",
                desc: "Industry-standard feed compatible with every major podcast directory.",
              },
              {
                icon: Upload,
                title: "Historical Import",
                desc: "Backfill your entire video archive into podcast form with one click.",
              },
              {
                icon: Headphones,
                title: "Custom Branding",
                desc: "Add your own podcast artwork, intro, and outro to every episode.",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                desc: "Track episode downloads, listener engagement, and growth trends.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                custom={i}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { duration: 0.25 },
                }}
                className="bg-[#141414] border border-white/5 rounded-2xl p-7 hover:border-orange-500/30 transition-colors group"
              >
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-500/20 transition-colors"
                >
                  <Icon className="h-6 w-6 text-orange-500" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============== DISTRIBUTE EVERYWHERE ============== */}
      <DistributeSection />

      {/* ========================= CTA ========================= */}
      <CTASection />

      {/* ===================== TESTIMONIALS ===================== */}
      <TestimonialsSection />

      {/* ======================== FOOTER ======================== */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-white/5 bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg">
                <img
                  src="/images/favicon-32x32.png"
                  alt="PodcastFlow"
                  className="w-8 h-8 rounded-lg"
                />
              </div>
              <span className="text-lg font-bold">
                Podcast<span className="text-orange-500">Flow</span>
              </span>
            </motion.div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
              ].map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ y: -2, color: "#d1d5db" }}
                  className="hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="hover:text-gray-300 transition-colors"
                >
                  Sign In
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2, scale: 1.05, color: "#f97316" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="hover:text-gray-300 transition-colors"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} PodcastFlow. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

/* ================================================================ */
/*  DISTRIBUTE SECTION — extracted for cleanliness                   */
/* ================================================================ */
function DistributeSection() {
  const reveal = useReveal();

  const platforms = [
    {
      name: "Spotify",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
    {
      name: "Apple Podcasts",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#A855F7">
          <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59-.12 1.072-.696 1.15-.576.078-.972-.306-1.09-.882-.27-1.368-.81-2.47-1.776-3.465-1.29-1.35-2.88-2.052-4.758-2.052-1.878 0-3.468.702-4.758 2.052-.966.996-1.506 2.097-1.776 3.465-.12.576-.516.96-1.092.882-.576-.078-.816-.56-.696-1.15.354-1.773 1.042-3.12 2.266-4.392 1.608-1.685 3.72-2.587 6.056-2.587zm-.024 3.504c3.27 0 5.856 2.754 5.796 5.976-.036 1.56-.582 2.964-1.614 4.14-.216.246-.48.378-.792.378-.516 0-.924-.384-.924-.882 0-.252.084-.45.252-.636.72-.81 1.086-1.782 1.122-2.88.042-2.244-1.878-4.164-4.2-3.93-2.046.21-3.594 1.974-3.528 4.038.036 1.038.39 1.98 1.068 2.772.168.186.264.396.264.648 0 .498-.408.882-.924.882-.306 0-.576-.132-.792-.378-1.032-1.176-1.578-2.58-1.614-4.14-.06-3.222 2.526-5.976 5.886-5.988zm.024 3.468c1.392 0 2.52 1.128 2.52 2.52 0 .798-.378 1.512-.948 1.98v5.472c0 .87-.702 1.572-1.572 1.572-.87 0-1.572-.702-1.572-1.572V14.04c-.57-.468-.948-1.182-.948-1.98 0-1.392 1.128-2.52 2.52-2.52z" />
        </svg>
      ),
    },
    {
      name: "Amazon Music",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#25D8FD">
          <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.694 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.748.074-1.051-.872-1.238-1.276-1.814-2.106-1.735 1.768-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.383-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.581l-3.074-.333c-.259-.058-.548-.266-.472-.66C5.771 1.145 9.228 0 12.342 0c1.573 0 3.627.418 4.867 1.609 1.573 1.507 1.422 3.517 1.422 5.707v5.166c0 1.553.645 2.233 1.25 3.072.209.301.256.662-.013.886-.672.563-1.868 1.609-2.524 2.195l-.2.17zM21.779 20.799C19.445 22.698 16.058 24 13.155 24c-4.128 0-7.843-1.527-10.651-4.07-.221-.199-.024-.471.241-.316 3.032 1.764 6.782 2.824 10.656 2.824 2.613 0 5.487-.541 8.132-1.664.399-.172.733.262.246.025zm.704-.804c-.3-.384-1.987-.181-2.744-.092-.23.027-.265-.173-.058-.318 1.343-.942 3.548-.671 3.804-.355.258.318-.067 2.523-1.328 3.575-.194.162-.378.076-.292-.139.284-.707.919-2.286.618-2.671z" />
        </svg>
      ),
    },
    {
      name: "YouTube Music",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#FF0000">
          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
        </svg>
      ),
    },
    {
      name: "Google Podcasts",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8">
          <path fill="#0066D9" d="M1.636 8.727v6.546h2.91V8.727z" />
          <path fill="#4285F4" d="M6.182 3.818v16.364h2.909V3.818z" />
          <path fill="#EA4335" d="M10.727 0v24h2.909V0z" />
          <path fill="#34A853" d="M15.273 4.364v15.272h2.909V4.364z" />
          <path fill="#FAB908" d="M19.818 8.182v7.636h2.909V8.182z" />
        </svg>
      ),
    },
    {
      name: "iHeartRadio",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#C6002B">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 5.4c.91 0 1.753.195 2.527.537a.278.278 0 01.011.505c-.435.207-.752.389-1.082.619a.281.281 0 01-.275.021A4.085 4.085 0 0012 6.744 4.092 4.092 0 007.912 10.8 4.092 4.092 0 0012 14.856a4.092 4.092 0 004.088-4.056.282.282 0 01.167-.259c.371-.175.747-.36 1.118-.577a.278.278 0 01.422.246C17.656 14.01 15.102 16.2 12 16.2c-3.315 0-6-2.685-6-5.4s2.685-5.4 6-5.4zm0 2.4c.527 0 1.028.108 1.486.3a.277.277 0 01.016.507c-.352.174-.632.352-.928.55a.28.28 0 01-.306.01A2.12 2.12 0 0012 9a2.102 2.102 0 00-2.1 2.1c0 1.158.942 2.1 2.1 2.1a2.102 2.102 0 002.1-2.1.281.281 0 01.151-.252c.292-.155.597-.32.9-.518a.278.278 0 01.432.24c-.101 2.148-1.89 3.63-3.583 3.63-1.985 0-3.6-1.615-3.6-3.6s1.615-3.6 3.6-3.6zm-.012 3a.612.612 0 110 1.224.612.612 0 010-1.224zM12 18.6c-1.635 0-1.635 2.4 0 2.4s1.635-2.4 0-2.4z" />
        </svg>
      ),
    },
    {
      name: "Overcast",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#FC7E0F">
          <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-.4-4.8l.4-4.8.4 4.8h1.2l.4-6.4-.4-2.8h-3.2l-.4 2.8.4 6.4h1.2zM12 6a1.2 1.2 0 100-2.4A1.2 1.2 0 0012 6zm-5.6 9.688l.816-1.072a6.397 6.397 0 01-1.616-4.2c0-3.536 2.868-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 1.62-.604 3.1-1.6 4.228l.816 1.044A7.97 7.97 0 0019.6 10.4c0-4.412-3.588-8-8-8s-8 3.588-8 8a7.97 7.97 0 002 5.288zm1.656-1.276l.812-1.072A3.99 3.99 0 017.6 10.4c0-2.428 1.972-4.4 4.4-4.4s4.4 1.972 4.4 4.4a3.99 3.99 0 01-1.268 2.94l.812 1.072A5.57 5.57 0 0018 10.4c0-3.088-2.512-5.6-5.6-5.6S6.8 7.312 6.8 10.4c0 1.596.532 3.064 1.456 4.012z" />
        </svg>
      ),
    },
    {
      name: "Pocket Casts",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#F43E37">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 3.6c4.636 0 8.4 3.764 8.4 8.4h-2.4c0-3.312-2.688-6-6-6s-6 2.688-6 6 2.688 6 6 6v2.4c-4.636 0-8.4-3.764-8.4-8.4 0-4.636 3.764-8.4 8.4-8.4zm0 4.8a3.6 3.6 0 110 7.2 3.6 3.6 0 010-7.2z" />
        </svg>
      ),
    },
    {
      name: "Podcast Addict",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#F4842D">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 1.2c-4.636 0-8.4 3.764-8.4 8.4s3.764 8.4 8.4 8.4 8.4-3.764 8.4-8.4-3.764-8.4-8.4-8.4zm0 2.4a6 6 0 110 12 6 6 0 010-12zm-2 3a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm-4.5 3.5s1 2 2.5 2 2.5-2 2.5-2" />
        </svg>
      ),
    },
    {
      name: "Castbox",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#F55B23">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.2 4.8h2.4v2.4h-2.4V4.8zM8.4 6h2.4v1.2H8.4V6zm4.8 0h2.4v1.2h-2.4V6zM6 7.2h2.4v1.2H6V7.2zm9.6 0h2.4v1.2h-2.4V7.2zM12 8.4a4.8 4.8 0 00-4.8 4.8c0 2.136 1.404 3.948 3.336 4.56V21h2.928v-3.24A4.806 4.806 0 0016.8 13.2a4.8 4.8 0 00-4.8-4.8z" />
        </svg>
      ),
    },
    {
      name: "Pandora",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#3668FF">
          <path d="M12.004 0H2.17v24h5.794v-8.326h4.04c4.878 0 9.826-2.834 9.826-7.837S16.883 0 12.004 0zm-.16 11.46H7.964V4.214h3.88c2.66 0 4.522 1.44 4.522 3.623 0 2.184-1.862 3.623-4.523 3.623z" />
        </svg>
      ),
    },
    {
      name: "Podcast Index",
      logo: (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#F90000">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 3a6 6 0 100 12 6 6 0 000-12zm0 2.4a3.6 3.6 0 110 7.2 3.6 3.6 0 010-7.2zm0 1.2a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={reveal.ref}
          initial="hidden"
          animate={reveal.inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div
            variants={scaleIn}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-semibold mb-6"
          >
            <Globe className="h-4 w-4" />
            One-Click Distribution
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-extrabold mb-4"
          >
            Get Listed On Every&nbsp;
            <span className="text-orange-500">Major Platform</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-400 text-xl max-w-2xl mx-auto"
          >
            Submit your RSS feed once. PodcastFlow keeps every directory updated
            automatically — so you're always where your listeners are.
          </motion.p>
        </motion.div>

        {/* Platform grid — staggered pop-in */}
        <motion.div
          initial="hidden"
          animate={reveal.inView ? "visible" : "hidden"}
          variants={staggerFast}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {platforms.map(({ name, logo }, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              custom={i}
              whileHover={{ y: -6, scale: 1.05, transition: { duration: 0.2 } }}
              className="bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-orange-500/30 transition-colors group"
            >
              <motion.div
                whileHover={{ rotate: 12 }}
                transition={{ duration: 0.3 }}
                className="w-14 h-14 rounded-xl flex items-center justify-center"
              >
                {logo}
              </motion.div>
              <span className="text-gray-200 font-semibold text-base text-center">
                {name}
              </span>
              <motion.div
                initial={{ scale: 0 }}
                animate={reveal.inView ? { scale: 1 } : { scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.5 + i * 0.04,
                }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary strip — animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-3xl font-extrabold text-orange-500">
              <AnimatedCounter value="12" suffix="+" />
            </p>
            <p className="text-gray-400 text-sm">Platforms Supported</p>
          </motion.div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-3xl font-extrabold text-orange-500">Instant</p>
            <p className="text-gray-400 text-sm">Feed Updates</p>
          </motion.div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-3xl font-extrabold text-orange-500">
              <AnimatedCounter value="0" />
            </p>
            <p className="text-gray-400 text-sm">Manual Steps Required</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================ */
/*  CTA SECTION                                                      */
/* ================================================================ */
function CTASection() {
  const reveal = useReveal();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f] relative overflow-hidden">
      {/* Background glow — breathing */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full"
      />

      <motion.div
        ref={reveal.ref}
        initial="hidden"
        animate={reveal.inView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="relative max-w-4xl mx-auto text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"
        >
          Uncover Hidden Reach In The
          <br />
          World Of Podcasts
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto"
        >
          Your audience is already listening. Give them another way to consume
          your content — on the go, at the gym, on their commute.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 30px rgba(249,115,22,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl"
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-black rounded-xl hover:bg-orange-400 transition-all font-bold text-lg relative overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <motion.span
                className="relative z-10 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                style={{
                  animation: "shimmer 3s infinite",
                  backgroundSize: "200% 100%",
                }}
              />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.06, borderColor: "rgba(249,115,22,0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl"
          >
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-white rounded-xl hover:border-orange-500/40 hover:bg-white/5 transition-all font-semibold text-lg"
            >
              Explore Features
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================================================================ */
/*  TESTIMONIALS SECTION                                             */
/* ================================================================ */
function TestimonialsSection() {
  const reveal = useReveal();

  const testimonials = [
    {
      quote:
        "PodcastFlow turned my YouTube channel into a full podcast in under 10 minutes. The automation is incredible — I haven't touched a feed manually since.",
      name: "Sarah Mitchell",
      role: "Content Creator",
    },
    {
      quote:
        "We used to spend hours each week converting videos and uploading episodes. Now it's completely hands-free. I'd recommend this to anyone with a YouTube channel.",
      name: "James Park",
      role: "Media Producer",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={reveal.ref}
          initial="hidden"
          animate={reveal.inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-extrabold mb-4"
          >
            What Our Users Have To Say
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={reveal.inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-[#141414] border border-white/5 rounded-2xl p-8"
            >
              {/* Stars — staggered pop-in */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                    animate={
                      reveal.inView ? { opacity: 1, scale: 1, rotate: 0 } : {}
                    }
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      delay: 0.4 + i * 0.15 + j * 0.06,
                    }}
                  >
                    <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                  </motion.div>
                ))}
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-sm"
                >
                  {t.name[0]}
                </motion.div>
                <div>
                  <p className="text-white font-semibold text-base">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
