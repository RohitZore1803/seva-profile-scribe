
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp, AlertTriangle, Heart, Briefcase } from "lucide-react";
import { AstrologyProfile } from "@/hooks/useAstrology";

interface PersonalizedTransitsProps {
  profile: AstrologyProfile;
}

interface Transit {
  id: string;
  type: string;
  planet: string;
  aspect: string;
  target: string;
  intensity: "low" | "medium" | "high";
  category: "career" | "love" | "health" | "finance" | "general";
  description: string;
  advice: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function PersonalizedTransits({ profile }: PersonalizedTransitsProps) {
  const [dailyTransits, setDailyTransits] = useState<Transit[]>([]);
  const [weeklyTransits, setWeeklyTransits] = useState<Transit[]>([]);
  const [monthlyTransits, setMonthlyTransits] = useState<Transit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      generateTransits();
    }
  }, [profile]);

  const generateTransits = async () => {
    setLoading(true);
    try {
      // Simulate API call for personalized transits
      const mockDailyTransits: Transit[] = [
        {
          id: "daily-1",
          type: "conjunction",
          planet: "Mercury",
          aspect: "conjunct",
          target: "natal Sun",
          intensity: "high",
          category: "career",
          description: "Mercury conjunct your natal Sun brings mental clarity and communication opportunities",
          advice: "Perfect time for important conversations and decision-making",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: "daily-2",
          type: "trine",
          planet: "Venus",
          aspect: "trine",
          target: "natal Moon",
          intensity: "medium",
          category: "love",
          description: "Venus trine your natal Moon enhances emotional harmony and relationships",
          advice: "Ideal time for romantic gestures and deepening connections",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      ];

      const mockWeeklyTransits: Transit[] = [
        {
          id: "weekly-1",
          type: "square",
          planet: "Mars",
          aspect: "square",
          target: "natal Mercury",
          intensity: "high",
          category: "general",
          description: "Mars square Mercury may create tension in communication",
          advice: "Be patient in conversations and avoid hasty decisions",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: "weekly-2",
          type: "sextile",
          planet: "Jupiter",
          aspect: "sextile",
          target: "natal Venus",
          intensity: "medium",
          category: "finance",
          description: "Jupiter sextile Venus brings opportunities for financial growth",
          advice: "Explore new income sources and investment opportunities",
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: false
        }
      ];

      const mockMonthlyTransits: Transit[] = [
        {
          id: "monthly-1",
          type: "opposition",
          planet: "Saturn",
          aspect: "opposition",
          target: "natal Sun",
          intensity: "high",
          category: "career",
          description: "Saturn opposition natal Sun brings challenges and lessons in authority",
          advice: "Focus on responsibility and long-term planning",
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: false
        }
      ];

      setTimeout(() => {
        setDailyTransits(mockDailyTransits);
        setWeeklyTransits(mockWeeklyTransits);
        setMonthlyTransits(mockMonthlyTransits);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating transits:", error);
      setLoading(false);
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "career": return <Briefcase className="w-4 h-4" />;
      case "love": return <Heart className="w-4 h-4" />;
      case "finance": return <TrendingUp className="w-4 h-4" />;
      case "health": return <AlertTriangle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const TransitCard = ({ transit }: { transit: Transit }) => (
    <Card className={`border-l-4 ${transit.isActive ? 'border-orange-400' : 'border-gray-300'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(transit.category)}
            <CardTitle className="text-lg">{transit.planet} {transit.aspect} {transit.target}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getIntensityColor(transit.intensity)}>
              {transit.intensity}
            </Badge>
            {transit.isActive && <Badge variant="outline">Active</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">{transit.description}</p>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">Advice:</p>
          <p className="text-sm text-blue-700">{transit.advice}</p>
        </div>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{new Date(transit.startDate).toLocaleDateString()}</span>
          <span>→</span>
          <span>{new Date(transit.endDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-orange-600">Loading personalized transits...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Live Personalized Transits & Forecasts
          </CardTitle>
          <p className="text-sm text-gray-600">
            Real-time planetary influences affecting your life based on your birth chart
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {dailyTransits.map((transit) => (
                  <TransitCard key={transit.id} transit={transit} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {weeklyTransits.map((transit) => (
                  <TransitCard key={transit.id} transit={transit} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {monthlyTransits.map((transit) => (
                  <TransitCard key={transit.id} transit={transit} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Major Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium">Full Moon in {profile.moon_sign}</p>
                <p className="text-sm text-gray-600">Emotional culmination and release</p>
              </div>
              <Badge variant="outline">3 days</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Jupiter Return</p>
                <p className="text-sm text-gray-600">12-year cycle of expansion begins</p>
              </div>
              <Badge variant="outline">2 months</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Mercury Retrograde</p>
                <p className="text-sm text-gray-600">Communication and travel delays</p>
              </div>
              <Badge variant="outline">1 week</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
