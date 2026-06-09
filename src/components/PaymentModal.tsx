
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, IndianRupee, CreditCard, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  booking: {
    id: string;
    service_name: string;
    fromdate: string;
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
  const [referenceNumber, setReferenceNumber] = useState("");

  const servicePrice = booking.total_amount || 0;
  const formattedPrice = servicePrice.toFixed(2);
  const upiId = "rzore430@oksbi";

  // Generate UPI URL for QR Code
  // upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR
  const upiUrl = `upi://pay?pa=${upiId}&pn=EGuruJi&am=${formattedPrice}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  const handlePaymentSubmit = async () => {
    if (!referenceNumber.trim()) {
      toast({
        title: "Reference Number Required",
        description: "Please enter the UPI transaction reference number/UTR to confirm your payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Update booking with payment information
      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: "pending_verification",
          payment_method: "upi",
          payment_reference: referenceNumber.trim()
        })
        .eq("id", booking.id);

      if (error) throw error;

      toast({
        title: "Payment Details Submitted",
        description: "Your payment reference has been recorded. We will verify and confirm your booking soon.",
      });

      onClose();
    } catch (error) {
      console.error("Payment submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error saving your payment details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-orange-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-900">
            <CreditCard className="w-5 h-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Details */}
          <Card className="border-orange-200 bg-white/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-900">{booking.service_name}</CardTitle>
              <CardDescription className="text-orange-600">Booking Summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>{format(new Date(booking.fromdate), "PPP")}</span>
              </div>

              {booking.preferred_time && (
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{booking.preferred_time}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-orange-700">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{booking.location}</span>
              </div>

              {booking.address && (
                <div className="text-sm text-orange-600 ml-6">
                  {booking.address}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className="border-orange-200 bg-white/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-900">Payment Summary</CardTitle>
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

          {/* Payment Method - UPI QR */}
          <Card className="border-orange-200 bg-white/90">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="text-lg text-orange-900">Scan & Pay with any UPI App</CardTitle>
              <CardDescription className="text-orange-600">Pay exactly INR {formattedPrice} via PhonePe, GPay, Paytm, etc.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 border rounded-xl shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-orange-600">UPI ID</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-orange-600 font-bold">{upiId}</code>
              </div>

              <Alert variant="default" className="bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-xs text-center">
                  After paying, capture the Transaction ID/Reference Number and enter it below to confirm.
                </AlertDescription>
              </Alert>

              <div className="w-full space-y-2 mt-2">
                <Label htmlFor="ref" className="text-orange-900">Transaction Reference / UTR Number</Label>
                <Input
                  id="ref"
                  placeholder="Enter 12-digit UTR number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="border-orange-200 focus-visible:ring-orange-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 border-orange-200 text-orange-800 hover:bg-orange-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={isProcessing || !referenceNumber}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isProcessing ? "Verifying..." : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
