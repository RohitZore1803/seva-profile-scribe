
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Moon, Sun, Zap, Info } from "lucide-react";
import { AstrologyProfile } from "@/hooks/useAstrology";
import { toast } from "@/hooks/use-toast";

interface BirthChartGeneratorProps {
  profile: AstrologyProfile;
}

interface ChartElement {
  id: string;
  name: string;
  sign: string;
  house: number;
  degree: number;
  element: string;
  quality: string;
  ruling_planet: string;
  description: string;
  influence: string;
}

export default function BirthChartGenerator({ profile }: BirthChartGeneratorProps) {
  const [chartData, setChartData] = useState<ChartElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<ChartElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      generateChart();
    }
  }, [profile]);

  const generateChart = async () => {
    setLoading(true);
    try {
      // Simulate chart generation with realistic astrological data
      const mockChartData: ChartElement[] = [
        {
          id: "sun",
          name: "Sun",
          sign: profile.zodiac_sign || "Aries",
          house: 1,
          degree: 15.5,
          element: "Fire",
          quality: "Cardinal",
          ruling_planet: "Sun",
          description: "Your core identity and ego",
          influence: "Leadership, vitality, self-expression"
        },
        {
          id: "moon",
          name: "Moon",
          sign: profile.moon_sign || "Cancer",
          house: 4,
          degree: 23.2,
          element: "Water",
          quality: "Cardinal",
          ruling_planet: "Moon",
          description: "Your emotional nature and instincts",
          influence: "Emotions, intuition, nurturing"
        },
        {
          id: "mercury",
          name: "Mercury",
          sign: profile.zodiac_sign || "Gemini",
          house: 3,
          degree: 8.7,
          element: "Air",
          quality: "Mutable",
          ruling_planet: "Mercury",
          description: "Your communication and thinking style",
          influence: "Communication, intellect, learning"
        },
        {
          id: "venus",
          name: "Venus",
          sign: "Taurus",
          house: 2,
          degree: 19.1,
          element: "Earth",
          quality: "Fixed",
          ruling_planet: "Venus",
          description: "Your love nature and values",
          influence: "Love, beauty, harmony, values"
        },
        {
          id: "mars",
          name: "Mars",
          sign: "Scorpio",
          house: 8,
          degree: 12.9,
          element: "Water",
          quality: "Fixed",
          ruling_planet: "Mars",
          description: "Your drive and ambition",
          influence: "Action, passion, courage, conflict"
        }
      ];

      setTimeout(() => {
        setChartData(mockChartData);
        setLoading(false);
        toast({
          title: "Chart Generated",
          description: "Your personalized birth chart is ready!",
        });
      }, 1500);
    } catch (error) {
      console.error("Error generating chart:", error);
      setLoading(false);
    }
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case "Fire": return "bg-red-100 text-red-700";
      case "Earth": return "bg-green-100 text-green-700";
      case "Air": return "bg-blue-100 text-blue-700";
      case "Water": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPlanetIcon = (planetName: string) => {
    switch (planetName) {
      case "Sun": return <Sun className="w-4 h-4" />;
      case "Moon": return <Moon className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-orange-600">Generating your birth chart...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-600" />
            Interactive Birth Chart
          </CardTitle>
          <p className="text-sm text-gray-600">
            Click on any planetary position to explore its influence
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartData.map((element) => (
              <div
                key={element.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedElement?.id === element.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedElement(element)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    {getPlanetIcon(element.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{element.name}</h3>
                    <p className="text-sm text-gray-600">{element.sign} {element.degree.toFixed(1)}°</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getElementColor(element.element)}>
                    {element.element}
                  </Badge>
                  <Badge variant="outline">House {element.house}</Badge>
                </div>
                
                <p className="text-xs text-gray-600">{element.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedElement && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-600" />
              {selectedElement.name} in {selectedElement.sign}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Position</p>
                  <p className="text-lg font-semibold">{selectedElement.degree.toFixed(1)}°</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">House</p>
                  <p className="text-lg font-semibold">{selectedElement.house}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Element</p>
                  <Badge className={getElementColor(selectedElement.element)}>
                    {selectedElement.element}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quality</p>
                  <p className="text-lg font-semibold">{selectedElement.quality}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Influence</p>
                <p className="text-gray-700">{selectedElement.influence}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="text-gray-700">{selectedElement.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Real-Time Influences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Mercury Retrograde</p>
                <p className="text-sm text-gray-600">Communication challenges ahead</p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Jupiter Trine</p>
                <p className="text-sm text-gray-600">Expansion and growth opportunities</p>
              </div>
              <Badge variant="outline">Tomorrow</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium">Full Moon in {profile.moon_sign}</p>
                <p className="text-sm text-gray-600">Emotional culmination period</p>
              </div>
              <Badge variant="outline">Next Week</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
