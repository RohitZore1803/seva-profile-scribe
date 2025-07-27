
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, IndianRupee, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  booking: {
    id: string;
    service_name: string;
    tentative_date: string;
    preferred_time: string;
    location: string;
    address: string;
    total_amount: number;
    services?: {
      name: string;
      price: number;
    };
  };
}

export default function PaymentModal({ open, onClose, booking }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking payment status
      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          payment_method: "card",
          payment_reference: `PAY_${Date.now()}`,
          status: "confirmed"
        })
        .eq("id", booking.id);

      if (error) throw error;

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed and payment processed.",
      });

      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const servicePrice = booking.services?.price || booking.total_amount || 0;
  const formattedPrice = (servicePrice / 100).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{booking.service_name}</CardTitle>
              <CardDescription>Booking Summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{format(new Date(booking.tentative_date), "PPP")}</span>
              </div>
              
              {booking.preferred_time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{booking.preferred_time}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{booking.location}</span>
              </div>
              
              {booking.address && (
                <div className="text-sm text-gray-600 ml-6">
                  {booking.address}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Service Fee</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-medium">{formattedPrice}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  <span>{formattedPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Secure payment via Stripe</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isProcessing ? "Processing..." : `Pay ₹${formattedPrice}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
