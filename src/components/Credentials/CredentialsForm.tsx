
import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, Clock, Phone, MapPin, FileText } from "lucide-react";

export type CredentialsFormValues = {
  fromDate: Date | null;
  toDate: Date | null;
  location: string;
  address: string;
  phone: string;
  preferredTime: string;
  specialRequirements: string;
  durationHours: number;
};

const defaultValues: CredentialsFormValues = {
  fromDate: null,
  toDate: null,
  location: "",
  address: "",
  phone: "",
  preferredTime: "",
  specialRequirements: "",
  durationHours: 2,
};

const timeSlots = [
  "06:00 AM - 08:00 AM",
  "08:00 AM - 10:00 AM", 
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
  "08:00 PM - 10:00 PM"
];

type Props = {
  onSubmit: (data: CredentialsFormValues) => Promise<void>;
  loading: boolean;
  serviceId?: string;
};

export default function CredentialsForm({ onSubmit, loading, serviceId }: Props) {
  const form = useForm<CredentialsFormValues>({
    defaultValues,
    mode: "onTouched",
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">📅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule Your Pooja</h2>
        <p className="text-gray-600">Fill in the details to book your sacred ceremony</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Service ID Display */}
          {serviceId && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-700">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Service ID: {serviceId}</span>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fromDate"
              rules={{ required: "From date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-orange-600" />
                    From Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal h-12 ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="toDate"
              rules={{ required: "To date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-orange-600" />
                    To Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal h-12 ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="preferredTime"
              rules={{ required: "Preferred time is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    Preferred Time
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Duration (Hours)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((hours) => (
                        <SelectItem key={hours} value={hours.toString()}>
                          {hours} hour{hours > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Information */}
          <FormField
            control={form.control}
            name="phone"
            rules={{ 
              required: "Phone number is required",
              pattern: {
                value: /^(\+91|91)?[6-9]\d{9}$/,
                message: "Please enter a valid Indian phone number"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-600" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your phone number (+91 98765 43210)" 
                    className="h-12"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Location Details */}
          <FormField
            control={form.control}
            name="location"
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  City/Town/Village
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your city, town, or village" 
                    className="h-12"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            rules={{ required: "Full address is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Complete Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your complete address (house number, street, landmark, etc.)"
                    className="min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special Requirements */}
          <FormField
            control={form.control}
            name="specialRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Special Requirements (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any specific requirements, preferences, or instructions for the pooja..."
                    className="min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-4 text-lg shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Booking...
              </div>
            ) : (
              "Confirm Booking"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By clicking "Confirm Booking", you agree to our terms of service and privacy policy.
          </p>
        </form>
      </Form>
    </div>
  );
}
