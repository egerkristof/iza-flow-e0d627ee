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
          capture_status: string
          category: Database["public"]["Enums"]["context_category"]
          content_full: string
          content_hash: string | null
          created_at: string
          domain_scope: Json | null
          enforcement_level:
            | Database["public"]["Enums"]["mandate_enforcement"]
            | null
          expiry_date: string | null
          id: string
          is_mandate: boolean
          last_used_at: string | null
          mandate_description: string | null
          mandate_scope: Json | null
          mandate_status: Database["public"]["Enums"]["mandate_status"] | null
          operation_mode: Json | null
          owner_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          published_at: string | null
          published_by: string | null
          security_level: Database["public"]["Enums"]["security_scope"]
          source_chat_id: string | null
          source_workbook_id: string | null
          superseded_by: string | null
          target_reference_id: string | null
          title: string
          trigger_intent: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          action_type?: Database["public"]["Enums"]["action_logic"]
          bundle_id?: string | null
          capture_status?: string
          category?: Database["public"]["Enums"]["context_category"]
          content_full: string
          content_hash?: string | null
          created_at?: string
          domain_scope?: Json | null
          enforcement_level?:
            | Database["public"]["Enums"]["mandate_enforcement"]
            | null
          expiry_date?: string | null
          id?: string
          is_mandate?: boolean
          last_used_at?: string | null
          mandate_description?: string | null
          mandate_scope?: Json | null
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          operation_mode?: Json | null
          owner_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          published_at?: string | null
          published_by?: string | null
          security_level?: Database["public"]["Enums"]["security_scope"]
          source_chat_id?: string | null
          source_workbook_id?: string | null
          superseded_by?: string | null
          target_reference_id?: string | null
          title: string
          trigger_intent?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_logic"]
          bundle_id?: string | null
          capture_status?: string
          category?: Database["public"]["Enums"]["context_category"]
          content_full?: string
          content_hash?: string | null
          created_at?: string
          domain_scope?: Json | null
          enforcement_level?:
            | Database["public"]["Enums"]["mandate_enforcement"]
            | null
          expiry_date?: string | null
          id?: string
          is_mandate?: boolean
          last_used_at?: string | null
          mandate_description?: string | null
          mandate_scope?: Json | null
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          operation_mode?: Json | null
          owner_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          published_at?: string | null
          published_by?: string | null
          security_level?: Database["public"]["Enums"]["security_scope"]
          source_chat_id?: string | null
          source_workbook_id?: string | null
          superseded_by?: string | null
          target_reference_id?: string | null
          title?: string
          trigger_intent?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "context_items_source_chat_id_fkey"
            columns: ["source_chat_id"]
            isOneToOne: false
            referencedRelation: "workbook_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "context_items_source_workbook_id_fkey"
            columns: ["source_workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      mandate_acknowledgments: {
        Row: {
          acknowledged_at: string
          acknowledged_by: string
          id: string
          mandate_id: string
          notes: string | null
          status: string
          workbook_id: string
        }
        Insert: {
          acknowledged_at?: string
          acknowledged_by: string
          id?: string
          mandate_id: string
          notes?: string | null
          status?: string
          workbook_id: string
        }
        Update: {
          acknowledged_at?: string
          acknowledged_by?: string
          id?: string
          mandate_id?: string
          notes?: string | null
          status?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mandate_acknowledgments_mandate_id_fkey"
            columns: ["mandate_id"]
            isOneToOne: false
            referencedRelation: "context_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mandate_acknowledgments_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
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
      workbook_agent_config: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          max_tokens: number | null
          model_id: string
          notes: string | null
          temperature: number | null
          updated_at: string
          workbook_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          max_tokens?: number | null
          model_id: string
          notes?: string | null
          temperature?: number | null
          updated_at?: string
          workbook_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          max_tokens?: number | null
          model_id?: string
          notes?: string | null
          temperature?: number | null
          updated_at?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_agent_config_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      workbook_chat_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "workbook_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      workbook_chat_participants: {
        Row: {
          chat_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "workbook_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      workbook_chats: {
        Row: {
          chat_type: string
          created_at: string
          created_by: string
          id: string
          title: string | null
          updated_at: string
          workbook_id: string
        }
        Insert: {
          chat_type?: string
          created_at?: string
          created_by: string
          id?: string
          title?: string | null
          updated_at?: string
          workbook_id: string
        }
        Update: {
          chat_type?: string
          created_at?: string
          created_by?: string
          id?: string
          title?: string | null
          updated_at?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_chats_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      workbook_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          user_id: string
          workbook_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          user_id: string
          workbook_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_members_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      workbook_resources: {
        Row: {
          content: string | null
          created_at: string
          created_by: string
          file_name: string | null
          file_path: string | null
          file_type: string | null
          id: string
          metadata: Json | null
          resource_type: string
          title: string
          updated_at: string
          workbook_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by: string
          file_name?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          resource_type?: string
          title: string
          updated_at?: string
          workbook_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string
          file_name?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          resource_type?: string
          title?: string
          updated_at?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_resources_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      workbook_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          context_config: Json
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          parent_task_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          sort_order: number
          source_protocol_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          workbook_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          context_config?: Json
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          sort_order?: number
          source_protocol_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          workbook_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          context_config?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          sort_order?: number
          source_protocol_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "workbook_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workbook_tasks_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
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
      generate_content_hash: {
        Args: { p_content: string; p_title: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_chat_participant: {
        Args: { _chat_id: string; _user_id: string }
        Returns: boolean
      }
      is_workbook_member: {
        Args: { _user_id: string; _workbook_id: string }
        Returns: boolean
      }
      is_workbook_owner: {
        Args: { _user_id: string; _workbook_id: string }
        Returns: boolean
      }
      user_accessible_workbook_ids: {
        Args: { _user_id: string }
        Returns: string[]
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
        | "RESEARCH"
        | "PRINCIPLE"
      mandate_enforcement: "advisory" | "required_ack" | "blocking"
      mandate_status:
        | "draft"
        | "published"
        | "active"
        | "superseded"
        | "revoked"
      priority_level: "STANDARD" | "CRITICAL"
      security_scope: "INTERNAL" | "CONFIDENTIAL" | "ADMIN_ONLY"
      task_priority: "low" | "medium" | "high" | "critical"
      task_status: "todo" | "in_progress" | "blocked" | "done" | "cancelled"
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
        "RESEARCH",
        "PRINCIPLE",
      ],
      mandate_enforcement: ["advisory", "required_ack", "blocking"],
      mandate_status: ["draft", "published", "active", "superseded", "revoked"],
      priority_level: ["STANDARD", "CRITICAL"],
      security_scope: ["INTERNAL", "CONFIDENTIAL", "ADMIN_ONLY"],
      task_priority: ["low", "medium", "high", "critical"],
      task_status: ["todo", "in_progress", "blocked", "done", "cancelled"],
      workbook_status: ["draft", "active", "review", "completed", "archived"],
    },
  },
} as const
