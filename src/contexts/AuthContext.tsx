import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { type AppRole, getUserRoles, getUserProfile } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  roles: AppRole[];
  activeRole: AppRole;
  setActiveRole: (role: AppRole) => void;
  profile: { display_name: string | null; avatar_url: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>(["operator"]);
  const [activeRole, setActiveRole] = useState<AppRole>("operator");
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (currentUser: User) => {
    try {
      const [fetchedRoles, fetchedProfile] = await Promise.all([
        getUserRoles(currentUser.id),
        getUserProfile(currentUser.id),
      ]);
      setRoles(fetchedRoles);
      setActiveRole(fetchedRoles[0] ?? "operator");
      setProfile(fetchedProfile);
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  useEffect(() => {
    // 1. Check existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for future changes (NOT initial)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip INITIAL_SESSION — already handled above
      if (event === "INITIAL_SESSION") return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Use setTimeout to avoid Supabase deadlock inside callback
        setTimeout(() => {
          loadUserData(currentUser).finally(() => setLoading(false));
        }, 0);
      } else {
        setRoles(["operator"]);
        setActiveRole("operator");
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, roles, activeRole, setActiveRole, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
