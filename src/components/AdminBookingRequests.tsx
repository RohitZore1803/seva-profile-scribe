import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  service_id: number;
  fromdate: string;
  todate: string;
  status: string;
  location: string;
  address: string;
  phone: string;
  created_at: string;
  services: {
    name: string;
    price: number;
  };
  profiles: {
    name: string;
    email: string;
  } | null;
}

export default function AdminBookingRequests() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select(`
          *,
          services (
            name,
            price
          ),
          profiles!bookings_created_by_fkey (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to handle potential join errors
      const transformedData = (bookingsData || []).map((booking: any) => ({
        ...booking,
        services: booking.services || { name: "Unknown Service", price: 0 },
        profiles: booking.profiles || { name: "Unknown Customer", email: "N/A" }
      }));
      
      setBookings(transformedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-800">All Booking Requests</CardTitle>
        <CardDescription className="text-orange-600">
          Monitor and manage all customer bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">No Bookings</h3>
            <p className="text-orange-600">No booking requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border border-orange-200 hover:shadow-md transition-shadow bg-white/60">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-orange-800">
                        {booking.services?.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-orange-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.fromdate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(booking.fromdate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status?.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-orange-600">
                    {booking.profiles && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{booking.profiles.name || "Unknown"} ({booking.profiles.email || "N/A"})</span>
                      </div>
                    )}
                    {booking.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.location}</span>
                      </div>
                    )}
                    {booking.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{booking.phone}</span>
                      </div>
                    )}
                    {booking.services?.price && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-orange-800">Price: {formatPrice(booking.services.price)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}