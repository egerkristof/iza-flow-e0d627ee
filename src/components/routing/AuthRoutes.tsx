import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";

function ProtectedContent({ children, blockedRoles }: { children: React.ReactNode; blockedRoles?: string[] }) {
  const { user, loading, activeRole } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (blockedRoles?.includes(activeRole)) return <Navigate to="/app" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const { user, loading, roles } = useAuth();
  if (loading) return null;
  if (user) {
    const isArchitect = roles.includes("architect");
    return <Navigate to={isArchitect ? "/admin/manage" : "/app"} replace />;
  }
  return <>{children}</>;
}

export function ProtectedRoute({ children, blockedRoles }: { children: React.ReactNode; blockedRoles?: string[] }) {
  return (
    <AuthProvider>
      <ProtectedContent blockedRoles={blockedRoles}>{children}</ProtectedContent>
    </AuthProvider>
  );
}

export function AuthRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  );
}

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}