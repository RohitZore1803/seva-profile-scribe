
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AstrologyProfile, useAstrology } from "@/hooks/useAstrology";

interface AstrologyProfileFormProps {
  profile?: AstrologyProfile | null;
  onSave: (profileData: Partial<AstrologyProfile>) => void;
  loading?: boolean;
}

export default function AstrologyProfileForm({ profile, onSave, loading }: AstrologyProfileFormProps) {
  const { generateAstrologicalSummary } = useAstrology();
  const [formData, setFormData] = useState({
    birth_date: profile?.birth_date || "",
    birth_time: profile?.birth_time || "",
    birth_place: profile?.birth_place || "",
    latitude: profile?.latitude?.toString() || "",
    longitude: profile?.longitude?.toString() || "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    profile?.birth_date ? new Date(profile.birth_date) : undefined
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      ...formData,
      birth_date: selectedDate?.toISOString().split('T')[0] || formData.birth_date,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    };

    // Generate astrological summary
    if (profileData.birth_date) {
      const summary = generateAstrologicalSummary({
        ...profileData,
        id: profile?.id || '',
        user_id: profile?.user_id || '',
        created_at: profile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as AstrologyProfile);
      
      Object.assign(profileData, summary);
    }

    onSave(profileData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, birth_date: value }));
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Astrology Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birth_date">Birth Date</Label>
              <div className="flex gap-2">
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleDateInputChange(e.target.value)}
                  className="flex-1"
                />
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-10 h-10 p-0",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          setFormData(prev => ({ ...prev, birth_date: format(date, 'yyyy-MM-dd') }));
                        }
                        setShowCalendar(false);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_time">Birth Time</Label>
              <Input
                id="birth_time"
                type="time"
                value={formData.birth_time}
                onChange={(e) => handleInputChange("birth_time", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="birth_place">Birth Place</Label>
              <Input
                id="birth_place"
                value={formData.birth_place}
                onChange={(e) => handleInputChange("birth_place", e.target.value)}
                placeholder="Enter your birth place"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude (optional)</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                placeholder="e.g., 28.6139"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude (optional)</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                placeholder="e.g., 77.2090"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
