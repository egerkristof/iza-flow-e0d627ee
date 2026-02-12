export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bundles: {
        Row: {
          created_at: string
          description: string | null
          health_score: number | null
          id: string
          owner_id: string
          scope_level: string
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          health_score?: number | null
          id?: string
          owner_id: string
          scope_level?: string
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          health_score?: number | null
          id?: string
          owner_id?: string
          scope_level?: string
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      context_items: {
        Row: {
          action_type: Database["public"]["Enums"]["action_logic"]
          bundle_id: string | null
          category: Database["public"]["Enums"]["context_category"]
          content_full: string
          created_at: string
          domain_scope: Json | null
          expiry_date: string | null
          id: string
          last_used_at: string | null
          operation_mode: Json | null
          owner_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          security_level: Database["public"]["Enums"]["security_scope"]
          target_reference_id: string | null
          title: string
          trigger_intent: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          action_type?: Database["public"]["Enums"]["action_logic"]
          bundle_id?: string | null
          category?: Database["public"]["Enums"]["context_category"]
          content_full: string
          created_at?: string
          domain_scope?: Json | null
          expiry_date?: string | null
          id?: string
          last_used_at?: string | null
          operation_mode?: Json | null
          owner_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          security_level?: Database["public"]["Enums"]["security_scope"]
          target_reference_id?: string | null
          title: string
          trigger_intent?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_logic"]
          bundle_id?: string | null
          category?: Database["public"]["Enums"]["context_category"]
          content_full?: string
          created_at?: string
          domain_scope?: Json | null
          expiry_date?: string | null
          id?: string
          last_used_at?: string | null
          operation_mode?: Json | null
          owner_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          security_level?: Database["public"]["Enums"]["security_scope"]
          target_reference_id?: string | null
          title?: string
          trigger_intent?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      personal_documents: {
        Row: {
          created_at: string
          description: string | null
          document_category: string
          file_name: string
          file_path: string
          file_type: string
          id: string
          parsed_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_category?: string
          file_name: string
          file_path: string
          file_type: string
          id?: string
          parsed_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_category?: string
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          parsed_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      personal_goals: {
        Row: {
          created_at: string
          current_value: string | null
          description: string | null
          due_date: string | null
          goal_type: string
          id: string
          status: string
          target_value: string | null
          title: string
          unit: string | null
          updated_at: string
          user_id: string
          workbook_id: string | null
        }
        Insert: {
          created_at?: string
          current_value?: string | null
          description?: string | null
          due_date?: string | null
          goal_type?: string
          id?: string
          status?: string
          target_value?: string | null
          title: string
          unit?: string | null
          updated_at?: string
          user_id: string
          workbook_id?: string | null
        }
        Update: {
          created_at?: string
          current_value?: string | null
          description?: string | null
          due_date?: string | null
          goal_type?: string
          id?: string
          status?: string
          target_value?: string | null
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
          workbook_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workbooks: {
        Row: {
          created_at: string
          current_step: string | null
          description: string | null
          drift_score: number | null
          id: string
          locked_playbook_id: string | null
          owner_id: string
          status: Database["public"]["Enums"]["workbook_status"]
          strategic_outcome: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: string | null
          description?: string | null
          drift_score?: number | null
          id?: string
          locked_playbook_id?: string | null
          owner_id: string
          status?: Database["public"]["Enums"]["workbook_status"]
          strategic_outcome?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: string | null
          description?: string | null
          drift_score?: number | null
          id?: string
          locked_playbook_id?: string | null
          owner_id?: string
          status?: Database["public"]["Enums"]["workbook_status"]
          strategic_outcome?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      working_preferences: {
        Row: {
          bound_playbook_ids: string[] | null
          condition_label: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          preference_key: string
          preference_value: string
          scope_id: string | null
          scope_type: string
          trigger_intents: string[] | null
          trigger_keywords: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bound_playbook_ids?: string[] | null
          condition_label?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          preference_key: string
          preference_value: string
          scope_id?: string | null
          scope_type?: string
          trigger_intents?: string[] | null
          trigger_keywords?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bound_playbook_ids?: string[] | null
          condition_label?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          preference_key?: string
          preference_value?: string
          scope_id?: string | null
          scope_type?: string
          trigger_intents?: string[] | null
          trigger_keywords?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      action_logic: "APPEND" | "OVERRIDE" | "BLOCK"
      app_role: "operator" | "architect" | "manager"
      context_category:
        | "DIRECTIVE"
        | "KNOWLEDGE"
        | "PROCEDURE"
        | "PLAYBOOK"
        | "PREFERENCE"
      priority_level: "STANDARD" | "CRITICAL"
      security_scope: "INTERNAL" | "CONFIDENTIAL" | "ADMIN_ONLY"
      workbook_status: "draft" | "active" | "review" | "completed" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_logic: ["APPEND", "OVERRIDE", "BLOCK"],
      app_role: ["operator", "architect", "manager"],
      context_category: [
        "DIRECTIVE",
        "KNOWLEDGE",
        "PROCEDURE",
        "PLAYBOOK",
        "PREFERENCE",
      ],
      priority_level: ["STANDARD", "CRITICAL"],
      security_scope: ["INTERNAL", "CONFIDENTIAL", "ADMIN_ONLY"],
      workbook_status: ["draft", "active", "review", "completed", "archived"],
    },
  },
} as const
