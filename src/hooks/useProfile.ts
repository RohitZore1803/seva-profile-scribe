
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export interface Profile {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string | null;
  address?: string | null;
  user_type: 'customer' | 'pandit' | 'admin';
  expertise?: string | null;
  aadhar_number?: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching profile:", error);
        }
        setProfile(data || null);
        setLoading(false);
      });
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { error };
    }

    setProfile(data);
    return { data };
  };

  return { profile, loading, updateProfile };
}
