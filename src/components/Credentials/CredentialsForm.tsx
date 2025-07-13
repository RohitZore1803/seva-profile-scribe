import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from '../../supabase'; // Import your Supabase client

export type CredentialsFormValues = {
  fromDate: Date | null;
  toDate: Date | null;
  location: string;
  address: string;
};

const defaultValues: CredentialsFormValues = {
  fromDate: null,
  toDate: null,
  location: "",
  address: "",
};

type Props = {
  serviceId?: number | string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
};

export default function CredentialsForm({ serviceId, onSuccess, onError }: Props) {
  const [loading, setLoading] = React.useState(false);
  const form = useForm<CredentialsFormValues>({
    defaultValues,
    mode: "onTouched",
  });

  const handleSubmit = async (data: CredentialsFormValues) => {
    setLoading(true);
    
    try {
      console.log('🔍 Starting form submission with data:', data);
      
      // 1. Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      console.log('🔍 Auth check result:', { user: user?.id, authError });
      
      if (authError) {
        console.error('❌ Auth error:', authError);
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        console.error('❌ No authenticated user found');
        throw new Error('You must be logged in to create a booking');
      }

      // 2. Prepare the booking data - FIXED FIELD NAMES
      const bookingData = {
        tentative_date: data.fromDate?.toISOString(), // Use tentative_date instead of from_date
        location: data.location,
        address: data.address,
        service_id: serviceId ? Number(serviceId) : null, // Ensure it's a number
        created_by: user.id, // UUID from auth
        status: 'pending',
        pandit_id: null, // Initially null until assigned
        assigned_at: null, // Initially null
        created_at: new Date().toISOString(),
      };

      console.log('🔍 Prepared booking data:', bookingData);

      // 3. Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select(`
          *,
          customer_profile:customer_profiles(*),
          service:services(*),
          assigned_pandit:pandit_profiles(*)
        `)
        .single();

      console.log('🔍 Supabase response:', { insertedData, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        // More specific error handling
        if (error.code === '23503') {
          throw new Error('Invalid service ID or user not found');
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check your account status.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      // 4. Success handling
      console.log('✅ Booking created successfully:', insertedData);
      form.reset();
      onSuccess?.(insertedData);
      
    } catch (error: any) {
      console.error('❌ Error creating booking:', error);
      const errorMessage = error.message || 'Failed to create booking. Please try again.';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-7">
        {/* Service ID field, read-only */}
        {serviceId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service ID
            </label>
            <input
              type="text"
              value={serviceId}
              readOnly
              className="w-full border bg-gray-100 rounded px-3 py-2 text-sm cursor-not-allowed text-gray-500"
              tabIndex={-1}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="fromDate"
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Tentative Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        type="button"
                        className={
                          !field.value
                            ? "text-muted-foreground w-full justify-start"
                            : "w-full justify-start"
                        }
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
                      initialFocus
                      disabled={(date) => date < new Date()} // Disable past dates
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Removed toDate field since your schema uses tentative_date */}
        </div>
        
        <FormField
          control={form.control}
          name="location"
          rules={{ required: "Please enter the city/town/village location" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter city/town/village" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          rules={{ required: "Please enter the full address" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full address (house no, street, etc)"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          size="lg"
          className="bg-orange-700 w-full text-white hover:bg-orange-800"
          disabled={loading}
        >
          {loading ? "Creating Booking..." : "Create Booking"}
        </Button>
      </form>
    </Form>
  );
}