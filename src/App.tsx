import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/contexts/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { RedirectAgentDetail } from './shared/components/RedirectAgentDetail';
import Layout from './shared/components/Layout';
import Dashboard from './features/dashboard/pages/Dashboard';
import AgentsList from './features/agents/pages/AgentsList';
import AgentDetails from './features/agents/pages/AgentDetails';
import CreateAgent from './features/agents/pages/CreateAgent';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Settings from './features/settings/pages/Settings';
import LandingPage from './features/marketing/pages/LandingPage';

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Redirect old routes to new /app routes */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/agents" element={<Navigate to="/app/agents" replace />} />
            <Route path="/agents/:id" element={<RedirectAgentDetail />} />
            <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
            
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
