import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle, Clock, CreditCard, Edit, Mail, MapPin, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStats from "@/components/DashboardStats";
import EditCustomerProfileModal from "@/components/EditCustomerProfileModal";
import PaymentModal from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useSession } from "@/hooks/useSession";

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
  preferred_time: string;
  service_name: string;
  total_amount: number;
  payment_status: string;
  services: {
    name: string;
    price: number;
  };
}

export default function DashboardCustomer() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchBookings = useCallback(async () => {
    try {
      if (!user) return;

      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select(`
          *,
          services (
            name,
            price
          )
        `)
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedBookings: Booking[] = (bookingsData || []).map((booking: any) => ({
        ...booking,
        service_name: booking.services?.name || "Unknown Service",
        payment_status: booking.payment_status || "pending",
      }));

      setBookings(transformedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      navigate("/auth?role=customer", { replace: true });
      return;
    }
    fetchBookings();
  }, [fetchBookings, navigate, sessionLoading, user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, [fetchBookings, user]);

  const handleProfileUpdate = async (updatedProfile: any) => {
    if (updateProfile) {
      await updateProfile(updatedProfile);
    }
    setEditModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/", { replace: true });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
      case "booked":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => `INR ${price.toLocaleString()}`;

  const normalizedStatus = (status: string) => {
    const value = status?.toLowerCase();
    return value === "booked" ? "confirmed" : value;
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => normalizedStatus(booking.status) === activeFilter);

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((booking) => normalizedStatus(booking.status) === "pending").length,
    confirmedBookings: bookings.filter((booking) => normalizedStatus(booking.status) === "confirmed").length,
    completedBookings: bookings.filter((booking) => normalizedStatus(booking.status) === "completed").length,
  };

  if (sessionLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-orange-800">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="pt-8 px-5 pb-10">
        <DashboardHeader
          title="Customer Dashboard"
          subtitle="Welcome back! Manage your bookings and profile here."
          profile={{
            name: profile?.name || "Customer",
            email: profile?.email,
            profile_image_url: profile?.profile_image_url,
          }}
          role="Customer"
          onLogout={handleLogout}
          showBookButton
          onBookNow={() => navigate("/services")}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-orange-200">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={profile?.profile_image_url || undefined} />
                  <AvatarFallback className="text-2xl font-bold bg-orange-100 text-orange-800">
                    {profile?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg text-orange-800">{profile?.name || "Customer"}</h3>
                <p className="text-sm text-orange-600">Customer</p>
              </div>

              <div className="space-y-3">
                {profile?.email && (
                  <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{profile.email}</span>
                  </div>
                )}

                {profile?.phone && (
                  <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}

                {profile?.address && (
                  <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{profile.address}</span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Profile</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Active</span>
                </div>

                <Button
                  onClick={() => setEditModalOpen(true)}
                  variant="outline"
                  className="w-full flex items-center gap-2 hover:scale-105 transition-transform border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <DashboardStats stats={stats} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-orange-200">
              <div className="px-6 py-4 border-b bg-orange-50">
                <h2 className="text-xl font-semibold text-orange-800">
                  {activeFilter === "all"
                    ? "Your Bookings"
                    : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
                </h2>
                <p className="text-sm text-orange-600 mt-1">
                  Track your pooja service bookings and payment status
                </p>
              </div>

              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-orange-800 mb-2">No Bookings Yet</h3>
                    <p className="text-orange-600 mb-6">Start by booking your first pooja service</p>
                    <Button onClick={() => navigate("/services")} className="bg-orange-600 hover:bg-orange-700 text-white">
                      Browse Services
                    </Button>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-orange-800 mb-2">No {activeFilter} bookings</h3>
                    <p className="text-orange-600">Try another filter to see your bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <Card
                        key={booking.id}
                        className="border border-orange-200 hover:shadow-md transition-shadow bg-white/70"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                              <h4 className="font-semibold text-lg text-orange-800">
                                {booking.service_name || booking.services?.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-orange-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(booking.fromdate).toLocaleDateString()}</span>
                                </div>
                                {booking.preferred_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{booking.preferred_time}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStatusColor(booking.status)}>{booking.status?.toUpperCase()}</Badge>
                              <Badge className={getPaymentStatusColor(booking.payment_status)}>
                                {booking.payment_status?.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-orange-600">
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
                                <span className="font-semibold text-orange-800">
                                  Price: {formatPrice(booking.services.price)}
                                </span>
                              </div>
                            )}
                          </div>

                          {(booking.status === "booked" || booking.status === "confirmed") &&
                            booking.payment_status === "pending" && (
                              <div className="mt-4 pt-4 border-t border-orange-200">
                                <Button
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setPaymentModalOpen(true);
                                  }}
                                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Pay Now - {formatPrice(booking.services?.price || booking.total_amount || 0)}
                                </Button>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditCustomerProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={handleProfileUpdate}
      />

      {selectedBooking && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedBooking(null);
            fetchBookings();
          }}
          booking={selectedBooking}
        />
      )}
    </div>
  );
}
