import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { presentationRoutes } from "@/data/presentationRegistry";
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
import AdminTrials from "./pages/AdminTrials";
import AdminPage from "./pages/Admin";
import SecurityAuditPage from "./pages/marketing/SecurityAuditSolution";
import HomePage from "./pages/marketing/Home";
import ManifestoPage from "./pages/marketing/Manifesto";
import UseCasesPage from "./pages/marketing/UseCases";
import IndustriesPage from "./pages/marketing/Industries";
import IndustryPharmaPage from "./pages/marketing/IndustryPharma";
import IndustrySpacePage from "./pages/marketing/IndustrySpace";
import IndustrySatcomPage from "./pages/marketing/IndustrySatcom";
import IndustryAECPage from "./pages/marketing/IndustryAEC";
import IndustrySpaceDefensePage from "./pages/marketing/IndustrySpaceDefense";
import IndustryBankingPage from "./pages/marketing/IndustryBanking";
import IndustryAutomotivePage from "./pages/marketing/IndustryAutomotive";
import IndustryProfessionalServicesPage from "./pages/marketing/IndustryProfessionalServices";
import IndustrySalesPage from "./pages/marketing/IndustrySales";
import IndustryGTMPage from "./pages/marketing/IndustryGTM";
import IndustryMarketingPage from "./pages/marketing/IndustryMarketing";
import IndustryBizDevPage from "./pages/marketing/IndustryBizDev";
import IndustryAccountMgmtPage from "./pages/marketing/IndustryAccountMgmt";
import IndustryOnboardingPage from "./pages/marketing/IndustryOnboarding";
import IndustryMeetingsPage from "./pages/marketing/IndustryMeetings";
import IndustryStrategyOfficePage from "./pages/marketing/IndustryStrategyOffice";
import ProductPage from "./pages/marketing/Product";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";
import BetaPage from "./pages/marketing/Beta";
import PlatformSignupPage from "./pages/marketing/PlatformSignup";
import DiagnosticPage from "./pages/marketing/Diagnostic";
import PrivacyPage from "./pages/marketing/Privacy";
import TermsPage from "./pages/marketing/Terms";
import CalculatorPage from "./pages/marketing/Calculator";
import AuditLandingPage from "./pages/marketing/AuditLanding";
import OSPage from "./pages/marketing/OS";
import ByFunctionPage from "./pages/marketing/ByFunction";
import ForPersonaPage from "./pages/marketing/ForPersona";
import TheBriefPage from "./pages/TheBrief";
import FramedChatPage from "./pages/FramedChat";
import ConditionsPage from "./pages/Conditions";
import SanctionedPage from "./pages/Sanctioned";
import PlaybookBuilderPage from "./pages/PlaybookBuilder";
import MockRibbonPage from "./pages/marketing/MockRibbon";
import MockLayerPage from "./pages/marketing/MockLayer";

const queryClient = new QueryClient();

function ProtectedRoute({ children, blockedRoles }: { children: React.ReactNode; blockedRoles?: string[] }) {
  const { user, loading, activeRole } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (blockedRoles?.includes(activeRole)) return <Navigate to="/app" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, roles } = useAuth();
  if (loading) return null;
  if (user) {
    const isArchitect = roles.includes("architect");
    return <Navigate to={isArchitect ? "/admin/manage" : "/app"} replace />;
  }
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

            {/* Marketing - product-led homepage */}
            <Route path="/" element={<HomePage />} />
            <Route path="/os" element={<OSPage />} />
            <Route path="/home-archive" element={<Navigate to="/" replace />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/by-function" element={<ByFunctionPage />} />
            <Route path="/for/:slug" element={<ForPersonaPage />} />
            <Route path="/industries/regulated" element={<IndustryPharmaPage />} />
            <Route path="/industries/pharma" element={<Navigate to="/industries/regulated" replace />} />
            <Route path="/industries/space" element={<IndustrySpacePage />} />
            <Route path="/industries/space-defense" element={<IndustrySpaceDefensePage />} />
            <Route path="/industries/satcom" element={<IndustrySatcomPage />} />
            <Route path="/industries/aec" element={<IndustryAECPage />} />
            <Route path="/industries/banking" element={<IndustryBankingPage />} />
            <Route path="/industries/automotive" element={<IndustryAutomotivePage />} />
            <Route path="/industries/professional-services" element={<IndustryProfessionalServicesPage />} />
            <Route path="/industries/sales" element={<IndustrySalesPage />} />
            <Route path="/industries/gtm" element={<IndustryGTMPage />} />
            <Route path="/industries/marketing" element={<IndustryMarketingPage />} />
            <Route path="/industries/business-development" element={<IndustryBizDevPage />} />
            <Route path="/industries/account-management" element={<IndustryAccountMgmtPage />} />
            <Route path="/industries/onboarding" element={<IndustryOnboardingPage />} />
            <Route path="/industries/meetings" element={<IndustryMeetingsPage />} />
            <Route path="/industries/strategy-office" element={<IndustryStrategyOfficePage />} />
            <Route path="/manifesto" element={<ManifestoPage />} />
            <Route path="/beta" element={<BetaPage />} />
            <Route path="/platform-signup" element={<PlatformSignupPage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/audit" element={<AuditLandingPage />} />
            <Route path="/the-brief" element={<TheBriefPage />} />
            <Route path="/the-brief/:id" element={<TheBriefPage />} />
            <Route path="/framed-chat" element={<FramedChatPage />} />
            <Route path="/framed-chat/:chatId" element={<FramedChatPage />} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/sanctioned" element={<SanctionedPage />} />
            <Route path="/playbook-builder" element={<PlaybookBuilderPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/mock/ribbon" element={<MockRibbonPage />} />
            <Route path="/mock/layer" element={<MockLayerPage />} />

            {/* Standalone admin panel */}
            <Route path="/admin/manage" element={<AdminPage />} />
            <Route path="/admin/insights" element={<Navigate to="/admin/manage" replace />} />

            {/* Retired pages - redirect to home */}
            <Route path="/extract" element={<Navigate to="/" replace />} />
            <Route path="/extract/test" element={<Navigate to="/" replace />} />
            <Route path="/solutions/audit" element={<SecurityAuditPage />} />
            <Route path="/sprint" element={<Navigate to="/" replace />} />

            {/* Legacy redirects - all flatten to single hops */}
            <Route path="/codify" element={<Navigate to="/" replace />} />
            <Route path="/scale" element={<Navigate to="/" replace />} />
            <Route path="/product" element={<Navigate to="/" replace />} />
            <Route path="/liza" element={<Navigate to="/" replace />} />
            <Route path="/for-professional-services" element={<Navigate to="/" replace />} />
            <Route path="/platform" element={<Navigate to="/" replace />} />
            <Route path="/advisory" element={<Navigate to="/" replace />} />
            <Route path="/enterprise" element={<Navigate to="/" replace />} />
            <Route path="/consulting" element={<Navigate to="/sales" replace />} />
            <Route path="/pharma" element={<Navigate to="/pharma-pitch" replace />} />
            <Route path="/pharma-audit" element={<Navigate to="/pharma-pitch" replace />} />
            <Route path="/investor-lifecycle" element={<Navigate to="/investor" replace />} />
            <Route path="/investor-v2" element={<Navigate to="/investor" replace />} />
            <Route path="/seed-investor" element={<Navigate to="/investor" replace />} />
            <Route path="/pitch" element={<Navigate to="/sales" replace />} />
            <Route path="/investor-remred" element={<Navigate to="/space" replace />} />
            <Route path="/sales-ai-adoption" element={<Navigate to="/getstarted" replace />} />

            {/* Decks */}
            {presentationRoutes.map((presentation) => {
              const Component = presentation.component;
              return <Route key={presentation.id} path={presentation.path} element={<Component />} />;
            })}

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
            <Route path="/admin/trials" element={<ProtectedRoute blockedRoles={["operator", "manager"]}><AdminTrials /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;

