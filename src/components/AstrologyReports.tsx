
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Heart, Briefcase, Shield } from "lucide-react";
import { AstrologyProfile } from "@/hooks/useAstrology";

interface AstrologyReportsProps {
  profile: AstrologyProfile;
}

export default function AstrologyReports({ profile }: AstrologyReportsProps) {
  const generateReport = (profile: AstrologyProfile) => {
    const predictions = [
      {
        category: "Career",
        icon: <Briefcase className="w-5 h-5" />,
        prediction: "Your career will see significant growth in the coming months. Focus on building relationships and networking.",
        points: ["Leadership opportunities ahead", "Financial growth expected", "New projects will bring success"],
        color: "bg-blue-50 text-blue-700"
      },
      {
        category: "Love & Relationships",
        icon: <Heart className="w-5 h-5" />,
        prediction: "Love is in the air! Your relationships will strengthen and new connections may form.",
        points: ["Harmony in existing relationships", "Chance of meeting someone special", "Family bonds will strengthen"],
        color: "bg-pink-50 text-pink-700"
      },
      {
        category: "Health & Wellness",
        icon: <Shield className="w-5 h-5" />,
        prediction: "Your health will improve with positive lifestyle changes. Focus on mental wellness.",
        points: ["Energy levels will increase", "Stress will decrease", "Good time for new health habits"],
        color: "bg-green-50 text-green-700"
      },
      {
        category: "Finance",
        icon: <TrendingUp className="w-5 h-5" />,
        prediction: "Financial stability is on the horizon. Investment opportunities may present themselves.",
        points: ["Stable income growth", "Good time for investments", "Unexpected gains possible"],
        color: "bg-yellow-50 text-yellow-700"
      }
    ];

    return predictions;
  };

  const reports = generateReport(profile);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-600" />
            Your Personalized Astrology Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, index) => (
              <Card key={index} className="border-l-4 border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${report.color}`}>
                      {report.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.category}</h3>
                      <Badge variant="outline" className="text-xs">
                        Prediction for {profile.birth_place}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{report.prediction}</p>
                  <div className="space-y-1">
                    {report.points.map((point, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        <span className="text-xs text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Lucky Days</h4>
              <p className="text-sm text-orange-700">Tuesdays and Fridays are most favorable for important decisions</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Lucky Numbers</h4>
              <p className="text-sm text-blue-700">3, 7, 21 are your lucky numbers this month</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Lucky Colors</h4>
              <p className="text-sm text-green-700">Wear orange and yellow for positive energy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
