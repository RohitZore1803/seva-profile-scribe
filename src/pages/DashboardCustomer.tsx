
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Edit, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import EditCustomerProfileModal from "@/components/EditCustomerProfileModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
}

export default function DashboardCustomer() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched bookings:", bookingsData);
      setBookings(bookingsData || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: any) => {
    if (updateProfile) {
      const result = await updateProfile(updatedProfile);
      if (!result.error) {
        console.log("Profile updated successfully");
      }
    }
    setEditModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString()}`;
  };

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Customer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Manage your bookings and profile here.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border">
                <CardHeader className="text-center pb-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile?.profile_image_url || undefined} />
                      <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {profile?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-foreground">{profile?.name || 'User'}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {profile?.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  
                  {profile?.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-border">
                    <Button 
                      onClick={() => setEditModalOpen(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings Section */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Your Bookings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Track your pooja service bookings and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📅</div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
                      <p className="text-muted-foreground mb-6">Start by booking your first pooja service</p>
                      <Button 
                        onClick={() => window.location.href = '/services'}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Browse Services
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="border border-border hover:shadow-md transition-shadow bg-card">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-lg text-foreground">
                                  {booking.services?.name}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
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
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
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
                                  <span className="font-semibold text-foreground">Price: {formatPrice(booking.services.price)}</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditCustomerProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={handleProfileUpdate}
      />
    </div>
  );
}
