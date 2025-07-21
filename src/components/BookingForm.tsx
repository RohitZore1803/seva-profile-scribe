
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, Phone, FileText } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";

interface Service {
  id: number;
  name: string;
  price: number | null;
  duration_hours: number | null;
}

interface BookingFormProps {
  service: Service;
  onSuccess?: () => void;
}

export default function BookingForm({ service, onSuccess }: BookingFormProps) {
  const { createBooking } = useBookings();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fromdate: "",
    todate: "",
    preferred_time: "",
    location: "",
    address: "",
    phone: "",
    special_requirements: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting booking form with data:", formData);
      
      const bookingData = {
        service_id: service.id,
        fromdate: new Date(formData.fromdate).toISOString(),
        todate: new Date(formData.todate).toISOString(),
        preferred_time: formData.preferred_time || null,
        location: formData.location,
        address: formData.address,
        phone: formData.phone,
        special_requirements: formData.special_requirements || null,
        total_amount: service.price,
        duration_hours: service.duration_hours || 2,
      };

      const result = await createBooking(bookingData);
      
      if (!result.error) {
        // Reset form
        setFormData({
          fromdate: "",
          todate: "",
          preferred_time: "",
          location: "",
          address: "",
          phone: "",
          special_requirements: "",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Book {service.name}
        </CardTitle>
        <CardDescription>
          Fill in the details below to book this pooja service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromdate">Start Date & Time</Label>
              <Input
                id="fromdate"
                type="datetime-local"
                value={formData.fromdate}
                onChange={(e) => handleInputChange("fromdate", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="todate">End Date & Time</Label>
              <Input
                id="todate"
                type="datetime-local"
                value={formData.todate}
                onChange={(e) => handleInputChange("todate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_time">Preferred Time (Optional)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="preferred_time"
                type="time"
                value={formData.preferred_time}
                onChange={(e) => handleInputChange("preferred_time", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/City</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="location"
                placeholder="Enter city or area"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              placeholder="Enter complete address with landmarks"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requirements">Special Requirements (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Textarea
                id="special_requirements"
                placeholder="Any specific requirements or instructions"
                value={formData.special_requirements}
                onChange={(e) => handleInputChange("special_requirements", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {service.price && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Service Fee:</span>
                <span className="text-xl font-bold text-orange-600">
                  ₹{service.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Duration: {service.duration_hours || 2} hours
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Book Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
