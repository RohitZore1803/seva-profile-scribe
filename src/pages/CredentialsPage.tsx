
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import ProfileSummary from "@/components/Credentials/ProfileSummary";
import CredentialsForm, { CredentialsFormValues } from "@/components/Credentials/CredentialsForm";

export default function CredentialsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const { profile, loading: loadingProfile } = useCustomerProfile();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/auth?role=customer");
    }
  }, [user, sessionLoading, navigate]);

  const handleSubmit = async (data: CredentialsFormValues) => {
    console.log('[Booking DEBUG] Starting booking submission');
    console.log('[Booking DEBUG] Form data:', data);

    if (!user || !user.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Invalid Service",
        description: "No service ID found.",
        variant: "destructive",
      });
      return;
    }

    if (!data.fromDate || !data.toDate) {
      toast({
        title: "Dates Required",
        description: "Please provide both from and to dates.",
        variant: "destructive",
      });
      return;
    }

    // Validate that toDate is after fromDate
    if (data.toDate <= data.fromDate) {
      toast({
        title: "Invalid Date Range",
        description: "To date must be after from date.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convert service ID to integer for database lookup
      const serviceIdAsNumber = parseInt(id, 10);
      if (isNaN(serviceIdAsNumber)) {
        throw new Error("Invalid service ID");
      }

      // Verify service exists using integer ID
      const { data: existingService, error: serviceError } = await supabase
        .from("services")
        .select("id, name, price")
        .eq("id", serviceIdAsNumber)
        .single();

      if (serviceError || !existingService) {
        console.error('[Service lookup error]:', serviceError);
        throw new Error("Service not found");
      }

      console.log('[Booking DEBUG] Creating booking in database');

      // Create booking in database with enhanced data
      const bookingData = {
        created_by: user.id,
        service_id: serviceIdAsNumber,
        fromdate: data.fromDate.toISOString(),
        todate: data.toDate.toISOString(),
        location: data.location,
        address: data.address,
        phone: data.phone,
        preferred_time: data.preferredTime,
        duration_hours: data.durationHours,
        special_requirements: data.specialRequirements || null,
        total_amount: existingService.price,
        status: "pending",
      };

      const { data: newBooking, error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) {
        console.error('[Booking creation error]:', bookingError);
        throw new Error(`Failed to create booking: ${bookingError.message}`);
      }

      console.log('[Booking DEBUG] Booking created successfully:', newBooking);

      // Store in localStorage for cross-dashboard display
      const bookingDetails = {
        id: newBooking.id,
        service_name: existingService.name,
        service_id: serviceIdAsNumber,
        customer_name: profile?.name || user.email,
        customer_email: user.email,
        from_date: format(data.fromDate, "yyyy-MM-dd"),
        to_date: format(data.toDate, "yyyy-MM-dd"),
        preferred_time: data.preferredTime,
        duration_hours: data.durationHours,
        location: data.location,
        address: data.address,
        phone: data.phone,
        special_requirements: data.specialRequirements,
        total_amount: existingService.price,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // Store in localStorage
      const existingBookings = JSON.parse(localStorage.getItem('recentBookings') || '[]');
      existingBookings.unshift(bookingDetails);
      // Keep only last 10 bookings
      localStorage.setItem('recentBookings', JSON.stringify(existingBookings.slice(0, 10)));

      toast({
        title: "🎉 Booking Confirmed Successfully!",
        description: (
          <div className="text-left space-y-2">
            <div><strong>Service:</strong> {existingService.name}</div>
            <div><strong>Date:</strong> {format(data.fromDate, "PPP")} to {format(data.toDate, "PPP")}</div>
            <div><strong>Time:</strong> {data.preferredTime}</div>
            <div><strong>Duration:</strong> {data.durationHours} hours</div>
            <div><strong>Location:</strong> {data.location}</div>
            <div className="text-sm text-green-600 mt-2">
              📧 Confirmation details sent to your email
            </div>
          </div>
        ),
      });

      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 2000);

    } catch (error: any) {
      console.error('[Booking submission error]:', error);
      toast({
        title: "Error submitting booking",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ProfileSummary profile={profile} loading={loadingProfile} />
        <div className="mt-8">
          <CredentialsForm onSubmit={handleSubmit} loading={loading} serviceId={id} />
        </div>
      </div>
    </div>
  );
}
