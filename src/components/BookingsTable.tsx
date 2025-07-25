
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, X, User, Calendar, MapPin, Phone, Clock, IndianRupee } from "lucide-react";

interface BookingTableProps {
  bookings: any[];
  loading: boolean;
  role?: string;
  onAcceptBooking?: (id: string) => void;
  onRejectBooking?: (id: string) => void;
  showActions?: boolean;
}

export default function BookingsTable({ 
  bookings, 
  loading, 
  role, 
  onAcceptBooking, 
  onRejectBooking,
  showActions = false 
}: BookingTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rejected":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(`2000-01-01T${timeString}`), "p");
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="font-semibold text-blue-800">Customer</TableHead>
            <TableHead className="font-semibold text-blue-800">Service</TableHead>
            <TableHead className="font-semibold text-blue-800">Date & Time</TableHead>
            <TableHead className="font-semibold text-blue-800">Location</TableHead>
            <TableHead className="font-semibold text-blue-800">Status</TableHead>
            {role === "pandit" && showActions && (
              <TableHead className="font-semibold text-blue-800">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-blue-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">
                      {booking.customer_name || booking.customer_profile?.name || "Unknown Customer"}
                    </div>
                    <div className="text-sm text-blue-600">
                      {booking.customer_email || booking.customer_profile?.email || "N/A"}
                    </div>
                    {booking.phone && (
                      <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                        <Phone className="w-3 h-3" />
                        {booking.phone}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="font-medium text-blue-900">
                  {booking.service_name || booking.service?.name || "Unknown Service"}
                </div>
                <div className="text-sm text-blue-600">
                  {booking.duration_hours && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {booking.duration_hours} hours
                    </div>
                  )}
                  {booking.total_amount && (
                    <div className="flex items-center gap-1 mt-1">
                      <IndianRupee className="w-3 h-3" />
                      {booking.total_amount}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">
                      {formatDate(booking.tentative_date || booking.fromdate)}
                    </div>
                    {booking.preferred_time && (
                      <div className="text-sm text-blue-600">
                        {formatTime(booking.preferred_time)}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">
                      {booking.location || "Not specified"}
                    </div>
                    {booking.address && (
                      <div className="text-sm text-blue-600 max-w-xs truncate">
                        {booking.address}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status?.toUpperCase() || "UNKNOWN"}
                </Badge>
                {booking.pandit_name && (
                  <div className="text-xs text-blue-600 mt-1">
                    Assigned to: {booking.pandit_name}
                  </div>
                )}
              </TableCell>
              
              {role === "pandit" && showActions && booking.status === "pending" && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAcceptBooking?.(booking.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRejectBooking?.(booking.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
