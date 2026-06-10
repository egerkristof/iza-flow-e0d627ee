import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { presentationRoutes } from "@/data/presentationRegistry";
import HomePage from "./pages/marketing/Home";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/Auth"));
const WorkbooksPage = lazy(() => import("./pages/Workbooks"));
const WorkbookDetailPage = lazy(() => import("./pages/WorkbookDetail"));
const ContextManagementPage = lazy(() => import("./pages/ContextManagement"));
const OversightPage = lazy(() => import("./pages/Oversight"));
const MyKnowledgePage = lazy(() => import("./pages/MyKnowledge"));
const AdminPromptsPage = lazy(() => import("./pages/AdminPrompts"));
const ResearchTemplatesPage = lazy(() => import("./pages/ResearchTemplates"));
const ResourceEditorPage = lazy(() => import("./pages/ResourceEditor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminTrials = lazy(() => import("./pages/AdminTrials"));
const AdminPage = lazy(() => import("./pages/Admin"));
const SecurityAuditPage = lazy(() => import("./pages/marketing/SecurityAuditSolution"));
const ManifestoPage = lazy(() => import("./pages/marketing/Manifesto"));
const UseCasesPage = lazy(() => import("./pages/marketing/UseCases"));
const IndustriesPage = lazy(() => import("./pages/marketing/Industries"));
const IndustryPharmaPage = lazy(() => import("./pages/marketing/IndustryPharma"));
const IndustrySpacePage = lazy(() => import("./pages/marketing/IndustrySpace"));
const IndustrySatcomPage = lazy(() => import("./pages/marketing/IndustrySatcom"));
const IndustryAECPage = lazy(() => import("./pages/marketing/IndustryAEC"));
const IndustrySpaceDefensePage = lazy(() => import("./pages/marketing/IndustrySpaceDefense"));
const IndustryBankingPage = lazy(() => import("./pages/marketing/IndustryBanking"));
const IndustryAutomotivePage = lazy(() => import("./pages/marketing/IndustryAutomotive"));
const IndustryProfessionalServicesPage = lazy(() => import("./pages/marketing/IndustryProfessionalServices"));
const IndustrySalesPage = lazy(() => import("./pages/marketing/IndustrySales"));
const IndustryGTMPage = lazy(() => import("./pages/marketing/IndustryGTM"));
const IndustryMarketingPage = lazy(() => import("./pages/marketing/IndustryMarketing"));
const IndustryBizDevPage = lazy(() => import("./pages/marketing/IndustryBizDev"));
const IndustryAccountMgmtPage = lazy(() => import("./pages/marketing/IndustryAccountMgmt"));
const IndustryOnboardingPage = lazy(() => import("./pages/marketing/IndustryOnboarding"));
const IndustryMeetingsPage = lazy(() => import("./pages/marketing/IndustryMeetings"));
const IndustryStrategyOfficePage = lazy(() => import("./pages/marketing/IndustryStrategyOffice"));
const BetaPage = lazy(() => import("./pages/marketing/Beta"));
const PlatformSignupPage = lazy(() => import("./pages/marketing/PlatformSignup"));
const DiagnosticPage = lazy(() => import("./pages/marketing/Diagnostic"));
const PrivacyPage = lazy(() => import("./pages/marketing/Privacy"));
const TermsPage = lazy(() => import("./pages/marketing/Terms"));
const CalculatorPage = lazy(() => import("./pages/marketing/Calculator"));
const AuditLandingPage = lazy(() => import("./pages/marketing/AuditLanding"));
const OSPage = lazy(() => import("./pages/marketing/OS"));
const ByFunctionPage = lazy(() => import("./pages/marketing/ByFunction"));
const ForPersonaPage = lazy(() => import("./pages/marketing/ForPersona"));
const TheBriefPage = lazy(() => import("./pages/TheBrief"));
const FramedChatPage = lazy(() => import("./pages/FramedChat"));
const ConditionsPage = lazy(() => import("./pages/Conditions"));
const SanctionedPage = lazy(() => import("./pages/Sanctioned"));
const PlaybookBuilderPage = lazy(() => import("./pages/PlaybookBuilder"));
const MockRibbonPage = lazy(() => import("./pages/marketing/MockRibbon"));
const MockLayerPage = lazy(() => import("./pages/marketing/MockLayer"));

function RouteLoader() {
  return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
}

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
          <Suspense fallback={<RouteLoader />}>
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
              return (
                <Route
                  key={presentation.id}
                  path={presentation.path}
                  element={
                    <Suspense fallback={<RouteLoader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;

