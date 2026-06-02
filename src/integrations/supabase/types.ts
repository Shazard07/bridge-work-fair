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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      company_profiles: {
        Row: {
          company_name: string
          contact_name: string
          contact_phone: string
          created_at: string
          sector: Database["public"]["Enums"]["sector"]
          uen: string
          updated_at: string
          user_id: string
          work_pass_accepted: Database["public"]["Enums"]["work_pass_accepted"]
        }
        Insert: {
          company_name: string
          contact_name: string
          contact_phone: string
          created_at?: string
          sector: Database["public"]["Enums"]["sector"]
          uen: string
          updated_at?: string
          user_id: string
          work_pass_accepted: Database["public"]["Enums"]["work_pass_accepted"]
        }
        Update: {
          company_name?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          sector?: Database["public"]["Enums"]["sector"]
          uen?: string
          updated_at?: string
          user_id?: string
          work_pass_accepted?: Database["public"]["Enums"]["work_pass_accepted"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_workers: {
        Row: {
          company_id: string
          created_at: string
          id: string
          worker_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          worker_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          worker_id?: string
        }
        Relationships: []
      }
      worker_contacts: {
        Row: {
          company_id: string
          created_at: string
          id: string
          message: string | null
          worker_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          message?: string | null
          worker_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          message?: string | null
          worker_id?: string
        }
        Relationships: []
      }
      worker_profiles: {
        Row: {
          available_from: string | null
          available_now: boolean
          certifications: string | null
          created_at: string
          date_of_birth: string
          education: string | null
          expected_salary: number | null
          language: Database["public"]["Enums"]["language"]
          last_drawn_salary: number | null
          nationality: Database["public"]["Enums"]["nationality"]
          overseas_experiences: Json
          sector: Database["public"]["Enums"]["sector"]
          sg_experiences: Json
          skills: string
          updated_at: string
          user_id: string
          work_pass_end_date: string | null
          years_experience: number
        }
        Insert: {
          available_from?: string | null
          available_now?: boolean
          certifications?: string | null
          created_at?: string
          date_of_birth: string
          education?: string | null
          expected_salary?: number | null
          language: Database["public"]["Enums"]["language"]
          last_drawn_salary?: number | null
          nationality: Database["public"]["Enums"]["nationality"]
          overseas_experiences?: Json
          sector: Database["public"]["Enums"]["sector"]
          sg_experiences?: Json
          skills?: string
          updated_at?: string
          user_id: string
          work_pass_end_date?: string | null
          years_experience?: number
        }
        Update: {
          available_from?: string | null
          available_now?: boolean
          certifications?: string | null
          created_at?: string
          date_of_birth?: string
          education?: string | null
          expected_salary?: number | null
          language?: Database["public"]["Enums"]["language"]
          last_drawn_salary?: number | null
          nationality?: Database["public"]["Enums"]["nationality"]
          overseas_experiences?: Json
          sector?: Database["public"]["Enums"]["sector"]
          sg_experiences?: Json
          skills?: string
          updated_at?: string
          user_id?: string
          work_pass_end_date?: string | null
          years_experience?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      language: "Tamil" | "Hindi" | "Bengali" | "Thai" | "Mandarin"
      nationality: "India" | "Bangladesh" | "Thailand" | "China"
      sector: "Construction" | "Marine"
      user_role: "worker" | "company"
      work_pass_accepted: "Work Permit" | "S Pass" | "Both"
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
      language: ["Tamil", "Hindi", "Bengali", "Thai", "Mandarin"],
      nationality: ["India", "Bangladesh", "Thailand", "China"],
      sector: ["Construction", "Marine"],
      user_role: ["worker", "company"],
      work_pass_accepted: ["Work Permit", "S Pass", "Both"],
    },
  },
} as const
