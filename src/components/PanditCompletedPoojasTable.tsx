
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Booking {
  id: string;
  fromdate: string;
  todate: string;
  status: string;
  location: string;
  address: string;
  services: {
    name: string;
  } | null;
  profiles: {
    name: string;
    email: string;
  } | null;
}

interface PanditCompletedPoojasTableProps {
  panditId: string;
}

export default function PanditCompletedPoojasTable({ panditId }: PanditCompletedPoojasTableProps) {
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            services:service_id (name),
            profiles:created_by (name, email)
          `)
          .eq("pandit_id", panditId)
          .eq("status", "completed")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching completed bookings:", error);
          return;
        }

        // Transform the data to match our interface
        const transformedData = (data || []).map(booking => ({
          ...booking,
          services: booking.services ? { name: booking.services.name } : null,
          profiles: booking.profiles ? { 
            name: booking.profiles.name, 
            email: booking.profiles.email 
          } : null
        }));

        setCompletedBookings(transformedData);
      } catch (error) {
        console.error("Error in fetchCompletedBookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (panditId) {
      fetchCompletedBookings();
    }
  }, [panditId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (completedBookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No completed poojas yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {completedBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.services?.name || "Unknown Service"}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.profiles?.name || "Unknown Customer"}</div>
                  <div className="text-sm text-gray-500">{booking.profiles?.email}</div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(booking.fromdate), "PPP")}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.location}</div>
                  <div className="text-sm text-gray-500">{booking.address}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {booking.status.toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
