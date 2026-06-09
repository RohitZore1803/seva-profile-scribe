
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import ProfileSummary from "@/components/Credentials/ProfileSummary";
import CredentialsForm, { CredentialsFormValues } from "@/components/Credentials/CredentialsForm";

export default function CredentialsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const { profile, loading: loadingProfile } = useProfile();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/auth?role=customer");
    }
  }, [user, sessionLoading, navigate]);

  const handleSubmit = async (data: CredentialsFormValues) => {
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

    // Allow same-day poojas; only reject ranges where the end date is before the start date.
    if (data.toDate < data.fromDate) {
      toast({
        title: "Invalid Date Range",
        description: "To date cannot be before from date.",
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

      // Convert time string to 24-hour format for database
      const convertTo24Hour = (timeStr: string) => {
        const [time, period] = timeStr.split(' - ')[0].split(' ');
        const [hours, minutes] = time.split(':');
        let hour24 = parseInt(hours);
        
        if (period === 'PM' && hour24 !== 12) {
          hour24 += 12;
        } else if (period === 'AM' && hour24 === 12) {
          hour24 = 0;
        }
        
        return `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
      };

      // Create booking in database with enhanced data
      const bookingData = {
        created_by: user.id,
        service_id: serviceIdAsNumber,
        fromdate: data.fromDate.toISOString(),
        todate: data.toDate.toISOString(),
        location: data.location,
        address: data.address,
        phone: data.phone,
        preferred_time: convertTo24Hour(data.preferredTime),
        duration_hours: data.durationHours,
        special_requirements: data.specialRequirements || null,
        total_amount: existingService.price,
        status: "pending",
        payment_status: "pending",
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

      toast({
        title: "Booking Request Submitted",
        description: (
          <div className="text-left space-y-2">
            <div><strong>Service:</strong> {existingService.name}</div>
            <div><strong>Date:</strong> {format(data.fromDate, "PPP")} to {format(data.toDate, "PPP")}</div>
            <div><strong>Time:</strong> {data.preferredTime}</div>
            <div><strong>Duration:</strong> {data.durationHours} hours</div>
            <div><strong>Location:</strong> {data.location}</div>
            <div className="text-sm text-green-600 mt-2">
              Your request is now visible to available pandits.
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
