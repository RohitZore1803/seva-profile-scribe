
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, Calendar } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  duration_hours?: number;
  requirements?: string;
  benefits?: string;
}

interface ServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

export default function ServiceCard({ service, onBookNow, onViewDetails }: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString()}`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-orange-100 hover:border-orange-300 bg-white/80 backdrop-blur-sm">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-orange-600 hover:bg-orange-700 text-white">
            Popular
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-orange-800 group-hover:text-orange-600 transition-colors">
            {service.name}
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {formatPrice(service.price)}
            </div>
            <div className="text-sm text-gray-500">per service</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-gray-600 line-clamp-3">
          {service.description}
        </CardDescription>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{service.duration_hours || 2} hours</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.8 (120+)</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Expert Pandits</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewDetails(service)}
            variant="outline"
            className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            View Details
          </Button>
          <Button
            onClick={() => onBookNow(service)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
