export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accessibility_features: {
        Row: {
          audio_descriptions: boolean | null
          color_blind_friendly: boolean | null
          created_at: string
          high_contrast_mode: boolean | null
          id: string
          keyboard_navigation: boolean | null
          large_text_mode: boolean | null
          motion_reduced: boolean | null
          screen_reader_support: boolean | null
          updated_at: string
          user_id: string | null
          voice_commands: boolean | null
        }
        Insert: {
          audio_descriptions?: boolean | null
          color_blind_friendly?: boolean | null
          created_at?: string
          high_contrast_mode?: boolean | null
          id?: string
          keyboard_navigation?: boolean | null
          large_text_mode?: boolean | null
          motion_reduced?: boolean | null
          screen_reader_support?: boolean | null
          updated_at?: string
          user_id?: string | null
          voice_commands?: boolean | null
        }
        Update: {
          audio_descriptions?: boolean | null
          color_blind_friendly?: boolean | null
          created_at?: string
          high_contrast_mode?: boolean | null
          id?: string
          keyboard_navigation?: boolean | null
          large_text_mode?: boolean | null
          motion_reduced?: boolean | null
          screen_reader_support?: boolean | null
          updated_at?: string
          user_id?: string | null
          voice_commands?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "accessibility_features_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_program: {
        Row: {
          commission_rate: number | null
          created_at: string
          id: string
          is_active: boolean | null
          referral_code: string
          total_commission_earned: number | null
          total_referrals: number | null
          user_id: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          referral_code: string
          total_commission_earned?: number | null
          total_referrals?: number | null
          user_id?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          referral_code?: string
          total_commission_earned?: number | null
          total_referrals?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_program_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      astrology_consultations: {
        Row: {
          astrologer_id: string | null
          consultation_type: string
          created_at: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          notes: string | null
          price: number
          rating: number | null
          scheduled_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          astrologer_id?: string | null
          consultation_type: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          notes?: string | null
          price: number
          rating?: number | null
          scheduled_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          astrologer_id?: string | null
          consultation_type?: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          notes?: string | null
          price?: number
          rating?: number | null
          scheduled_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "astrology_consultations_astrologer_id_fkey"
            columns: ["astrologer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "astrology_consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      astrology_profiles: {
        Row: {
          birth_date: string
          birth_place: string
          birth_time: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          moon_sign: string | null
          rising_sign: string | null
          updated_at: string
          user_id: string
          zodiac_sign: string | null
        }
        Insert: {
          birth_date: string
          birth_place: string
          birth_time?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          moon_sign?: string | null
          rising_sign?: string | null
          updated_at?: string
          user_id: string
          zodiac_sign?: string | null
        }
        Update: {
          birth_date?: string
          birth_place?: string
          birth_time?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          moon_sign?: string | null
          rising_sign?: string | null
          updated_at?: string
          user_id?: string
          zodiac_sign?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "astrology_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      astrology_reports: {
        Row: {
          content: Json
          expires_at: string | null
          generated_at: string
          id: string
          is_premium: boolean | null
          report_type: string
          user_id: string | null
        }
        Insert: {
          content: Json
          expires_at?: string | null
          generated_at?: string
          id?: string
          is_premium?: boolean | null
          report_type: string
          user_id?: string | null
        }
        Update: {
          content?: Json
          expires_at?: string | null
          generated_at?: string
          id?: string
          is_premium?: boolean | null
          report_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "astrology_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_materials: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          material_name: string
          provided_by: string | null
          quantity: number | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          material_name: string
          provided_by?: string | null
          quantity?: number | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          material_name?: string
          provided_by?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_materials_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address: string | null
          assigned_at: string | null
          booking_notes: string | null
          created_at: string
          created_by: string
          duration_hours: number | null
          fromdate: string
          id: string
          invoice_number: string | null
          location: string | null
          notification_sent_at: string | null
          pandit_id: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          phone: string | null
          preferred_time: string | null
          service_id: number | null
          special_requirements: string | null
          status: string | null
          todate: string
          total_amount: number | null
        }
        Insert: {
          address?: string | null
          assigned_at?: string | null
          booking_notes?: string | null
          created_at?: string
          created_by: string
          duration_hours?: number | null
          fromdate: string
          id?: string
          invoice_number?: string | null
          location?: string | null
          notification_sent_at?: string | null
          pandit_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          phone?: string | null
          preferred_time?: string | null
          service_id?: number | null
          special_requirements?: string | null
          status?: string | null
          todate: string
          total_amount?: number | null
        }
        Update: {
          address?: string | null
          assigned_at?: string | null
          booking_notes?: string | null
          created_at?: string
          created_by?: string
          duration_hours?: number | null
          fromdate?: string
          id?: string
          invoice_number?: string | null
          location?: string | null
          notification_sent_at?: string | null
          pandit_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          phone?: string | null
          preferred_time?: string | null
          service_id?: number | null
          special_requirements?: string | null
          status?: string | null
          todate?: string
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          rating: number | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          rating?: number | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          rating?: number | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      language_support: {
        Row: {
          completion_percentage: number | null
          id: string
          is_active: boolean | null
          is_rtl: boolean | null
          language_code: string | null
          language_name: string
        }
        Insert: {
          completion_percentage?: number | null
          id?: string
          is_active?: boolean | null
          is_rtl?: boolean | null
          language_code?: string | null
          language_name: string
        }
        Update: {
          completion_percentage?: number | null
          id?: string
          is_active?: boolean | null
          is_rtl?: boolean | null
          language_code?: string | null
          language_name?: string
        }
        Relationships: []
      }
      live_streams: {
        Row: {
          created_at: string
          description: string | null
          ended_at: string | null
          id: string
          is_premium: boolean | null
          max_viewers: number | null
          pandit_id: string | null
          price: number | null
          recording_url: string | null
          scheduled_at: string | null
          started_at: string | null
          status: string | null
          stream_key: string
          stream_url: string | null
          title: string
          updated_at: string
          viewer_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          is_premium?: boolean | null
          max_viewers?: number | null
          pandit_id?: string | null
          price?: number | null
          recording_url?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          stream_key: string
          stream_url?: string | null
          title: string
          updated_at?: string
          viewer_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          is_premium?: boolean | null
          max_viewers?: number | null
          pandit_id?: string | null
          price?: number | null
          recording_url?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          stream_key?: string
          stream_url?: string | null
          title?: string
          updated_at?: string
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_streams_pandit_id_fkey"
            columns: ["pandit_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_programs: {
        Row: {
          created_at: string
          id: string
          last_activity_at: string | null
          points_balance: number | null
          tier_level: string | null
          total_points_earned: number | null
          total_points_redeemed: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity_at?: string | null
          points_balance?: number | null
          tier_level?: string | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity_at?: string | null
          points_balance?: number | null
          tier_level?: string | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          booking_id: string | null
          created_at: string
          description: string | null
          id: string
          points: number
          source: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points: number
          source: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          source?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          created_at: string
          email: string
          expertise: string | null
          id: string
          is_verified: boolean | null
          name: string
          phone: string | null
          profile_image_url: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          email: string
          expertise?: string | null
          id: string
          is_verified?: boolean | null
          name: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          email?: string
          expertise?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      recommendation_engine: {
        Row: {
          clicked_at: string | null
          confidence_score: number | null
          converted_at: string | null
          created_at: string
          id: string
          reasoning: string | null
          recommendation_type: string
          recommended_item_id: string
          shown_at: string | null
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          confidence_score?: number | null
          converted_at?: string | null
          created_at?: string
          id?: string
          reasoning?: string | null
          recommendation_type: string
          recommended_item_id: string
          shown_at?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          confidence_score?: number | null
          converted_at?: string | null
          created_at?: string
          id?: string
          reasoning?: string | null
          recommendation_type?: string
          recommended_item_id?: string
          shown_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_engine_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_tracking: {
        Row: {
          booking_id: string | null
          commission_amount: number | null
          created_at: string
          id: string
          referral_code: string | null
          referred_user_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          commission_amount?: number | null
          created_at?: string
          id?: string
          referral_code?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          commission_amount?: number | null
          created_at?: string
          id?: string
          referral_code?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_tracking_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_tracking_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_tracking_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_analytics: {
        Row: {
          average_order_value: number | null
          created_at: string
          date: string
          id: string
          new_customers: number | null
          returning_customers: number | null
          service_type: string | null
          total_bookings: number | null
          total_revenue: number | null
        }
        Insert: {
          average_order_value?: number | null
          created_at?: string
          date: string
          id?: string
          new_customers?: number | null
          returning_customers?: number | null
          service_type?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
        }
        Update: {
          average_order_value?: number | null
          created_at?: string
          date?: string
          id?: string
          new_customers?: number | null
          returning_customers?: number | null
          service_type?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      rewards_catalog: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          points_required: number
          reward_type: string
          title: string
          value_amount: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          points_required: number
          reward_type: string
          title: string
          value_amount?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          points_required?: number
          reward_type?: string
          title?: string
          value_amount?: number | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: number
          image: string | null
          name: string
          price: number | null
          requirements: string | null
        }
        Insert: {
          benefits?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: number
          image?: string | null
          name: string
          price?: number | null
          requirements?: string | null
        }
        Update: {
          benefits?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: number
          image?: string | null
          name?: string
          price?: number | null
          requirements?: string | null
        }
        Relationships: []
      }
      stream_viewers: {
        Row: {
          duration_minutes: number | null
          id: string
          is_premium_viewer: boolean | null
          joined_at: string
          left_at: string | null
          stream_id: string | null
          user_id: string | null
        }
        Insert: {
          duration_minutes?: number | null
          id?: string
          is_premium_viewer?: boolean | null
          joined_at?: string
          left_at?: string | null
          stream_id?: string | null
          user_id?: string | null
        }
        Update: {
          duration_minutes?: number | null
          id?: string
          is_premium_viewer?: boolean | null
          joined_at?: string
          left_at?: string | null
          stream_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_viewers_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_viewers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          config_key: string
          config_value: string
          created_at: string | null
          id: string
          is_sensitive: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: string
          created_at?: string | null
          id?: string
          is_sensitive?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string
          created_at?: string | null
          id?: string
          is_sensitive?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          accessibility_needs: string[] | null
          budget_range: number[] | null
          created_at: string
          id: string
          language_preference: string | null
          notification_preferences: Json | null
          preferred_pandits: string[] | null
          preferred_services: string[] | null
          preferred_time_slots: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_needs?: string[] | null
          budget_range?: number[] | null
          created_at?: string
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          preferred_pandits?: string[] | null
          preferred_services?: string[] | null
          preferred_time_slots?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_needs?: string[] | null
          budget_range?: number[] | null
          created_at?: string
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          preferred_pandits?: string[] | null
          preferred_services?: string[] | null
          preferred_time_slots?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          expires_at: string | null
          id: string
          payment_method: string | null
          plan_id: string | null
          started_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          started_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          started_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_user: {
        Args: { user_email?: string }
        Returns: boolean
      }
      validate_aadhar_number: {
        Args: { aadhar: string }
        Returns: boolean
      }
      validate_email: {
        Args: { email: string }
        Returns: boolean
      }
      validate_phone_number: {
        Args: { phone: string }
        Returns: boolean
      }
    }
    Enums: {
      user_type: "pandit" | "customer"
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
      user_type: ["pandit", "customer"],
    },
  },
} as const
