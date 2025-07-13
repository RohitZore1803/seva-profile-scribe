// src/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
const supabaseUrl = 'https://oftrrhwbxmiwrtuzpzmu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJyaHdieG1pd3J0dXpwem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODcwODUsImV4cCI6MjA2NTQ2MzA4NX0.8dl_ro7_6R7LoU5lLlNg8Fwi-uOGKDjEoyRtUp4DnWg'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Optional: Add type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          created_by: string
          pandit_id: string | null
          service_id: number | null
          tentative_date: string | null
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
          tentative_date?: string | null
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
          tentative_date?: string | null
          status?: string | null
          location?: string | null
          address?: string | null
          created_at?: string
          assigned_at?: string | null
        }
      }
      // Add other tables as needed
    }
  }
}