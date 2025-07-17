
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, IndianRupee, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  duration_hours: number;
  requirements: string;
  benefits: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = priceFilter === "all" || 
                          (priceFilter === "low" && service.price <= 1000) ||
                          (priceFilter === "medium" && service.price > 1000 && service.price <= 1500) ||
                          (priceFilter === "high" && service.price > 1500);
      
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "duration":
          return a.duration_hours - b.duration_hours;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString()}`;
  };

  const handleBookService = (serviceId: number) => {
    navigate(`/credentials/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-orange-800 mb-4">Our Pooja Services</h1>
            <p className="text-xl text-orange-600 max-w-2xl mx-auto">
              Discover our comprehensive range of traditional pooja services performed by experienced pandits
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-orange-200 p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400"
                />
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Up to ₹10</SelectItem>
                  <SelectItem value="medium">₹10 - ₹15</SelectItem>
                  <SelectItem value="high">Above ₹15</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-600">
                  {filteredAndSortedServices.length} services found
                </span>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {filteredAndSortedServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🕉️</div>
              <h3 className="text-xl font-semibold text-orange-800 mb-2">No Services Found</h3>
              <p className="text-orange-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedServices.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-orange-200 bg-white/80 backdrop-blur-sm">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-orange-600 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration_hours}h
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-orange-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {service.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-orange-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-orange-600" />
                          <span className="text-2xl font-bold text-orange-800">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                          Traditional
                        </Badge>
                      </div>
                      
                      {service.benefits && (
                        <p className="text-sm text-orange-600 line-clamp-2">
                          <strong>Benefits:</strong> {service.benefits}
                        </p>
                      )}
                      
                      <Button 
                        onClick={() => handleBookService(service.id)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
