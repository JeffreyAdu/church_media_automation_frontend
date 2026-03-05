import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./shared/contexts/AuthContext";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import { RedirectAgentDetail } from "./shared/components/RedirectAgentDetail";
import Layout from "./shared/components/Layout";

// Lazy-loaded pages — each gets its own chunk
const LandingPage = lazy(
  () => import("./features/marketing/pages/LandingPage"),
);
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const ConfirmEmail = lazy(() => import("./features/auth/pages/ConfirmEmail"));
const ForgotPassword = lazy(
  () => import("./features/auth/pages/ForgotPassword"),
);
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword"));
const Dashboard = lazy(() => import("./features/agents/pages/Dashboard"));
const AgentsList = lazy(() => import("./features/agents/pages/AgentsList"));
const AgentDetails = lazy(() => import("./features/agents/pages/AgentDetails"));
const CreateAgent = lazy(() => import("./features/agents/pages/CreateAgent"));
const Settings = lazy(() => import("./features/settings/pages/Settings"));
const NotFound = lazy(() => import("./shared/components/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-orange-500/10 blur-[120px]"
        style={{ animation: "loader-glow 3s ease-in-out infinite" }}
      />

      {/* Animated logo + pulse ring */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Pulse ring */}
        <span
          className="absolute w-20 h-20 rounded-full border-2 border-orange-500/30"
          style={{ animation: "loader-ring 1.8s ease-out infinite" }}
        />
        <span
          className="absolute w-20 h-20 rounded-full border-2 border-orange-500/20"
          style={{ animation: "loader-ring 1.8s ease-out infinite 0.6s" }}
        />
        {/* Logo icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ animation: "loader-bounce 1.2s ease-in-out infinite" }}
        >
          <img
            src="/images/favicon-32x32.png"
            alt="PodcastFlow"
            className="w-14 h-14 rounded-xl"
          />
        </div>
      </div>

      {/* Brand name */}
      <p className="text-lg font-bold text-white tracking-tight mb-4">
        Podcast<span className="text-orange-500">Flow</span>
      </p>

      {/* Animated bar loader */}
      <div className="flex items-end gap-[4px] h-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-[4px] rounded-full bg-orange-500"
            style={{
              animation: "loader-bar 1s ease-in-out infinite",
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes loader-glow {
          0%, 100% { opacity: .4; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: .7; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes loader-ring {
          0%   { transform: scale(.8); opacity: .6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes loader-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes loader-bar {
          0%, 100% { height: 6px; opacity: .4; }
          50%      { height: 20px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  // Don't re-trigger transition for sub-routes inside /app
  const routeKey = location.pathname.startsWith("/app")
    ? "/app"
    : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Redirect old routes to new /app routes */}
            <Route
              path="/dashboard"
              element={<Navigate to="/app/dashboard" replace />}
            />
            <Route
              path="/agents"
              element={<Navigate to="/app/agents" replace />}
            />
            <Route path="/agents/:id" element={<RedirectAgentDetail />} />
            <Route
              path="/settings"
              element={<Navigate to="/app/settings" replace />}
            />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agents" element={<AgentsList />} />
              <Route path="agents/new" element={<CreateAgent />} />
              <Route path="agents/:id" element={<AgentDetails />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
