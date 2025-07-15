
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image: string | null;
  duration_hours: number | null;
  requirements: string | null;
  benefits: string | null;
  created_at: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search term, price, and duration
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter) {
      filtered = filtered.filter(service => {
        if (!service.price) return false;
        const priceInRupees = service.price / 100;
        switch (priceFilter) {
          case "budget":
            return priceInRupees < 2000;
          case "standard":
            return priceInRupees >= 2000 && priceInRupees < 5000;
          case "premium":
            return priceInRupees >= 5000;
          default:
            return true;
        }
      });
    }

    if (durationFilter) {
      filtered = filtered.filter(service => {
        if (!service.duration_hours) return false;
        switch (durationFilter) {
          case "short":
            return service.duration_hours <= 2;
          case "medium":
            return service.duration_hours > 2 && service.duration_hours <= 4;
          case "long":
            return service.duration_hours > 4;
          default:
            return true;
        }
      });
    }

    setFilteredServices(filtered);
  }, [searchTerm, priceFilter, durationFilter, services]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInPaise: number | null) => {
    if (!priceInPaise) return "Contact for price";
    return `₹${(priceInPaise / 100).toLocaleString()}`;
  };

  const getPriceCategory = (priceInPaise: number | null) => {
    if (!priceInPaise) return "contact";
    const price = priceInPaise / 100;
    if (price < 2000) return "budget";
    if (price < 5000) return "standard";
    return "premium";
  };

  const getPriceBadgeColor = (category: string) => {
    switch (category) {
      case "budget": return "bg-green-100 text-green-800";
      case "standard": return "bg-blue-100 text-blue-800";
      case "premium": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("");
    setDurationFilter("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
            Our Pooja Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover authentic spiritual services performed by experienced Pandits at your convenience
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for pooja services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">Filters:</span>
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-40 bg-white/80">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget (< ₹2,000)</SelectItem>
                  <SelectItem value="standard">Standard (₹2,000-5,000)</SelectItem>
                  <SelectItem value="premium">Premium (> ₹5,000)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger className="w-40 bg-white/80">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (≤ 2 hours)</SelectItem>
                  <SelectItem value="medium">Medium (2-4 hours)</SelectItem>
                  <SelectItem value="long">Long (> 4 hours)</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || priceFilter || durationFilter) && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {filteredServices.length} of {services.length} services
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-500">
              {searchTerm || priceFilter || durationFilter ? 
                "Try adjusting your filters or search terms" : 
                "No services available at the moment"
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
                <div className="relative">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                      <span className="text-5xl">🕉️</span>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getPriceBadgeColor(getPriceCategory(service.price))} font-bold text-sm px-3 py-1`}>
                      {formatPrice(service.price)}
                    </Badge>
                  </div>
                  
                  {/* Service Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-600 text-white font-semibold">
                      Traditional
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-orange-700 mb-2 line-clamp-2">
                    {service.name}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration_hours || 2} hrs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>At location</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                    {service.description || "Traditional pooja service performed with authentic rituals and proper arrangements."}
                  </CardDescription>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">(4.8/5)</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Link to={`/product/${service.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-2 text-sm"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/credentials/${service.id}`}>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-200 text-sm">
                        Book Now →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-orange-800 mb-4">
            Need a Custom Pooja Service?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Can't find what you're looking for? Contact us for personalized pooja arrangements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button 
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 font-semibold rounded-full"
              >
                Contact Us
              </Button>
            </Link>
            <Link to="/auth?role=customer">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 font-semibold rounded-full"
              >
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
