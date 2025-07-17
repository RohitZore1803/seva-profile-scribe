
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone, User, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

interface Booking {
  id: string;
  fromdate: string;
  todate: string;
  location: string;
  address: string;
  phone: string;
  status: string;
  total_amount: number;
  created_at: string;
  services: {
    name: string;
    price: number;
  };
  profiles: {
    name: string;
    email: string;
  };
}

export default function PanditCompletedPoojasTable() {
  const { user } = useSession();
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchCompletedBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            services (name, price),
            profiles!inner(name, email)
          `)
          .eq("pandit_id", user.id)
          .eq("status", "completed")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching completed bookings:", error);
          return;
        }

        setCompletedBookings(data || []);
      } catch (error) {
        console.error("Error fetching completed bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedBookings();
  }, [user]);

  const formatPrice = (amount: number) => {
    return `₹${(amount / 100).toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Completed Pooja Services</CardTitle>
          <CardDescription>Your completed pooja bookings and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading completed bookings...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Completed Pooja Services
        </CardTitle>
        <CardDescription>
          Your completed pooja bookings and earnings history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {completedBookings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Completed Services Yet</h3>
            <p className="text-gray-500">Complete your first pooja service to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-orange-800">
                      {booking.services?.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.fromdate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{booking.profiles?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 mb-2">
                      Completed
                    </Badge>
                    <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                      <DollarSign className="w-4 h-4" />
                      {formatPrice(booking.total_amount || booking.services?.price || 0)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
