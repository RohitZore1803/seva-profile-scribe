
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export interface PanditProfile {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string | null;
  address: string;
  expertise: string;
  aadhar_number: string;
  created_at: string;
}

export function usePanditProfile() {
  const { user } = useSession();
  const [profile, setProfile] = useState<PanditProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    supabase
      .from("pandit_profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data || null);
        setLoading(false);
      });
  }, [user]);

  return { profile, loading };
}
