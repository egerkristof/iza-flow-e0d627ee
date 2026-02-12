import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import WorkbooksPage from "./pages/Workbooks";
import WorkbookDetailPage from "./pages/WorkbookDetail";
import ContextManagementPage from "./pages/ContextManagement";
import OversightPage from "./pages/Oversight";
import MyKnowledgePage from "./pages/MyKnowledge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/workbooks" element={<ProtectedRoute><WorkbooksPage /></ProtectedRoute>} />
            <Route path="/workbooks/:id" element={<ProtectedRoute><WorkbookDetailPage /></ProtectedRoute>} />
            <Route path="/context" element={<ProtectedRoute><ContextManagementPage /></ProtectedRoute>} />
            <Route path="/oversight" element={<ProtectedRoute><OversightPage /></ProtectedRoute>} />
            <Route path="/my-knowledge" element={<ProtectedRoute><MyKnowledgePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
