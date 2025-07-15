import { useParams, Link, useNavigate } from "react-router-dom";
import { poojas } from "@/data/poojas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Users, Star, Heart, Share2, Calendar, Phone, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function PoojaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pooja = poojas.find(p => p.id === Number(id));
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!pooja) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold mb-4 text-orange-700">Pooja not found</h1>
          <p className="text-gray-600 mb-6">The requested pooja service could not be found.</p>
          <Button onClick={() => navigate(-1)} variant="outline" className="mr-4">
            Go Back
          </Button>
          <Button onClick={() => navigate("/services")} className="bg-orange-600 hover:bg-orange-700">
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Pooja removed from your favorites" : "Pooja added to your favorites",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pooja.title} Pooja - E-GURUJI`,
          text: `Book ${pooja.title} Pooja for ₹${pooja.price}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Pooja link has been copied to clipboard",
      });
    }
  };

  const handleCallNow = () => {
    window.location.href = "tel:+919876543210";
  };

  // Mock additional images for gallery
  const galleryImages = [
    pooja.image,
    pooja.image,
    pooja.image,
  ];

  const benefits = [
    "Spiritual purification and inner peace",
    "Removal of negative energies",
    "Blessings for prosperity and success",
    "Protection from obstacles",
    "Enhanced spiritual connection"
  ];

  const requirements = [
    "Clean and sacred space",
    "Fresh flowers and fruits",
    "Incense and diya",
    "Sacred water (Ganga jal)",
    "Appropriate offerings"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery & Details */}
          <div className="lg:col-span-2">
            {/* Title & Rating */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🕉️</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available Today
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {pooja.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span>(256 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>2-3 hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span>At your location</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden shadow-lg mb-6">
              <div className="relative">
                <img 
                  src={galleryImages[selectedImage]} 
                  alt={pooja.title} 
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="p-4 flex gap-2">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${pooja.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Description */}
            <Card className="shadow-lg mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">About This Pooja</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {pooja.description}
                </p>
                
                {pooja.details && (
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <p className="text-orange-700 text-sm">{pooja.details}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Benefits
                  </h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Requirements
                  </h3>
                  <ul className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹{pooja.price}</div>
                  <p className="text-sm text-gray-500">Starting price</p>
                </div>

                <Separator className="mb-6" />

                {/* Service Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>Duration: 2-3 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>At your location</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span>Experienced Pandit</span>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 text-lg"
                    size="lg"
                    onClick={() => navigate(`/credentials/${pooja.id}`)}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-3"
                    size="lg"
                    onClick={handleCallNow}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Verified Pandits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="mt-6 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-2">📞</div>
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Call our experts for personalized guidance
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCallNow}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call +91 88794 66037 
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to Services */}
        <div className="mt-12 text-center">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium underline-offset-4 hover:underline transition-colors"
          >
            ← Back to All Services
          </Link>
        </div>
      </div>
    </div>
  );
}