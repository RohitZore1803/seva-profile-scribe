
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description?: string;
}

export default function PaymentModal({ isOpen, onClose, amount, title, description }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate UPI payment link
      const upiLink = `upi://pay?pa=rzore430@oksbi&pn=E-Guruji&am=${amount}&cu=INR&tn=${encodeURIComponent(title)}`;
      
      // Open UPI app or show payment instructions
      if (paymentMethod === 'upi') {
        window.location.href = upiLink;
      }
      
      toast({
        title: "Payment Initiated",
        description: "Please complete the payment in your UPI app",
      });
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold">{title}</h3>
              {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
              <div className="text-2xl font-bold text-orange-600 mt-2">₹{amount}</div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('upi')}
                className="flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                UPI
              </Button>
              
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Card
              </Button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="space-y-2">
                <Label htmlFor="upi">UPI ID (Optional)</Label>
                <Input
                  id="upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="your-upi@app"
                />
                <p className="text-xs text-gray-500">
                  Payment will be made to: rzore430@oksbi
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Card payments will redirect to secure payment gateway
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isProcessing ? "Processing..." : `Pay ₹${amount}`}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
