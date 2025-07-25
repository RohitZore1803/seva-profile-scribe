
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Star, MapPin, Clock, Sparkles } from "lucide-react";
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
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full">
              <Star className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-800">
              Astrology Profile
            </CardTitle>
          </div>
          <p className="text-orange-600 text-lg">
            Create your personalized astrological profile for accurate readings
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Birth Date Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Birth Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="birth_date" className="text-orange-700 font-medium">
                    Birth Date *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => handleDateInputChange(e.target.value)}
                      className="flex-1 border-orange-200 focus:border-orange-400"
                      required
                    />
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-12 h-10 p-0 border-orange-200 hover:bg-orange-50"
                        >
                          <CalendarIcon className="h-4 w-4 text-orange-600" />
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
                          className="p-3"
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_time" className="text-orange-700 font-medium">
                    Birth Time
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                    <Input
                      id="birth_time"
                      type="time"
                      value={formData.birth_time}
                      onChange={(e) => handleInputChange("birth_time", e.target.value)}
                      className="pl-10 border-orange-200 focus:border-orange-400"
                      placeholder="Optional for accurate readings"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Birth Place Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Location Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birth_place" className="text-orange-700 font-medium">
                    Birth Place *
                  </Label>
                  <Input
                    id="birth_place"
                    value={formData.birth_place}
                    onChange={(e) => handleInputChange("birth_place", e.target.value)}
                    placeholder="City, State, Country"
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-orange-700 font-medium">
                      Latitude (Optional)
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      placeholder="e.g., 28.6139"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-orange-700 font-medium">
                      Longitude (Optional)
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      placeholder="e.g., 77.2090"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Save Astrology Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
