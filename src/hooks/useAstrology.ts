
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
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('astrology_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching astrology profile:", profileError);
        return;
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching astrology profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('astrology_consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching consultations:", error);
        return;
      }
      
      setConsultations(data || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const createOrUpdateProfile = async (profileData: Partial<AstrologyProfile>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your astrology profile",
        variant: "destructive",
      });
      return;
    }

    if (!profileData.birth_date || !profileData.birth_place) {
      toast({
        title: "Missing Information",
        description: "Birth date and place are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const dataToUpsert = {
        user_id: user.id,
        birth_date: profileData.birth_date,
        birth_place: profileData.birth_place,
        birth_time: profileData.birth_time || null,
        latitude: profileData.latitude || null,
        longitude: profileData.longitude || null,
        zodiac_sign: profileData.zodiac_sign || null,
        moon_sign: profileData.moon_sign || null,
        rising_sign: profileData.rising_sign || null,
        updated_at: new Date().toISOString(),
      };

      console.log("Saving astrology profile:", dataToUpsert);

      const { data, error } = await supabase
        .from('astrology_profiles')
        .upsert(dataToUpsert, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving astrology profile:", error);
        toast({
          title: "Save Failed",
          description: error.message || "Failed to save astrology profile",
          variant: "destructive",
        });
        return;
      }

      console.log("Astrology profile saved successfully:", data);
      setProfile(data);
      
      toast({
        title: "Profile Saved",
        description: "Your astrology profile has been saved successfully!",
      });
      
      return data;
    } catch (error) {
      console.error("Error updating astrology profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookConsultation = async (consultationData: Partial<AstrologyConsultation>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a consultation",
        variant: "destructive",
      });
      return;
    }

    if (!consultationData.consultation_type || !consultationData.price) {
      toast({
        title: "Missing Information",
        description: "Consultation type and price are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const dataToInsert = {
        user_id: user.id,
        consultation_type: consultationData.consultation_type,
        price: consultationData.price,
        duration_minutes: consultationData.duration_minutes || 30,
        status: 'pending',
        scheduled_at: consultationData.scheduled_at || null,
        notes: consultationData.notes || null,
      };

      const { data, error } = await supabase
        .from('astrology_consultations')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error("Error booking consultation:", error);
        toast({
          title: "Booking Failed",
          description: error.message || "Failed to book consultation",
          variant: "destructive",
        });
        return;
      }

      setConsultations(prev => [data, ...prev]);
      toast({
        title: "Consultation Booked",
        description: "Your consultation has been booked successfully!",
      });
      
      return data;
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while booking your consultation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAstrologicalSummary = (profile: AstrologyProfile) => {
    const birthDate = new Date(profile.birth_date);
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
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
      moon_sign: zodiacSign,
      rising_sign: zodiacSign,
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
