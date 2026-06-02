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
      applications: {
        Row: {
          created_at: string
          id: string
          job_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
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
      jobs: {
        Row: {
          company_id: string
          contract_duration: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          max_salary: number | null
          max_salary_day: number | null
          min_salary: number | null
          min_salary_day: number | null
          sector: Database["public"]["Enums"]["sector"] | null
          start_date: string | null
          title: string | null
          updated_at: string
          work_hours: string | null
          work_pass_type:
            | Database["public"]["Enums"]["work_pass_accepted"]
            | null
          workers_needed: number | null
        }
        Insert: {
          company_id: string
          contract_duration?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          max_salary?: number | null
          max_salary_day?: number | null
          min_salary?: number | null
          min_salary_day?: number | null
          sector?: Database["public"]["Enums"]["sector"] | null
          start_date?: string | null
          title?: string | null
          updated_at?: string
          work_hours?: string | null
          work_pass_type?:
            | Database["public"]["Enums"]["work_pass_accepted"]
            | null
          workers_needed?: number | null
        }
        Update: {
          company_id?: string
          contract_duration?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          max_salary?: number | null
          max_salary_day?: number | null
          min_salary?: number | null
          min_salary_day?: number | null
          sector?: Database["public"]["Enums"]["sector"] | null
          start_date?: string | null
          title?: string | null
          updated_at?: string
          work_hours?: string | null
          work_pass_type?:
            | Database["public"]["Enums"]["work_pass_accepted"]
            | null
          workers_needed?: number | null
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
      worker_profiles: {
        Row: {
          created_at: string
          date_of_birth: string
          language: Database["public"]["Enums"]["language"]
          nationality: Database["public"]["Enums"]["nationality"]
          sector: Database["public"]["Enums"]["sector"]
          skills: string
          updated_at: string
          user_id: string
          work_pass_end_date: string | null
          years_experience: number
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          language: Database["public"]["Enums"]["language"]
          nationality: Database["public"]["Enums"]["nationality"]
          sector: Database["public"]["Enums"]["sector"]
          skills?: string
          updated_at?: string
          user_id: string
          work_pass_end_date?: string | null
          years_experience?: number
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          language?: Database["public"]["Enums"]["language"]
          nationality?: Database["public"]["Enums"]["nationality"]
          sector?: Database["public"]["Enums"]["sector"]
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
      application_status: "Pending" | "Viewed" | "Contacted" | "Rejected"
      language: "Tamil" | "Hindi" | "Bengali" | "Thai" | "Mandarin"
      nationality: "India" | "Bangladesh" | "Thailand" | "China"
      sector: "Construction" | "Marine"
      user_role: "worker" | "company"
      work_pass_accepted: "Work Permit" | "S Pass" | "Both"
      work_pass_type: "Work Permit" | "S Pass"
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
      application_status: ["Pending", "Viewed", "Contacted", "Rejected"],
      language: ["Tamil", "Hindi", "Bengali", "Thai", "Mandarin"],
      nationality: ["India", "Bangladesh", "Thailand", "China"],
      sector: ["Construction", "Marine"],
      user_role: ["worker", "company"],
      work_pass_accepted: ["Work Permit", "S Pass", "Both"],
      work_pass_type: ["Work Permit", "S Pass"],
    },
  },
} as const
