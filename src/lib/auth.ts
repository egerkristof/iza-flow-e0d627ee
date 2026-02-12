import { supabase } from "@/integrations/supabase/client";

export type AppRole = "operator" | "architect" | "manager";

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching roles:", error);
    return ["operator"];
  }

  return (data?.map((r) => r.role as AppRole)) ?? ["operator"];
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}
