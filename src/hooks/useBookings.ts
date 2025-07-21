
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  created_by: string;
  pandit_id: string | null;
  service_id: number | null;
  fromdate: string;
  todate: string;
  status: string;
  location: string | null;
  address: string | null;
  phone: string | null;
  special_requirements: string | null;
  payment_status: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  invoice_number: string | null;
  total_amount: number | null;
  duration_hours: number | null;
  preferred_time: string | null;
  booking_notes: string | null;
  notification_sent_at: string | null;
  created_at: string;
  assigned_at: string | null;
  services?: {
    name: string;
    price: number;
  } | null;
  profiles?: {
    name: string;
    email: string;
  } | null;
}

export function useBookings() {
  const { user } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          services:service_id (name, price),
          profiles:created_by (name, email)
        `)
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive",
        });
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error("Error in fetchBookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Partial<Booking>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a booking",
        variant: "destructive",
      });
      return { error: "Not authenticated" };
    }

    try {
      console.log("Creating booking with data:", bookingData);
      
      const { data, error } = await supabase
        .from("bookings")
        .insert([{
          ...bookingData,
          created_by: user.id,
          status: 'pending',
          payment_status: 'pending',
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating booking:", error);
        toast({
          title: "Booking Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      console.log("Booking created successfully:", data);
      toast({
        title: "Booking Created",
        description: "Your booking has been submitted successfully!",
      });
      
      // Refresh bookings list
      fetchBookings();
      
      return { data };
    } catch (error) {
      console.error("Error in createBooking:", error);
      toast({
        title: "Booking Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error: "Unexpected error" };
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id)
        .eq("created_by", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating booking:", error);
        return { error: error.message };
      }

      toast({
        title: "Booking Updated",
        description: "Your booking has been updated successfully!",
      });
      
      fetchBookings();
      return { data };
    } catch (error) {
      console.error("Error in updateBooking:", error);
      return { error: "Unexpected error" };
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  return {
    bookings,
    loading,
    fetchBookings,
    createBooking,
    updateBooking,
  };
}
