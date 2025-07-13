
// src/supabase.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ltmomvttmykajbokqmhm.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJyaHdieG1pd3J0dXpwem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODcwODUsImV4cCI6MjA2NTQ2MzA4NX0.8dl_ro7_6R7LoU5lLlNg8Fwi-uOGKDjEoyRtUp4DnWg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export type Database = {
  public: {
    Tables: {
      customer_profiles: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          profile_image_url?: string | null
          address?: string | null
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          email: string
          profile_image_url?: string | null
          address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          profile_image_url?: string | null
          address?: string | null
        }
      }
      pandit_profiles: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          profile_image_url?: string | null
          address: string
          expertise: string
          aadhar_number: string
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          email: string
          profile_image_url?: string | null
          address: string
          expertise: string
          aadhar_number: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          profile_image_url?: string | null
          address?: string
          expertise?: string
          aadhar_number?: string
        }
      }
      bookings: {
        Row: {
          id: string
          created_by: string
          pandit_id: string | null
          service_id: number | null
          fromdate: string | null
          todate: string | null
          status: string | null
          location: string | null
          address: string | null
          created_at: string
          assigned_at: string | null
        }
        Insert: {
          id?: string
          created_by: string
          pandit_id?: string | null
          service_id?: number | null
          fromdate?: string | null
          todate?: string | null
          status?: string | null
          location?: string | null
          address?: string | null
          created_at?: string
          assigned_at?: string | null
        }
        Update: {
          id?: string
          created_by?: string
          pandit_id?: string | null
          service_id?: number | null
          fromdate?: string | null
          todate?: string | null
          status?: string | null
          location?: string | null
          address?: string | null
          created_at?: string
          assigned_at?: string | null
        }
      }
      services: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number | null
          created_at?: string
        }
      }
    }
  }
}
