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
      ai_prompt_versions: {
        Row: {
          change_note: string | null
          changed_by: string | null
          content: string
          created_at: string
          id: string
          prompt_id: string
          version: number
        }
        Insert: {
          change_note?: string | null
          changed_by?: string | null
          content: string
          created_at?: string
          id?: string
          prompt_id: string
          version: number
        }
        Update: {
          change_note?: string | null
          changed_by?: string | null
          content?: string
          created_at?: string
          id?: string
          prompt_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "ai_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompts: {
        Row: {
          content: string
          created_at: string
          description: string | null
          function_name: string
          id: string
          is_active: boolean
          label: string
          model: string | null
          prompt_type: string
          slug: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          function_name: string
          id?: string
          is_active?: boolean
          label: string
          model?: string | null
          prompt_type?: string
          slug: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          function_name?: string
          id?: string
          is_active?: boolean
          label?: string
          model?: string | null
          prompt_type?: string
          slug?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      beta_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          role_description: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role_description?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role_description?: string | null
        }
        Relationships: []
      }
      briefs: {
        Row: {
          created_at: string
          email: string | null
          id: string
          inputs: Json
          output: Json
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          inputs: Json
          output: Json
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          inputs?: Json
          output?: Json
        }
        Relationships: []
      }
      bundle_domains: {
        Row: {
          bundle_id: string
          created_at: string
          domain_id: string
          id: string
        }
        Insert: {
          bundle_id: string
          created_at?: string
          domain_id: string
          id?: string
        }
        Update: {
          bundle_id?: string
          created_at?: string
          domain_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_domains_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_domains_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
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
      calculator_sessions: {
        Row: {
          company: string | null
          created_at: string
          department: string
          email: string | null
          email_captured_at: string | null
          hourly_cost: number
          id: string
          name: string | null
          recoverable: number
          referrer: string | null
          rework_annual: number
          session_id: string
          team_size: number
          total_gap: number
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          department: string
          email?: string | null
          email_captured_at?: string | null
          hourly_cost: number
          id?: string
          name?: string | null
          recoverable: number
          referrer?: string | null
          rework_annual: number
          session_id: string
          team_size: number
          total_gap: number
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          department?: string
          email?: string | null
          email_captured_at?: string | null
          hourly_cost?: number
          id?: string
          name?: string | null
          recoverable?: number
          referrer?: string | null
          rework_annual?: number
          session_id?: string
          team_size?: number
          total_gap?: number
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      context_item_bundles: {
        Row: {
          bundle_id: string
          context_item_id: string
          created_at: string
          id: string
          parent_playbook_id: string | null
          sort_order: number
        }
        Insert: {
          bundle_id: string
          context_item_id: string
          created_at?: string
          id?: string
          parent_playbook_id?: string | null
          sort_order?: number
        }
        Update: {
          bundle_id?: string
          context_item_id?: string
          created_at?: string
          id?: string
          parent_playbook_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "context_item_bundles_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "context_item_bundles_context_item_id_fkey"
            columns: ["context_item_id"]
            isOneToOne: false
            referencedRelation: "context_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "context_item_bundles_parent_playbook_id_fkey"
            columns: ["parent_playbook_id"]
            isOneToOne: false
            referencedRelation: "context_items"
            referencedColumns: ["id"]
          },
        ]
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
          deleted_at: string | null
          domain_scope: Json | null
          enforcement_level:
            | Database["public"]["Enums"]["mandate_enforcement"]
            | null
          expiry_date: string | null
          extraction_version: number | null
          id: string
          is_mandate: boolean
          last_used_at: string | null
          mandate_description: string | null
          mandate_scope: Json | null
          mandate_status: Database["public"]["Enums"]["mandate_status"] | null
          operation_mode: Json | null
          output_description: string | null
          output_type: string | null
          owner_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          published_at: string | null
          published_by: string | null
          security_level: Database["public"]["Enums"]["security_scope"]
          source_chat_id: string | null
          source_knowledge_id: string | null
          source_metadata: Json | null
          source_section_ref: string | null
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
          deleted_at?: string | null
          domain_scope?: Json | null
          enforcement_level?:
            | Database["public"]["Enums"]["mandate_enforcement"]
            | null
          expiry_date?: string | null
          extraction_version?: number | null
          id?: string
          is_mandate?: boolean
          last_used_at?: string | null
          mandate_description?: string | null
          mandate_scope?: Json | null
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          operation_mode?: Json | null
          output_description?: string | null
          output_type?: string | null
          owner_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          published_at?: string | null
          published_by?: string | null
          security_level?: Database["public"]["Enums"]["security_scope"]
          source_chat_id?: string | null
          source_knowledge_id?: string | null
          source_metadata?: Json | null
          source_section_ref?: string | null
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
          deleted_at?: string | null
          domain_scope?: Json | null
          enforcement_level?:
            | Database["public"]["Enums"]["mandate_enforcement"]
            | null
          expiry_date?: string | null
          extraction_version?: number | null
          id?: string
          is_mandate?: boolean
          last_used_at?: string | null
          mandate_description?: string | null
          mandate_scope?: Json | null
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          operation_mode?: Json | null
          output_description?: string | null
          output_type?: string | null
          owner_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          published_at?: string | null
          published_by?: string | null
          security_level?: Database["public"]["Enums"]["security_scope"]
          source_chat_id?: string | null
          source_knowledge_id?: string | null
          source_metadata?: Json | null
          source_section_ref?: string | null
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
            foreignKeyName: "context_items_source_knowledge_id_fkey"
            columns: ["source_knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
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
      copilot_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      copilot_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "copilot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "copilot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_results: {
        Row: {
          answers: Json
          archetype: string
          company_name: string | null
          created_at: string
          email: string | null
          email_action_plan: Json | null
          id: string
          industry: string | null
          industry_refined: string | null
          overall_score: number
          respondent_role: string | null
          role_tier: string | null
          scores: Json
          session_id: string | null
          team_leader_email: string | null
          team_size: string | null
        }
        Insert: {
          answers?: Json
          archetype: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          email_action_plan?: Json | null
          id?: string
          industry?: string | null
          industry_refined?: string | null
          overall_score: number
          respondent_role?: string | null
          role_tier?: string | null
          scores?: Json
          session_id?: string | null
          team_leader_email?: string | null
          team_size?: string | null
        }
        Update: {
          answers?: Json
          archetype?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          email_action_plan?: Json | null
          id?: string
          industry?: string | null
          industry_refined?: string | null
          overall_score?: number
          respondent_role?: string | null
          role_tier?: string | null
          scores?: Json
          session_id?: string | null
          team_leader_email?: string | null
          team_size?: string | null
        }
        Relationships: []
      }
      document_sync_logs: {
        Row: {
          bundle_id: string
          changeset: Json
          document_snapshot: string
          errors: Json | null
          id: string
          items_created: number
          items_deleted: number
          items_updated: number
          summary: string | null
          synced_at: string
          user_id: string
        }
        Insert: {
          bundle_id: string
          changeset?: Json
          document_snapshot: string
          errors?: Json | null
          id?: string
          items_created?: number
          items_deleted?: number
          items_updated?: number
          summary?: string | null
          synced_at?: string
          user_id: string
        }
        Update: {
          bundle_id?: string
          changeset?: Json
          document_snapshot?: string
          errors?: Json | null
          id?: string
          items_created?: number
          items_deleted?: number
          items_updated?: number
          summary?: string | null
          synced_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_sync_logs_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_default: boolean | null
          owner_id: string
          sort_order: number | null
          tag: string
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          owner_id: string
          sort_order?: number | null
          tag: string
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          owner_id?: string
          sort_order?: number | null
          tag?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      execution_captures: {
        Row: {
          capture_type: Database["public"]["Enums"]["capture_type"]
          captured_by: string
          content: string
          created_at: string
          execution_id: string
          id: string
          metadata: Json | null
          promoted_to_item_id: string | null
          resolution_status: string | null
          severity: string | null
          step_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capture_type?: Database["public"]["Enums"]["capture_type"]
          captured_by: string
          content: string
          created_at?: string
          execution_id: string
          id?: string
          metadata?: Json | null
          promoted_to_item_id?: string | null
          resolution_status?: string | null
          severity?: string | null
          step_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capture_type?: Database["public"]["Enums"]["capture_type"]
          captured_by?: string
          content?: string
          created_at?: string
          execution_id?: string
          id?: string
          metadata?: Json | null
          promoted_to_item_id?: string | null
          resolution_status?: string | null
          severity?: string | null
          step_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "execution_captures_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "protocol_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_captures_promoted_to_item_id_fkey"
            columns: ["promoted_to_item_id"]
            isOneToOne: false
            referencedRelation: "context_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_captures_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "protocol_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      extraction_trials: {
        Row: {
          company: string | null
          content_preview: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          result_summary: Json | null
          source_type: string
        }
        Insert: {
          company?: string | null
          content_preview?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          result_summary?: Json | null
          source_type?: string
        }
        Update: {
          company?: string | null
          content_preview?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          result_summary?: Json | null
          source_type?: string
        }
        Relationships: []
      }
      factory_floor_submissions: {
        Row: {
          call_requested: boolean
          company: string | null
          created_at: string
          email: string | null
          grading: string
          id: string
          name: string | null
          promise: string
          role: string | null
          user_agent: string | null
          verdict: Json | null
          workflow: string
        }
        Insert: {
          call_requested?: boolean
          company?: string | null
          created_at?: string
          email?: string | null
          grading: string
          id?: string
          name?: string | null
          promise: string
          role?: string | null
          user_agent?: string | null
          verdict?: Json | null
          workflow: string
        }
        Update: {
          call_requested?: boolean
          company?: string | null
          created_at?: string
          email?: string | null
          grading?: string
          id?: string
          name?: string | null
          promise?: string
          role?: string | null
          user_agent?: string | null
          verdict?: Json | null
          workflow?: string
        }
        Relationships: []
      }
      insights_research: {
        Row: {
          aggregate_snapshot: Json | null
          category: string
          citations: Json | null
          created_at: string
          dimension_focus: string | null
          id: string
          query: string
          result_content: string
          submission_count: number
          triggered_by: string | null
        }
        Insert: {
          aggregate_snapshot?: Json | null
          category?: string
          citations?: Json | null
          created_at?: string
          dimension_focus?: string | null
          id?: string
          query: string
          result_content?: string
          submission_count?: number
          triggered_by?: string | null
        }
        Update: {
          aggregate_snapshot?: Json | null
          category?: string
          citations?: Json | null
          created_at?: string
          dimension_focus?: string | null
          id?: string
          query?: string
          result_content?: string
          submission_count?: number
          triggered_by?: string | null
        }
        Relationships: []
      }
      knowledge_source_versions: {
        Row: {
          change_note: string | null
          changed_by: string
          content: string
          created_at: string
          id: string
          source_id: string
          version_number: number
        }
        Insert: {
          change_note?: string | null
          changed_by: string
          content?: string
          created_at?: string
          id?: string
          source_id: string
          version_number?: number
        }
        Update: {
          change_note?: string | null
          changed_by?: string
          content?: string
          created_at?: string
          id?: string
          source_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_source_versions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_sources: {
        Row: {
          content: string
          created_at: string
          current_version: number
          description: string | null
          domain_tag: string | null
          id: string
          metadata: Json | null
          original_document_id: string | null
          owner_id: string
          source_type: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          current_version?: number
          description?: string | null
          domain_tag?: string | null
          id?: string
          metadata?: Json | null
          original_document_id?: string | null
          owner_id: string
          source_type?: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          current_version?: number
          description?: string | null
          domain_tag?: string | null
          id?: string
          metadata?: Json | null
          original_document_id?: string | null
          owner_id?: string
          source_type?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_sources_original_document_id_fkey"
            columns: ["original_document_id"]
            isOneToOne: false
            referencedRelation: "personal_documents"
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
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          read_at: string | null
          source_id: string
          source_type: string
          title: string
          type: string
          user_id: string
          workbook_id: string | null
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          source_id: string
          source_type: string
          title: string
          type: string
          user_id: string
          workbook_id?: string | null
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          source_id?: string
          source_type?: string
          title?: string
          type?: string
          user_id?: string
          workbook_id?: string | null
        }
        Relationships: []
      }
      operator_plan_items: {
        Row: {
          ai_suggested: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          planned_date: string | null
          sort_order: number
          source_id: string | null
          source_type: string
          time_horizon: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_suggested?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          planned_date?: string | null
          sort_order?: number
          source_id?: string | null
          source_type?: string
          time_horizon?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_suggested?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          planned_date?: string | null
          sort_order?: number
          source_id?: string | null
          source_type?: string
          time_horizon?: string
          title?: string
          updated_at?: string
          user_id?: string
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
      platform_signups: {
        Row: {
          additional_notes: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          primary_interest: string | null
          role: string | null
          team_size: string | null
        }
        Insert: {
          additional_notes?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          primary_interest?: string | null
          role?: string | null
          team_size?: string | null
        }
        Update: {
          additional_notes?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          primary_interest?: string | null
          role?: string | null
          team_size?: string | null
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
      protocol_context_items: {
        Row: {
          context_item_id: string
          created_at: string
          id: string
          injection_scope: string
          protocol_id: string
          step_id: string | null
        }
        Insert: {
          context_item_id: string
          created_at?: string
          id?: string
          injection_scope?: string
          protocol_id: string
          step_id?: string | null
        }
        Update: {
          context_item_id?: string
          created_at?: string
          id?: string
          injection_scope?: string
          protocol_id?: string
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "protocol_context_items_context_item_id_fkey"
            columns: ["context_item_id"]
            isOneToOne: false
            referencedRelation: "context_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_context_items_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "workbook_protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_context_items_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "protocol_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_executions: {
        Row: {
          completed_at: string | null
          compliance_score: number | null
          created_at: string
          current_step_id: string | null
          drift_score: number | null
          executed_by: string
          id: string
          metadata: Json | null
          notes: string | null
          protocol_id: string
          session_summary: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["protocol_execution_status"]
          summary_generated_at: string | null
          updated_at: string
          workbook_id: string
        }
        Insert: {
          completed_at?: string | null
          compliance_score?: number | null
          created_at?: string
          current_step_id?: string | null
          drift_score?: number | null
          executed_by: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          protocol_id: string
          session_summary?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["protocol_execution_status"]
          summary_generated_at?: string | null
          updated_at?: string
          workbook_id: string
        }
        Update: {
          completed_at?: string | null
          compliance_score?: number | null
          created_at?: string
          current_step_id?: string | null
          drift_score?: number | null
          executed_by?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          protocol_id?: string
          session_summary?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["protocol_execution_status"]
          summary_generated_at?: string | null
          updated_at?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_executions_current_step_id_fkey"
            columns: ["current_step_id"]
            isOneToOne: false
            referencedRelation: "protocol_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_executions_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "workbook_protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_executions_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_steps: {
        Row: {
          agent_prompt: string | null
          created_at: string
          description: string | null
          estimated_minutes: number | null
          gate_enforcement: string | null
          id: string
          is_required: boolean
          output_description: string | null
          output_type: string | null
          protocol_id: string
          research_template_id: string | null
          source_item_id: string | null
          step_order: number
          step_type: string
          title: string
          updated_at: string
        }
        Insert: {
          agent_prompt?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          gate_enforcement?: string | null
          id?: string
          is_required?: boolean
          output_description?: string | null
          output_type?: string | null
          protocol_id: string
          research_template_id?: string | null
          source_item_id?: string | null
          step_order?: number
          step_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          agent_prompt?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          gate_enforcement?: string | null
          id?: string
          is_required?: boolean
          output_description?: string | null
          output_type?: string | null
          protocol_id?: string
          research_template_id?: string | null
          source_item_id?: string | null
          step_order?: number
          step_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_steps_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "workbook_protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_steps_research_template_id_fkey"
            columns: ["research_template_id"]
            isOneToOne: false
            referencedRelation: "research_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_steps_source_item_id_fkey"
            columns: ["source_item_id"]
            isOneToOne: false
            referencedRelation: "context_items"
            referencedColumns: ["id"]
          },
        ]
      }
      research_templates: {
        Row: {
          agent_model: string
          agent_system_prompt: string | null
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          is_public: boolean
          owner_id: string
          research_type: string
          steps: Json
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          agent_model?: string
          agent_system_prompt?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_public?: boolean
          owner_id: string
          research_type?: string
          steps?: Json
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          agent_model?: string
          agent_system_prompt?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_public?: boolean
          owner_id?: string
          research_type?: string
          steps?: Json
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_reviews: {
        Row: {
          ai_synthesis: string | null
          created_at: string
          execution_id: string
          id: string
          promoted_capture_ids: string[] | null
          synthesis_generated_at: string | null
          updated_at: string
          user_id: string
          what_didnt: string
          what_worked: string
          would_do_differently: string
        }
        Insert: {
          ai_synthesis?: string | null
          created_at?: string
          execution_id: string
          id?: string
          promoted_capture_ids?: string[] | null
          synthesis_generated_at?: string | null
          updated_at?: string
          user_id: string
          what_didnt?: string
          what_worked?: string
          would_do_differently?: string
        }
        Update: {
          ai_synthesis?: string | null
          created_at?: string
          execution_id?: string
          id?: string
          promoted_capture_ids?: string[] | null
          synthesis_generated_at?: string | null
          updated_at?: string
          user_id?: string
          what_didnt?: string
          what_worked?: string
          would_do_differently?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_reviews_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "protocol_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      step_annotations: {
        Row: {
          annotation_type: Database["public"]["Enums"]["annotation_type"]
          author_id: string
          content: string
          created_at: string
          id: string
          is_visible: boolean
          sort_order: number
          step_id: string
          updated_at: string
        }
        Insert: {
          annotation_type?: Database["public"]["Enums"]["annotation_type"]
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_visible?: boolean
          sort_order?: number
          step_id: string
          updated_at?: string
        }
        Update: {
          annotation_type?: Database["public"]["Enums"]["annotation_type"]
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          sort_order?: number
          step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step_annotations_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "protocol_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      step_executions: {
        Row: {
          completed_at: string | null
          created_at: string
          execution_id: string
          gate_acknowledged: boolean | null
          gate_acknowledged_at: string | null
          gate_acknowledged_by: string | null
          id: string
          metadata: Json | null
          output_chat_id: string | null
          output_notes: string | null
          output_task_ids: string[] | null
          started_at: string | null
          status: Database["public"]["Enums"]["step_execution_status"]
          step_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          execution_id: string
          gate_acknowledged?: boolean | null
          gate_acknowledged_at?: string | null
          gate_acknowledged_by?: string | null
          id?: string
          metadata?: Json | null
          output_chat_id?: string | null
          output_notes?: string | null
          output_task_ids?: string[] | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["step_execution_status"]
          step_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          execution_id?: string
          gate_acknowledged?: boolean | null
          gate_acknowledged_at?: string | null
          gate_acknowledged_by?: string | null
          id?: string
          metadata?: Json | null
          output_chat_id?: string | null
          output_notes?: string | null
          output_task_ids?: string[] | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["step_execution_status"]
          step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step_executions_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "protocol_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_executions_output_chat_id_fkey"
            columns: ["output_chat_id"]
            isOneToOne: false
            referencedRelation: "workbook_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_executions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "protocol_steps"
            referencedColumns: ["id"]
          },
        ]
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
      workbook_protocols: {
        Row: {
          bundle_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          sort_order: number
          source_playbook_id: string
          title: string
          updated_at: string
          workbook_id: string
        }
        Insert: {
          bundle_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          source_playbook_id: string
          title: string
          updated_at?: string
          workbook_id: string
        }
        Update: {
          bundle_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          source_playbook_id?: string
          title?: string
          updated_at?: string
          workbook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbook_protocols_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workbook_protocols_source_playbook_id_fkey"
            columns: ["source_playbook_id"]
            isOneToOne: false
            referencedRelation: "context_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workbook_protocols_workbook_id_fkey"
            columns: ["workbook_id"]
            isOneToOne: false
            referencedRelation: "workbooks"
            referencedColumns: ["id"]
          },
        ]
      }
      workbook_resource_versions: {
        Row: {
          change_note: string | null
          content: string | null
          created_at: string
          created_by: string
          file_name: string | null
          file_path: string | null
          file_type: string | null
          id: string
          metadata: Json | null
          resource_id: string
          version_number: number
        }
        Insert: {
          change_note?: string | null
          content?: string | null
          created_at?: string
          created_by: string
          file_name?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          resource_id: string
          version_number?: number
        }
        Update: {
          change_note?: string | null
          content?: string | null
          created_at?: string
          created_by?: string
          file_name?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "workbook_resource_versions_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "workbook_resources"
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
          coaching_notes: string | null
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
          coaching_notes?: string | null
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
          coaching_notes?: string | null
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
      get_diagnostic_result_public: {
        Args: { result_id: string }
        Returns: {
          answers: Json
          archetype: string
          id: string
          overall_score: number
          scores: Json
        }[]
      }
      get_diagnostic_submission_count: { Args: never; Returns: number }
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
      seed_default_domains: { Args: { p_user_id: string }; Returns: undefined }
      user_accessible_workbook_ids: {
        Args: { _user_id: string }
        Returns: string[]
      }
    }
    Enums: {
      action_logic: "APPEND" | "OVERRIDE" | "BLOCK"
      annotation_type: "tip" | "warning" | "example" | "context"
      app_role: "operator" | "architect" | "manager"
      capture_type:
        | "friction"
        | "drift"
        | "best_practice"
        | "learning"
        | "enhancement"
        | "exception"
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
      protocol_execution_status:
        | "not_started"
        | "in_progress"
        | "paused"
        | "completed"
        | "abandoned"
      security_scope: "INTERNAL" | "CONFIDENTIAL" | "ADMIN_ONLY"
      step_execution_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "skipped"
        | "blocked"
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
      annotation_type: ["tip", "warning", "example", "context"],
      app_role: ["operator", "architect", "manager"],
      capture_type: [
        "friction",
        "drift",
        "best_practice",
        "learning",
        "enhancement",
        "exception",
      ],
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
      protocol_execution_status: [
        "not_started",
        "in_progress",
        "paused",
        "completed",
        "abandoned",
      ],
      security_scope: ["INTERNAL", "CONFIDENTIAL", "ADMIN_ONLY"],
      step_execution_status: [
        "pending",
        "in_progress",
        "completed",
        "skipped",
        "blocked",
      ],
      task_priority: ["low", "medium", "high", "critical"],
      task_status: ["todo", "in_progress", "blocked", "done", "cancelled"],
      workbook_status: ["draft", "active", "review", "completed", "archived"],
    },
  },
} as const
