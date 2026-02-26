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
import AdminPromptsPage from "./pages/AdminPrompts";
import ResearchTemplatesPage from "./pages/ResearchTemplates";
import ResourceEditorPage from "./pages/ResourceEditor";
import NotFound from "./pages/NotFound";
import PitchDeck from "./pages/PitchDeck";
import InvestorDeck from "./pages/InvestorDeck";
import ConsultingDeck from "./pages/ConsultingDeck";
import HomePage from "./pages/marketing/Home";
import ManifestoPage from "./pages/marketing/Manifesto";
import ProfessionalServicesPage from "./pages/marketing/ProfessionalServices";
import UseCasesPage from "./pages/marketing/UseCases";
import ProductPage from "./pages/marketing/Product";
import EnterpriseDeck from "./pages/EnterpriseDeck";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

function ProtectedRoute({ children, blockedRoles }: { children: React.ReactNode; blockedRoles?: string[] }) {
  const { user, loading, activeRole } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (blockedRoles?.includes(activeRole)) return <Navigate to="/app" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light">
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />

            {/* Marketing — product-led homepage */}
            <Route path="/" element={<HomePage />} />
            <Route path="/codify" element={<ProfessionalServicesPage />} />
            <Route path="/scale" element={<EnterpriseDeck />} />
            <Route path="/product" element={<Navigate to="/" replace />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/manifesto" element={<ManifestoPage />} />

            {/* Legacy redirects */}
            <Route path="/liza" element={<Navigate to="/" replace />} />
            <Route path="/for-professional-services" element={<Navigate to="/codify" replace />} />
            <Route path="/platform" element={<Navigate to="/product" replace />} />
            <Route path="/advisory" element={<Navigate to="/codify" replace />} />
            <Route path="/enterprise" element={<Navigate to="/scale" replace />} />
            <Route path="/consulting" element={<Navigate to="/sales" replace />} />

            {/* Decks */}
            <Route path="/pitch" element={<PitchDeck />} />
            <Route path="/investor" element={<InvestorDeck />} />
            <Route path="/sales" element={<ConsultingDeck />} />

            {/* App */}
            <Route path="/app" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/workbooks" element={<ProtectedRoute><WorkbooksPage /></ProtectedRoute>} />
            <Route path="/workbooks/:id" element={<ProtectedRoute><WorkbookDetailPage /></ProtectedRoute>} />
            <Route path="/workbooks/:workbookId/resources/:resourceId" element={<ProtectedRoute><ResourceEditorPage /></ProtectedRoute>} />
            <Route path="/context" element={<ProtectedRoute blockedRoles={["operator"]}><ContextManagementPage /></ProtectedRoute>} />
            <Route path="/oversight" element={<ProtectedRoute><OversightPage /></ProtectedRoute>} />
            <Route path="/my-knowledge" element={<ProtectedRoute><MyKnowledgePage /></ProtectedRoute>} />
            <Route path="/admin/prompts" element={<ProtectedRoute blockedRoles={["operator"]}><AdminPromptsPage /></ProtectedRoute>} />
            <Route path="/research-templates" element={<ProtectedRoute blockedRoles={["operator"]}><ResearchTemplatesPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
