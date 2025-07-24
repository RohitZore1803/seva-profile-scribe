
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Moon, Sun, Calendar, BookOpen, Sparkles } from "lucide-react";
import { useAstrology } from "@/hooks/useAstrology";
import AstrologyProfileForm from "@/components/AstrologyProfileForm";
import AstrologyReports from "@/components/AstrologyReports";
import { toast } from "@/hooks/use-toast";

export default function AstrologyHub() {
  const { profile, consultations, loading, createOrUpdateProfile, bookConsultation } = useAstrology();
  const [activeTab, setActiveTab] = useState("profile");

  const handleBookConsultation = async (consultationType: string, price: number) => {
    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please complete your astrology profile first",
        variant: "destructive",
      });
      return;
    }

    await bookConsultation({
      consultation_type: consultationType,
      price: price,
      duration_minutes: 30,
      status: 'pending',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const suggestedServices = [
    {
      title: "Ganesha Pooja",
      description: "Remove obstacles and bring prosperity to your life",
      benefit: "Clears path for success and new beginnings",
      price: 1500,
      duration: "2 hours"
    },
    {
      title: "Lakshmi Pooja",
      description: "Attract wealth and abundance",
      benefit: "Improves financial situation and brings prosperity",
      price: 2000,
      duration: "3 hours"
    },
    {
      title: "Navagraha Pooja",
      description: "Balance planetary influences in your life",
      benefit: "Reduces malefic effects and strengthens positive energies",
      price: 2500,
      duration: "4 hours"
    },
    {
      title: "Saraswati Pooja",
      description: "Enhance knowledge and wisdom",
      benefit: "Improves learning abilities and career growth",
      price: 1200,
      duration: "2 hours"
    },
    {
      title: "Hanuman Pooja",
      description: "Gain strength and courage",
      benefit: "Provides protection and removes fear",
      price: 1000,
      duration: "1.5 hours"
    },
    {
      title: "Mahamrityunjaya Jaap",
      description: "For health and longevity",
      benefit: "Promotes healing and protects from illness",
      price: 3000,
      duration: "5 hours"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-orange-800 mb-2">Astrology Hub</h1>
            <p className="text-orange-600">Discover your cosmic insights and spiritual guidance</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <AstrologyProfileForm
                profile={profile}
                onSave={createOrUpdateProfile}
                loading={loading}
              />
              
              {profile && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-600" />
                      Your Astrological Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.zodiac_sign && (
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <Sun className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                          <h3 className="font-semibold">Sun Sign</h3>
                          <p className="text-orange-600">{profile.zodiac_sign}</p>
                        </div>
                      )}
                      
                      {profile.moon_sign && (
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Moon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h3 className="font-semibold">Moon Sign</h3>
                          <p className="text-blue-600">{profile.moon_sign}</p>
                        </div>
                      )}
                      
                      {profile.rising_sign && (
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <h3 className="font-semibold">Rising Sign</h3>
                          <p className="text-purple-600">{profile.rising_sign}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="consultations">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {consultations.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No Consultations Yet</h3>
                        <p className="text-gray-600">Book your first astrology consultation</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {consultations.map((consultation) => (
                          <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">{consultation.consultation_type}</h3>
                              <p className="text-sm text-gray-600">
                                {consultation.scheduled_at 
                                  ? new Date(consultation.scheduled_at).toLocaleString()
                                  : "Not scheduled"
                                }
                              </p>
                              <p className="text-sm text-gray-600">
                                Duration: {consultation.duration_minutes} minutes
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(consultation.status)}>
                                {consultation.status.toUpperCase()}
                              </Badge>
                              <p className="text-sm font-semibold mt-1">
                                ₹{consultation.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              {profile ? (
                <AstrologyReports profile={profile} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Astrology Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">Complete Your Profile First</h3>
                      <p className="text-gray-600">Fill out your astrology profile to get personalized reports</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    Recommended Services for Better Life
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Based on astrological insights, these services can help improve your life and solve various issues
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestedServices.map((service, index) => (
                      <Card key={index} className="border-l-4 border-orange-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-sm font-medium text-green-800">Benefit:</p>
                              <p className="text-sm text-green-700">{service.benefit}</p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Duration: {service.duration}</p>
                                <p className="text-lg font-bold text-orange-600">₹{service.price}</p>
                              </div>
                              <Button
                                onClick={() => handleBookConsultation(service.title, service.price)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                Book Service
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
