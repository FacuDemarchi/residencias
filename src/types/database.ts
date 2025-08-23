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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string | null
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_available: boolean | null
          publication_id: string
          reason: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_available?: boolean | null
          publication_id: string
          reason?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_available?: boolean | null
          publication_id?: string
          reason?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          contact_type: string
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          publication_id: string
          updated_at: string | null
        }
        Insert: {
          contact_type: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          publication_id: string
          updated_at?: string | null
        }
        Update: {
          contact_type?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          publication_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          created_at: string | null
          id: string
          publication_id: string
          tipo: string
          url_imagen: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          publication_id: string
          tipo: string
          url_imagen: string
        }
        Update: {
          created_at?: string | null
          id?: string
          publication_id?: string
          tipo?: string
          url_imagen?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      location: {
        Row: {
          created_at: string | null
          direccion: string | null
          id: string
          latitud: number
          longitud: number
        }
        Insert: {
          created_at?: string | null
          direccion?: string | null
          id?: string
          latitud: number
          longitud: number
        }
        Update: {
          created_at?: string | null
          direccion?: string | null
          id?: string
          latitud?: number
          longitud?: number
        }
        Relationships: []
      }
      pagos: {
        Row: {
          created_at: string | null
          fecha_pago: string | null
          fecha_vencimiento: string
          id: string
          monto: number
          rental_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fecha_pago?: string | null
          fecha_vencimiento: string
          id?: string
          monto: number
          rental_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fecha_pago?: string | null
          fecha_vencimiento?: string
          id?: string
          monto?: number
          rental_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          created_at: string | null
          id: string
          motivo_cambio: string | null
          precio_anterior: number
          precio_nuevo: number
          publication_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo_cambio?: string | null
          precio_anterior: number
          precio_nuevo: number
          publication_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo_cambio?: string | null
          precio_anterior?: number
          precio_nuevo?: number
          publication_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_amenities: {
        Row: {
          amenity_id: string
          created_at: string | null
          id: string
          publication_id: string
        }
        Insert: {
          amenity_id: string
          created_at?: string | null
          id?: string
          publication_id: string
        }
        Update: {
          amenity_id?: string
          created_at?: string | null
          id?: string
          publication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_amenities_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_tags: {
        Row: {
          created_at: string | null
          id: string
          publication_id: string
          tag_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          publication_id: string
          tag_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          publication_id?: string
          tag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_tags_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          capacidad: number
          created_at: string | null
          created_by: string | null
          currency: string | null
          current_state_id: string | null
          deleted_at: string | null
          deposit_amount: number | null
          descripcion: string | null
          id: string
          is_active: boolean | null
          location_id: string | null
          max_stay_days: number | null
          metros_cuadrados: number | null
          min_stay_days: number | null
          price: number
          titulo: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          capacidad: number
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_state_id?: string | null
          deleted_at?: string | null
          deposit_amount?: number | null
          descripcion?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_stay_days?: number | null
          metros_cuadrados?: number | null
          min_stay_days?: number | null
          price: number
          titulo: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          capacidad?: number
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_state_id?: string | null
          deleted_at?: string | null
          deposit_amount?: number | null
          descripcion?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_stay_days?: number | null
          metros_cuadrados?: number | null
          min_stay_days?: number | null
          price?: number
          titulo?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publications_current_state_id_fkey"
            columns: ["current_state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publications_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          cleanliness_score: number | null
          comentario: string | null
          communication_score: number | null
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          location_score: number | null
          overall_score: number | null
          rental_id: string
          user_id: string
          value_score: number | null
          would_recommend: boolean | null
        }
        Insert: {
          cleanliness_score?: number | null
          comentario?: string | null
          communication_score?: number | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          location_score?: number | null
          overall_score?: number | null
          rental_id: string
          user_id: string
          value_score?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          cleanliness_score?: number | null
          comentario?: string | null
          communication_score?: number | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          location_score?: number | null
          overall_score?: number | null
          rental_id?: string
          user_id?: string
          value_score?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          cleaning_fee: number | null
          contrato_aceptado: boolean | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          deleted_at: string | null
          deposit_paid: boolean | null
          fecha_actualizacion: string | null
          fecha_fin: string
          fecha_inicio: string
          id: string
          monto_total: number
          normas_aceptadas: boolean | null
          porcentaje_actualizacion: number | null
          publication_id: string
          total_personas: number
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          cleaning_fee?: number | null
          contrato_aceptado?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          deposit_paid?: boolean | null
          fecha_actualizacion?: string | null
          fecha_fin: string
          fecha_inicio: string
          id?: string
          monto_total: number
          normas_aceptadas?: boolean | null
          porcentaje_actualizacion?: number | null
          publication_id: string
          total_personas: number
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          cleaning_fee?: number | null
          contrato_aceptado?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          deposit_paid?: boolean | null
          fecha_actualizacion?: string | null
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          monto_total?: number
          normas_aceptadas?: boolean | null
          porcentaje_actualizacion?: number | null
          publication_id?: string
          total_personas?: number
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      state_history: {
        Row: {
          created_at: string | null
          id: string
          motivo_cambio: string | null
          publication_id: string
          state_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo_cambio?: string | null
          publication_id: string
          state_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo_cambio?: string | null
          publication_id?: string
          state_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "state_history_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "state_history_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          created_at: string | null
          descripcion: string | null
          es_final: boolean | null
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          es_final?: boolean | null
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          es_final?: boolean | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_data: {
        Row: {
          created_at: string | null
          datos_personales: Json | null
          updated_at: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          datos_personales?: Json | null
          updated_at?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          datos_personales?: Json | null
          updated_at?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_locations_for_map: {
        Args: { center_lat: number; center_lng: number; radius_km?: number }
        Returns: {
          estado: string
          id: number
          latitud: number
          longitud: number
        }[]
      }
      get_publications_for_sidebar: {
        Args: {
          center_lat?: number
          center_lng?: number
          limit_count?: number
          offset_count?: number
          order_type?: string
          radius_km?: number
        }
        Returns: {
          capacidad: number
          created_at: string
          descripcion: string
          estado: string
          id: number
          latitud: number
          location_id: number
          longitud: number
          metros_cuadrados: number
          precio: number
          titulo: string
          updated_at: string
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

// Tipos para las funciones de base de datos que devuelven datos con la estructura de la aplicación
export interface MapLocation {
  id: number;
  latitud: number;
  longitud: number;
  estado: string;
}

export interface PublicationForSidebar {
  id: number;
  location_id: number;
  capacidad: number;
  metros_cuadrados: number;
  descripcion: string;
  estado: string;
  latitud: number;
  longitud: number;
  created_at: string;
}

// Tipo extendido para publicaciones con campos adicionales de la aplicación
export interface ExtendedPublication extends PublicationForSidebar {
  titulo: string;
  price: number;
  user_id: number;
  imagen?: string; // Campo legacy
  images?: Image[];
  direccion?: string; // Campo calculado o de otra tabla
  amenidades?: string[]; // Campo calculado o de otra tabla
  updated_at?: string;
}

// Tipos de conveniencia para usar en componentes
export type Publication = Database['public']['Tables']['publications']['Row'];
export type PublicationInsert = Database['public']['Tables']['publications']['Insert'];
export type PublicationUpdate = Database['public']['Tables']['publications']['Update'];

export type Image = Database['public']['Tables']['images']['Row'];
export type ImageInsert = Database['public']['Tables']['images']['Insert'];
export type ImageUpdate = Database['public']['Tables']['images']['Update'];
