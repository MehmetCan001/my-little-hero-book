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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      children: {
        Row: {
          age: number | null
          created_at: string | null
          gender: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      credits: {
        Row: {
          created_at: string | null
          id: string
          qty: number
          reason: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          qty: number
          reason?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          qty?: number
          reason?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      image_styles: {
        Row: {
          description: string | null
          example_prompt: string | null
          id: string
          label: string
          name: string
        }
        Insert: {
          description?: string | null
          example_prompt?: string | null
          id?: string
          label: string
          name: string
        }
        Update: {
          description?: string | null
          example_prompt?: string | null
          id?: string
          label?: string
          name?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          id: string
          name: string
        }
        Insert: {
          code: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string
          provider: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          id: string
          illustration_prompt: string | null
          image_url: string | null
          page_no: number
          story_id: string | null
          text: string | null
        }
        Insert: {
          id?: string
          illustration_prompt?: string | null
          image_url?: string | null
          page_no: number
          story_id?: string | null
          text?: string | null
        }
        Update: {
          id?: string
          illustration_prompt?: string | null
          image_url?: string | null
          page_no?: number
          story_id?: string | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "story_with_original_photo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "v_story_full"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_exports: {
        Row: {
          created_at: string | null
          id: string
          pdf_url: string | null
          status: string | null
          story_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          status?: string | null
          story_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          status?: string | null
          story_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_exports_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdf_exports_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "story_with_original_photo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdf_exports_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "v_story_full"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          character_description: string | null
          child_id: string | null
          created_at: string | null
          id: string
          image_style_id: string | null
          language_id: string | null
          pdf_url: string | null
          prompt: string | null
          status: string | null
          theme: string | null
          title: string | null
          total_pages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          character_description?: string | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          image_style_id?: string | null
          language_id?: string | null
          pdf_url?: string | null
          prompt?: string | null
          status?: string | null
          theme?: string | null
          title?: string | null
          total_pages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          character_description?: string | null
          child_id?: string | null
          created_at?: string | null
          id?: string
          image_style_id?: string | null
          language_id?: string | null
          pdf_url?: string | null
          prompt?: string | null
          status?: string | null
          theme?: string | null
          title?: string | null
          total_pages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_image_style_id_fkey"
            columns: ["image_style_id"]
            isOneToOne: false
            referencedRelation: "image_styles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      story_images: {
        Row: {
          checksum: string | null
          content_type: string | null
          created_at: string | null
          file_size: number | null
          has_nsfw: boolean | null
          height: number | null
          id: string
          image_type: string | null
          image_url: string | null
          inference_ms: number | null
          model: string | null
          negative_prompt: string | null
          page_number: number | null
          prompt: string | null
          provider: string | null
          request_id: string | null
          seed: number | null
          status: string | null
          storage_path: string | null
          story_id: string | null
          updated_at: string | null
          width: number | null
        }
        Insert: {
          checksum?: string | null
          content_type?: string | null
          created_at?: string | null
          file_size?: number | null
          has_nsfw?: boolean | null
          height?: number | null
          id?: string
          image_type?: string | null
          image_url?: string | null
          inference_ms?: number | null
          model?: string | null
          negative_prompt?: string | null
          page_number?: number | null
          prompt?: string | null
          provider?: string | null
          request_id?: string | null
          seed?: number | null
          status?: string | null
          storage_path?: string | null
          story_id?: string | null
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          checksum?: string | null
          content_type?: string | null
          created_at?: string | null
          file_size?: number | null
          has_nsfw?: boolean | null
          height?: number | null
          id?: string
          image_type?: string | null
          image_url?: string | null
          inference_ms?: number | null
          model?: string | null
          negative_prompt?: string | null
          page_number?: number | null
          prompt?: string | null
          provider?: string | null
          request_id?: string | null
          seed?: number | null
          status?: string | null
          storage_path?: string | null
          story_id?: string | null
          updated_at?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "story_images_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_images_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "story_with_original_photo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_images_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "v_story_full"
            referencedColumns: ["id"]
          },
        ]
      }
      story_original_images: {
        Row: {
          content_type: string | null
          file_size: number | null
          id: string
          image_url: string
          storage_path: string
          story_id: string
          uploaded_at: string | null
        }
        Insert: {
          content_type?: string | null
          file_size?: number | null
          id?: string
          image_url: string
          storage_path: string
          story_id: string
          uploaded_at?: string | null
        }
        Update: {
          content_type?: string | null
          file_size?: number | null
          id?: string
          image_url?: string
          storage_path?: string
          story_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_original_images_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_original_images_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "story_with_original_photo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_original_images_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "v_story_full"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      story_with_original_photo: {
        Row: {
          character_description: string | null
          child_id: string | null
          created_at: string | null
          id: string | null
          image_style_id: string | null
          image_url: string | null
          language_id: string | null
          pdf_url: string | null
          prompt: string | null
          status: string | null
          theme: string | null
          title: string | null
          total_pages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_image_style_id_fkey"
            columns: ["image_style_id"]
            isOneToOne: false
            referencedRelation: "image_styles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      v_story_full: {
        Row: {
          character_description: string | null
          child_age: number | null
          child_gender: string | null
          child_id: string | null
          child_name: string | null
          created_at: string | null
          id: string | null
          image_style_id: string | null
          language_code: string | null
          language_id: string | null
          language_name: string | null
          original_photo_url: string | null
          pdf_url: string | null
          prompt: string | null
          status: string | null
          theme: string | null
          title: string | null
          total_pages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_image_style_id_fkey"
            columns: ["image_style_id"]
            isOneToOne: false
            referencedRelation: "image_styles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      image_type_enum: "cover" | "page" | "thumb" | "character" | "background"
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
      image_type_enum: ["cover", "page", "thumb", "character", "background"],
    },
  },
} as const
