
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, Plus, Moon, Sun, Star } from "lucide-react";
import { AstrologyProfile } from "@/hooks/useAstrology";

interface AstrologyEventCalendarProps {
  profile: AstrologyProfile;
}

interface AstrologyEvent {
  id: string;
  title: string;
  type: "transit" | "moon_phase" | "planetary" | "personal";
  date: string;
  time?: string;
  description: string;
  impact: "low" | "medium" | "high";
  category: "general" | "personal" | "global";
  isReminder: boolean;
}

export default function AstrologyEventCalendar({ profile }: AstrologyEventCalendarProps) {
  const [events, setEvents] = useState<AstrologyEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");

  useEffect(() => {
    if (profile) {
      generateEvents();
    }
  }, [profile]);

  const generateEvents = async () => {
    // Generate events for the next 30 days
    const events: AstrologyEvent[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Add some random events
      if (Math.random() < 0.3) {
        events.push({
          id: `event-${i}`,
          title: i % 7 === 0 ? "New Moon" : i % 14 === 0 ? "Full Moon" : "Mercury Transit",
          type: i % 7 === 0 ? "moon_phase" : "transit",
          date: date.toISOString().split('T')[0],
          time: "14:30",
          description: `Astrological event affecting your ${profile.zodiac_sign} energy`,
          impact: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          category: "personal",
          isReminder: false
        });
      }
    }
    
    setEvents(events);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "moon_phase": return <Moon className="w-4 h-4" />;
      case "planetary": return <Star className="w-4 h-4" />;
      case "transit": return <Sun className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "border-red-500 bg-red-50";
      case "medium": return "border-yellow-500 bg-yellow-50";
      case "low": return "border-green-500 bg-green-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Astrological Event Calendar
          </CardTitle>
          <p className="text-sm text-gray-600">
            Track important astrological events and their impact on your life
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {calendarDays.map((day, index) => {
              const dateStr = day.toISOString().split('T')[0];
              const dayEvents = getEventsForDate(dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    isToday ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-500">{day.toLocaleDateString('en', { weekday: 'short' })}</div>
                    <div className="text-lg font-semibold">{day.getDate()}</div>
                    <div className="space-y-1 mt-2">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className="flex items-center gap-1">
                          {getEventIcon(event.type)}
                          <span className="text-xs truncate">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getEventsForDate(selectedDate).map((event) => (
              <div key={event.id} className={`p-4 rounded-lg border-2 ${getImpactColor(event.impact)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      {event.time && <p className="text-xs text-gray-500 mt-1">{event.time}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{event.impact} impact</Badge>
                    <Button variant="ghost" size="sm">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {getEventsForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No astrological events for this date</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Major Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Full Moon in {profile.moon_sign}</p>
                  <p className="text-sm text-gray-600">Emotional culmination and release</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">3 days</Badge>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Venus enters {profile.zodiac_sign}</p>
                  <p className="text-sm text-gray-600">Enhanced charm and attraction</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">1 week</Badge>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">Mercury Retrograde</p>
                  <p className="text-sm text-gray-600">Communication challenges ahead</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">2 weeks</Badge>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
