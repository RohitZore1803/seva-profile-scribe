
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EditPanditProfileModal from "@/components/EditPanditProfileModal";
import PanditCompletedPoojasTable from "@/components/PanditCompletedPoojasTable";
import { Edit, Award, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStats from "@/components/DashboardStats";
import BookingsTable from "@/components/BookingsTable";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPandit() {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [assignedBookings, setAssignedBookings] = useState<any[]>([]);
  const [localBookings, setLocalBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Handle authentication state changes
  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      navigate("/auth?role=pandit", { replace: true });
      return;
    }

    setInitialLoad(false);
  }, [user, sessionLoading, navigate]);

  // Load profile when user is confirmed
  useEffect(() => {
    if (sessionLoading || !user || initialLoad) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
        } else {
          console.error('Profile not found:', error);
        }
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, sessionLoading, initialLoad]);

  // Load bookings when user is confirmed
  useEffect(() => {
    if (sessionLoading || !user || initialLoad) return;

    const fetchPendingBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            profiles:created_by (*),
            services:service_id (*)
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) {
          console.error('Error fetching pending bookings:', error);
          return;
        }

        if (data) {
          console.log(`[PanditDashboard] Found ${data.length} pending bookings`);
          const mapped = data.map((row: any) => ({
            ...row,
            customer_profile: row.profiles,
            service: row.services,
          }));
          setLocalBookings(mapped);
        }
      } catch (error) {
        console.error('Error loading pending bookings:', error);
      }
    };

    const fetchAssignedBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            profiles:created_by (*),
            services:service_id (*)
          `)
          .eq("pandit_id", user.id)
          .in("status", ["assigned", "confirmed", "completed"])
          .order("created_at", { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          return;
        }

        if (data) {
          const mapped = data.map((row: any) => ({
            ...row,
            customer_profile: row.profiles,
            service: row.services,
          }));
          setAssignedBookings(mapped);
        }
      } catch (error) {
        console.error('Booking load error:', error);
      }
    };

    fetchPendingBookings();
    fetchAssignedBookings();

    // Set up interval to check for new bookings
    const interval = setInterval(() => {
      fetchPendingBookings();
      fetchAssignedBookings();
    }, 5000); // 5s polling for more real-time response
    return () => clearInterval(interval);
  }, [user, sessionLoading, initialLoad]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          pandit_id: user.id,
          assigned_at: new Date().toISOString()
        })
        .eq("id", bookingId)
        .eq("status", "pending")
        .is("pandit_id", null);

      if (error) throw error;

      // Update local state
      setLocalBookings(prev => prev.filter(b => b.id !== bookingId));

      // Refresh assigned bookings to show the new one
      const { data: newBooking } = await supabase
        .from("bookings")
        .select(`*, profiles:created_by (*), services:service_id (*)`)
        .eq("id", bookingId)
        .single();

      if (newBooking) {
        setAssignedBookings(prev => [{
          ...newBooking,
          customer_profile: newBooking.profiles,
          service: newBooking.services,
        }, ...prev]);
      }

      toast({
        title: "Success",
        description: "Booking accepted successfully",
      });
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast({
        title: "Error",
        description: "Failed to accept booking",
        variant: "destructive",
      });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" }) // Standard cancelled status for rejected
        .eq("id", bookingId)
        .eq("status", "pending")
        .is("pandit_id", null);

      if (error) throw error;

      // Remove from local bookings (pending list)
      setLocalBookings(prev => prev.filter(b => b.id !== bookingId));

      toast({
        title: "Success",
        description: "Booking rejected successfully",
      });
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdated = (updated: any) => {
    setProfile(updated);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/", { replace: true });
    }
  };

  if (sessionLoading || initialLoad || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center text-orange-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalBookings: localBookings.length + assignedBookings.length,
    pendingBookings: localBookings.length,
    confirmedBookings: assignedBookings.filter(b => b.status === "confirmed").length,
    completedBookings: assignedBookings.filter(b => b.status === "completed").length,
  };

  // Show local bookings for pending requests and database bookings for accepted ones
  const allBookings = [...localBookings, ...assignedBookings];
  const filteredBookings = activeFilter === "all"
    ? allBookings
    : activeFilter === "pending"
      ? localBookings
      : assignedBookings.filter(booking => booking.status === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="pt-8 px-5 pb-10">
        <DashboardHeader
          title="Pandit Dashboard"
          subtitle="Manage your assigned bookings and profile information"
          profile={{
            name: profile.name,
            email: user.email,
            profile_image_url: profile.profile_image_url
          }}
          role="Pandit"
          onLogout={handleLogout}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-orange-200">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={profile.profile_image_url || undefined} />
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg text-orange-800">{profile.name}</h3>
                <p className="text-sm text-orange-600">Pandit</p>
                {profile.expertise && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-orange-600">{profile.expertise}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Verified</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    profile.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.is_verified ? 'Yes' : 'Pending'}
                  </span>
                </div>

                <Button
                  onClick={() => setOpenEditModal(true)}
                  variant="outline"
                  className="w-full flex items-center gap-2 hover:scale-105 transition-transform border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <DashboardStats
              stats={stats}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden mb-8 border border-orange-200">
                <div className="px-6 py-4 border-b bg-orange-50">
                  <h2 className="text-xl font-semibold text-orange-800">
                    {activeFilter === "pending" ? "New Booking Requests" :
                     activeFilter === "all" ? "All Bookings" :
                     `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
                  </h2>
                  <p className="text-sm text-orange-600 mt-1">
                    {activeFilter === "pending" ? "Accept or reject new customer requests" :
                     "Manage your bookings and customer requests"}
                  </p>
                </div>

                <BookingsTable
                  bookings={filteredBookings}
                  loading={false}
                  role="pandit"
                  onAcceptBooking={handleAcceptBooking}
                  onRejectBooking={handleRejectBooking}
                  showActions={activeFilter === "pending" || activeFilter === "all"}
                />
              </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-orange-200">
              <div className="px-6 py-4 border-b bg-orange-50">
                <h2 className="text-xl font-semibold text-orange-800">Completed Poojas</h2>
                <p className="text-sm text-orange-600 mt-1">
                  Your completed ceremony history
                </p>
              </div>
              <PanditCompletedPoojasTable panditId={user.id} />
            </div>
          </div>
        </div>

        <EditPanditProfileModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    </div>
  );
}
