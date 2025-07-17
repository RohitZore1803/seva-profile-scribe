
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Clock, Star, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ServiceCard from "@/components/ServiceCard";

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

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [durationFilter, setDurationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, priceRange, durationFilter]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services.filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = service.price >= priceRange[0] * 100 && service.price <= priceRange[1] * 100;
      
      const matchesDuration = !durationFilter || 
                             (durationFilter === "short" && (service.duration_hours || 2) <= 2) ||
                             (durationFilter === "medium" && (service.duration_hours || 2) > 2 && (service.duration_hours || 2) <= 4) ||
                             (durationFilter === "long" && (service.duration_hours || 2) > 4);

      return matchesSearch && matchesPrice && matchesDuration;
    });

    setFilteredServices(filtered);
  };

  const handleBookNow = (service: Service) => {
    navigate(`/credentials/${service.id}`);
  };

  const handleViewDetails = (service: Service) => {
    navigate(`/product/${service.id}`);
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString()}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 3000]);
    setDurationFilter("");
  };

  const toggleFilters = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    setShowFilters(!showFilters);
    
    // Add smooth animation
    const filtersPanel = target.nextSibling as HTMLElement;
    if (filtersPanel) {
      if (showFilters) {
        filtersPanel.style.maxHeight = "0px";
        filtersPanel.style.opacity = "0";
      } else {
        filtersPanel.style.maxHeight = "500px";
        filtersPanel.style.opacity = "1";
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading spiritual services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 dark:from-orange-600/10 dark:to-amber-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-orange-800 dark:text-orange-400 mb-6">
              Sacred Services
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Discover authentic spiritual services performed by experienced pandits. 
              Bring divine blessings and prosperity to your home with traditional rituals.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Verified Pandits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Authentic Rituals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Home Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Search and Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-orange-100 shadow-lg">
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for pooja services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg border-orange-200 focus:border-orange-400"
                />
              </div>
              <Button
                onClick={toggleFilters}
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardHeader>

          <CardContent
            className="transition-all duration-300 overflow-hidden"
            style={{
              maxHeight: showFilters ? "500px" : "0px",
              opacity: showFilters ? 1 : 0,
              padding: showFilters ? "1.5rem" : "0 1.5rem",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={3000}
                  min={0}
                  step={100}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <Select value={durationFilter} onValueChange={setDurationFilter}>
                  <SelectTrigger className="border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Any duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any duration</SelectItem>
                    <SelectItem value="short">Short (≤ 2 hours)</SelectItem>
                    <SelectItem value="medium">Medium (2-4 hours)</SelectItem>
                    <SelectItem value="long">Long (> 4 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredServices.length} of {services.length} services
            {searchTerm && (
              <span className="ml-2">
                for "<strong>{searchTerm}</strong>"
              </span>
            )}
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No services found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters} className="bg-orange-600 hover:bg-orange-700">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookNow={handleBookNow}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
