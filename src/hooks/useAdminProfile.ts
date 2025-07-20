
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export function useAdminProfile() {
  const { user } = useSession();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching admin profile:", error);
        }
        if (data) {
          setProfile(data as AdminProfile);
        }
        setLoading(false);
      });
  }, [user]);

  const updateProfile = async (updates: Partial<AdminProfile>) => {
    if (!user || !profile) return;
    
    const { data, error } = await supabase
      .from("admin_profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating admin profile:", error);
      return { error };
    }

    if (data) {
      setProfile(data as AdminProfile);
    }
    return { data };
  };

  return { profile, loading, updateProfile };
}
