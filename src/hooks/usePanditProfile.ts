
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { Profile } from "./useProfile";

export interface PanditProfile extends Profile {
  expertise: string;
  aadhar_number: string;
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
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .eq("user_type", "pandit")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching pandit profile:", error);
        }
        if (data) {
          setProfile(data as PanditProfile);
        }
        setLoading(false);
      });
  }, [user]);

  return { profile, loading };
}
