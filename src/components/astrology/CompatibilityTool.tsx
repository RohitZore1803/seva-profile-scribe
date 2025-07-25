
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, Zap, Star, TrendingUp } from "lucide-react";
import { AstrologyProfile } from "@/hooks/useAstrology";

interface CompatibilityToolProps {
  profile: AstrologyProfile;
}

interface CompatibilityResult {
  overallScore: number;
  emotionalCompatibility: number;
  communicationCompatibility: number;
  physicalCompatibility: number;
  longTermPotential: number;
  strengths: string[];
  challenges: string[];
  advice: string;
}

export default function CompatibilityTool({ profile }: CompatibilityToolProps) {
  const [partnerData, setPartnerData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    zodiacSign: ""
  });
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateCompatibility = async () => {
    if (!partnerData.name || !partnerData.birthDate) {
      return;
    }

    setLoading(true);
    try {
      // Simulate compatibility calculation
      const mockResult: CompatibilityResult = {
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
        emotionalCompatibility: Math.floor(Math.random() * 30) + 70,
        communicationCompatibility: Math.floor(Math.random() * 40) + 60,
        physicalCompatibility: Math.floor(Math.random() * 35) + 65,
        longTermPotential: Math.floor(Math.random() * 45) + 55,
        strengths: [
          "Strong emotional connection",
          "Complementary communication styles",
          "Shared values and goals",
          "Mutual respect and understanding"
        ],
        challenges: [
          "Different approaches to conflict resolution",
          "Varying needs for personal space",
          "Financial priorities may differ"
        ],
        advice: "Focus on open communication and appreciate each other's differences. Your complementary energies can create a balanced and harmonious relationship."
      };

      setTimeout(() => {
        setCompatibilityResult(mockResult);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error calculating compatibility:", error);
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-600" />
            Compatibility & Synastry Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            Compare your birth chart with your partner's to discover relationship dynamics
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner-name">Partner's Name</Label>
                <Input
                  id="partner-name"
                  value={partnerData.name}
                  onChange={(e) => setPartnerData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter partner's name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="partner-birth-date">Birth Date</Label>
                <Input
                  id="partner-birth-date"
                  type="date"
                  value={partnerData.birthDate}
                  onChange={(e) => setPartnerData(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="partner-birth-time">Birth Time (Optional)</Label>
                <Input
                  id="partner-birth-time"
                  type="time"
                  value={partnerData.birthTime}
                  onChange={(e) => setPartnerData(prev => ({ ...prev, birthTime: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="partner-birth-place">Birth Place</Label>
                <Input
                  id="partner-birth-place"
                  value={partnerData.birthPlace}
                  onChange={(e) => setPartnerData(prev => ({ ...prev, birthPlace: e.target.value }))}
                  placeholder="Enter birth place"
                />
              </div>
            </div>
            
            <Button 
              onClick={calculateCompatibility}
              disabled={loading || !partnerData.name || !partnerData.birthDate}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Analyzing Compatibility..." : "Calculate Compatibility"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {compatibilityResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-600" />
                Compatibility Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-orange-600 mb-2">
                  {compatibilityResult.overallScore}%
                </div>
                <p className="text-lg text-gray-600">Overall Compatibility</p>
                <Badge className={getScoreColor(compatibilityResult.overallScore)}>
                  {getScoreLabel(compatibilityResult.overallScore)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Emotional Connection</span>
                      <span className="text-sm text-gray-600">{compatibilityResult.emotionalCompatibility}%</span>
                    </div>
                    <Progress value={compatibilityResult.emotionalCompatibility} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm text-gray-600">{compatibilityResult.communicationCompatibility}%</span>
                    </div>
                    <Progress value={compatibilityResult.communicationCompatibility} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Physical Attraction</span>
                      <span className="text-sm text-gray-600">{compatibilityResult.physicalCompatibility}%</span>
                    </div>
                    <Progress value={compatibilityResult.physicalCompatibility} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Long-term Potential</span>
                      <span className="text-sm text-gray-600">{compatibilityResult.longTermPotential}%</span>
                    </div>
                    <Progress value={compatibilityResult.longTermPotential} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-4 h-4" />
                  Relationship Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {compatibilityResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Zap className="w-4 h-4" />
                  Areas for Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {compatibilityResult.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Relationship Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{compatibilityResult.advice}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
