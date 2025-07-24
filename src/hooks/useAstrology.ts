
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/hooks/use-toast";

export interface AstrologyProfile {
  id: string;
  user_id: string;
  birth_date: string;
  birth_time?: string;
  birth_place: string;
  latitude?: number;
  longitude?: number;
  zodiac_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  created_at: string;
  updated_at: string;
}

export interface AstrologyConsultation {
  id: string;
  user_id: string;
  astrologer_id?: string;
  consultation_type: string;
  scheduled_at?: string;
  duration_minutes: number;
  price: number;
  status: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  created_at: string;
}

export function useAstrology() {
  const { user } = useSession();
  const [profile, setProfile] = useState<AstrologyProfile | null>(null);
  const [consultations, setConsultations] = useState<AstrologyConsultation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAstrologyProfile();
      fetchConsultations();
    }
  }, [user]);

  const fetchAstrologyProfile = async () => {
    if (!user) return;

    try {
      // Use proper table name with correct typing
      const { data, error } = await supabase
        .from("astrology_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching astrology profile:", error);
    }
  };

  const fetchConsultations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("astrology_consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateProfile = async (profileData: Partial<AstrologyProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("astrology_profiles")
        .upsert({
          ...profileData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast({
        title: "Success",
        description: "Astrology profile updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error("Error updating astrology profile:", error);
      toast({
        title: "Error",
        description: "Failed to update astrology profile",
        variant: "destructive",
      });
    }
  };

  const bookConsultation = async (consultationData: Partial<AstrologyConsultation>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("astrology_consultations")
        .insert({
          ...consultationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setConsultations(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Consultation booked successfully",
      });
      
      return data;
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast({
        title: "Error",
        description: "Failed to book consultation",
        variant: "destructive",
      });
    }
  };

  const generateAstrologicalSummary = (profile: AstrologyProfile) => {
    // Simple astrological summary generation based on birth date
    const birthDate = new Date(profile.birth_date);
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // Determine zodiac sign
    let zodiacSign = "";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiacSign = "Aries";
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiacSign = "Taurus";
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiacSign = "Gemini";
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiacSign = "Cancer";
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiacSign = "Leo";
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiacSign = "Virgo";
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiacSign = "Libra";
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiacSign = "Scorpio";
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiacSign = "Sagittarius";
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiacSign = "Capricorn";
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiacSign = "Aquarius";
    else zodiacSign = "Pisces";
    
    return {
      zodiac_sign: zodiacSign,
      moon_sign: zodiacSign, // Simplified for demo
      rising_sign: zodiacSign, // Simplified for demo
    };
  };

  return {
    profile,
    consultations,
    loading,
    createOrUpdateProfile,
    bookConsultation,
    fetchAstrologyProfile,
    fetchConsultations,
    generateAstrologicalSummary,
  };
}
