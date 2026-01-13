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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          avatar_url: string | null
          business_name: string
          created_at: string | null
          id: string
          name: string
          system_prompt: string
          theme_color: string | null
          voice_config: Json | null
          welcome_message: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_name: string
          created_at?: string | null
          id?: string
          name: string
          system_prompt: string
          theme_color?: string | null
          voice_config?: Json | null
          welcome_message?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_name?: string
          created_at?: string | null
          id?: string
          name?: string
          system_prompt?: string
          theme_color?: string | null
          voice_config?: Json | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      chat_transcripts: {
        Row: {
          agent_id: string | null
          channel: string | null
          completed_lead_capture: boolean | null
          created_at: string | null
          duration_seconds: number | null
          email: string
          id: string
          industry: string | null
          interest: string | null
          message_count: number | null
          messages: Json
          name: string
          phone: string | null
          session_id: string | null
          source: string | null
          tcpa_consent: boolean | null
          user_agent: string | null
        }
        Insert: {
          agent_id?: string | null
          channel?: string | null
          completed_lead_capture?: boolean | null
          created_at?: string | null
          duration_seconds?: number | null
          email: string
          id?: string
          industry?: string | null
          interest?: string | null
          message_count?: number | null
          messages: Json
          name: string
          phone?: string | null
          session_id?: string | null
          source?: string | null
          tcpa_consent?: boolean | null
          user_agent?: string | null
        }
        Update: {
          agent_id?: string | null
          channel?: string | null
          completed_lead_capture?: boolean | null
          created_at?: string | null
          duration_seconds?: number | null
          email?: string
          id?: string
          industry?: string | null
          interest?: string | null
          message_count?: number | null
          messages?: Json
          name?: string
          phone?: string | null
          session_id?: string | null
          source?: string | null
          tcpa_consent?: boolean | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_transcripts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_id: string
          call_id: string | null
          channel: string | null
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          lead_id: string | null
          recording_url: string | null
          session_id: string | null
          started_at: string | null
          summary: string | null
          transcript: Json | null
        }
        Insert: {
          agent_id: string
          call_id?: string | null
          channel?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          recording_url?: string | null
          session_id?: string | null
          started_at?: string | null
          summary?: string | null
          transcript?: Json | null
        }
        Update: {
          agent_id?: string
          call_id?: string | null
          channel?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          recording_url?: string | null
          session_id?: string | null
          started_at?: string | null
          summary?: string | null
          transcript?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "demo_agent_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_assets: {
        Row: {
          aspect_ratio: string | null
          client_id: string
          created_at: string | null
          engine: string
          filename: string
          id: string
          is_branded: boolean | null
          nugget_id: string | null
          prompt: string | null
        }
        Insert: {
          aspect_ratio?: string | null
          client_id?: string
          created_at?: string | null
          engine: string
          filename: string
          id?: string
          is_branded?: boolean | null
          nugget_id?: string | null
          prompt?: string | null
        }
        Update: {
          aspect_ratio?: string | null
          client_id?: string
          created_at?: string | null
          engine?: string
          filename?: string
          id?: string
          is_branded?: boolean | null
          nugget_id?: string | null
          prompt?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          id: string
          location_id: string | null
          provider: string
          refresh_token: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          id?: string
          location_id?: string | null
          provider: string
          refresh_token: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          location_id?: string | null
          provider?: string
          refresh_token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          agent_config: Json | null
          agent_id: string | null
          company_name: string | null
          consent_given: boolean | null
          consent_timestamp: string | null
          created_at: string | null
          email: string
          id: string
          last_error: string | null
          last_error_at: string | null
          name: string
          phone: string
          scraped_at: string | null
          updated_at: string | null
          website: string
          website_content: string | null
        }
        Insert: {
          agent_config?: Json | null
          agent_id?: string | null
          company_name?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          name: string
          phone: string
          scraped_at?: string | null
          updated_at?: string | null
          website: string
          website_content?: string | null
        }
        Update: {
          agent_config?: Json | null
          agent_id?: string | null
          company_name?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          name?: string
          phone?: string
          scraped_at?: string | null
          updated_at?: string | null
          website?: string
          website_content?: string | null
        }
        Relationships: []
      }
      transcript_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          role: string
          timestamp: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role: string
          timestamp: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcript_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          agent_id: string
          created_at: string | null
          estimated_cost_usd: number | null
          id: string
          metadata: Json | null
          model_name: string | null
          provider: string
          service_type: string
          usage_quantity: number
          usage_unit: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          estimated_cost_usd?: number | null
          id?: string
          metadata?: Json | null
          model_name?: string | null
          provider: string
          service_type: string
          usage_quantity: number
          usage_unit: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          estimated_cost_usd?: number | null
          id?: string
          metadata?: Json | null
          model_name?: string | null
          provider?: string
          service_type?: string
          usage_quantity?: number
          usage_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      demo_agent_configs: {
        Row: {
          agent_config: Json | null
          company_name: string | null
          id: string | null
        }
        Insert: {
          agent_config?: Json | null
          company_name?: string | null
          id?: string | null
        }
        Update: {
          agent_config?: Json | null
          company_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
      unified_conversation_messages: {
        Row: {
          channel: string | null
          conversation_id: string | null
          created_at: string | null
          lead_email: string | null
          lead_name: string | null
          message_data: Json | null
          session_id: string | null
        }
        Relationships: []
      }
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
