export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          reason: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          reason?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          reason?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      /*bookings: {
        Row: {
          booking_date: string
          client_id: string
          created_at: string | null
          end_time: string
          id: string
          start_time: string
          status: string
          total_amount: number
          worker_id: string
        }
        Insert: {
          booking_date: string
          client_id: string
          created_at?: string | null
          end_time: string
          id?: string
          start_time: string
          status?: string
          total_amount: number
          worker_id: string
        }
        Update: {
          booking_date?: string
          client_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          start_time?: string
          status?: string
          total_amount?: number
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }*/
	  // Add to Database['public']['Tables']
		bookings: {
		  Row: {
			id: string;
			booking_date: string;
			start_time: string;
			end_time: string;
			client_id: string;
			worker_id: string;
			package_id: string | null;
			service_details: string | null;
			is_custom_offer: boolean;
			status: 'pending' | 'accepted' | 'rejected' | 
				   'completed' | 'cancelled' |
				   'offer_pending' | 'offer_accepted' | 'offer_rejected';
			total_amount: number;
			created_at: string;
			updated_at: string;
		  };
		  Insert: {
			id?: string;
			booking_date: string;
			start_time: string;
			end_time: string;
			client_id: string;
			worker_id: string;
			package_id?: string | null;
			service_details?: string | null;
			is_custom_offer?: boolean;
			status?: 'pending' | /*...other statuses...*/;
			total_amount: number;
			created_at?: string;
			updated_at?: string;
		  };
		  Update: {
		  /* Similar to Insert */
		  booking_date?: string
          client_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          start_time?: string
          status?: string
          total_amount?: number
          worker_id?: string
		  };
		  Relationships: [
		/* Add relationships */
			{
			foreignKeyName: "bookings_worker_id_fkey"
			columns: ["worker_id"]
			isOneToOne: false
			referencedRelation: "worker_profiles"
			referencedColumns: ["id"]
		  },
		  ]
		  
		}
      certifications: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string
          issued_by: string
          name: string
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date: string
          issued_by: string
          name: string
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          issued_by?: string
          name?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          worker_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          worker_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          completed_date: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          title: string
          worker_id: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
          worker_id?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          reason: string
          reported_review_id: string | null
          reported_worker_id: string | null
          reporter_id: string
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reason: string
          reported_review_id?: string | null
          reported_worker_id?: string | null
          reporter_id: string
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reason?: string
          reported_review_id?: string | null
          reported_worker_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_review_id_fkey"
            columns: ["reported_review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_worker_id_fkey"
            columns: ["reported_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewer_id: string
          worker_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewer_id: string
          worker_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewer_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          created_at: string | null
          deposit_required: number | null
          description: string | null
          features: Json | null
          id: string
          name: string
          price: number
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          deposit_required?: number | null
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price: number
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          deposit_required?: number | null
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_profiles: {
        Row: {
          availability: Json | null
          average_rating: number | null
          category: Database["public"]["Enums"]["worker_category"]
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          featured_until: string | null
          hourly_rate: number | null
          id: string
          is_premium: boolean | null
          is_verified: boolean | null
          location: Json | null
          name: string
          offers_warranty: boolean | null
          profile_image_url: string | null
          total_ratings: number | null
          user_id: string | null
          warranty_details: string | null
          years_of_experience: number | null
        }
        Insert: {
          availability?: Json | null
          average_rating?: number | null
          category: Database["public"]["Enums"]["worker_category"]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          featured_until?: string | null
          hourly_rate?: number | null
          id?: string
          is_premium?: boolean | null
          is_verified?: boolean | null
          location?: Json | null
          name: string
          offers_warranty?: boolean | null
          profile_image_url?: string | null
          total_ratings?: number | null
          user_id?: string | null
          warranty_details?: string | null
          years_of_experience?: number | null
        }
        Update: {
          availability?: Json | null
          average_rating?: number | null
          category?: Database["public"]["Enums"]["worker_category"]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          featured_until?: string | null
          hourly_rate?: number | null
          id?: string
          is_premium?: boolean | null
          is_verified?: boolean | null
          location?: Json | null
          name?: string
          offers_warranty?: boolean | null
          profile_image_url?: string | null
          total_ratings?: number | null
          user_id?: string | null
          warranty_details?: string | null
          years_of_experience?: number | null
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
      worker_category:
        | "Cleaner"
        | "Landscaper"
        | "Electrician"
        | "Plumber"
        | "Mechanic"
        | "Tiler"
        | "Mason"
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
