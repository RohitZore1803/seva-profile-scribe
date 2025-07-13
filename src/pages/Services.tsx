import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, Clock, MapPin, Grid, List, ChevronDown, Users, Heart, Sparkles } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image: string | null;
  created_at: string;
  category: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock data with more services
  const mockServices = [
    {
      id: 1,
      name: "Vaastu Shanti",
      description: "Sacred ceremony to remove negative energies and bring positive vibrations to your space",
      price: 100000,
      image: "/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png",
      created_at: "2024-01-01",
      category: "REGULAR"
    },
    {
      id: 2,
      name: "Griha Pravesh",
      description: "House warming ceremony for new home blessings and positive energy",
      price: 120000,
      image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
      created_at: "2024-01-02",
      category: "REGULAR"
    },
    {
      id: 3,
      name: "Bhoomi Pooja",
      description: "Sacred earth worship ceremony before construction begins",
      price: 110000,
      image: "/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png",
      created_at: "2024-01-03",
      category: "REGULAR"
    },
    {
      id: 4,
      name: "Satya Narayan",
      description: "Worship of Lord Vishnu as Satyanarayan for truth and righteousness",
      price: 90000,
      image: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png",
      created_at: "2024-01-04",
      category: "REGULAR"
    },
    {
      id: 5,
      name: "Durga Pooja",
      description: "Nine-day celebration of Goddess Durga with elaborate rituals and ceremonies",
      price: 100000,
      image: "/lovable-uploads/8f56705a-3508-48d2-b025-b9746aa30f85.png",
      created_at: "2024-01-05",
      category: "REGULAR"
    },
    {
      id: 6,
      name: "Office Opening Pooja",
      description: "Auspicious ceremony for new business ventures and office openings",
      price: 200000,
      image: "/lovable-uploads/6953ad6b-9da3-45bc-bc02-63febada4a34.png",
      created_at: "2024-01-06",
      category: "REGULAR"
    },
    {
      id: 7,
      name: "Mahalakshmi Pooja",
      description: "Worship of Goddess Mahalakshmi for wealth and prosperity",
      price: 140000,
      image: "/lovable-uploads/7a18e668-8e8d-4d40-a8a8-a286e4089324.png",
      created_at: "2024-01-07",
      category: "REGULAR"
    },
    {
      id: 8,
      name: "Ganpati Pooja",
      description: "Traditional Lord Ganesh worship ceremony for new beginnings",
      price: 120000,
      image: "/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png",
      created_at: "2024-01-08",
      category: "REGULAR"
    },
    {
      id: 9,
      name: "Rudra Abhishek",
      description: "Special abhishekam of Lord Shiva with sacred mantras and offerings",
      price: 180000,
      image: "/lovable-uploads/251e248a-4351-49bd-8651-6aeefdaee648.png",
      created_at: "2024-01-09",
      category: "REGULAR"
    },
    {
      id: 10,
      name: "Mangalagaur Pooja",
      description: "Worship of Goddess Gauri for marital bliss and family happiness",
      price: 130000,
      image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
      created_at: "2024-01-10",
      category: "REGULAR"
    },
    {
      id: 11,
      name: "Ganpati Visarjan Pooja",
      description: "Sacred farewell ceremony for Lord Ganesha with traditional rituals",
      price: 90000,
      image: "/lovable-uploads/8f56705a-3508-48d2-b025-b9746aa30f85.png",
      created_at: "2024-01-11",
      category: "FESTIVAL"
    },
    {
      id: 12,
      name: "Janmashtami Pooja",
      description: "Celebration of Lord Krishna's birth with traditional rituals",
      price: 110000,
      image: "/lovable-uploads/6953ad6b-9da3-45bc-bc02-63febada4a34.png",
      created_at: "2024-01-12",
      category: "FESTIVAL"
    },
    {
      id: 13,
      name: "Diwali Lakshmi Pooja",
      description: "Festival of lights celebration with Lakshmi puja and ceremonies",
      price: 210000,
      image: "/lovable-uploads/7a18e668-8e8d-4d40-a8a8-a286e4089324.png",
      created_at: "2024-01-13",
      category: "FESTIVAL"
    },
    {
      id: 14,
      name: "Ganapti Sthapana Pooja",
      description: "Installation ceremony of Lord Ganesha with proper rituals",
      price: 100000,
      image: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png",
      created_at: "2024-01-14",
      category: "FESTIVAL"
    },
    {
      id: 15,
      name: "Udak Shanti",
      description: "Water purification ceremony for peace and tranquility",
      price: 95000,
      image: "/lovable-uploads/251e248a-4351-49bd-8651-6aeefdaee648.png",
      created_at: "2024-01-15",
      category: "SHANTI"
    },
    {
      id: 16,
      name: "Navgraha Shanti",
      description: "Nine planets worship for removing planetary doshas",
      price: 170000,
      image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
      created_at: "2024-01-16",
      category: "SHANTI"
    },
    {
      id: 17,
      name: "Ganapti Havan",
      description: "Sacred fire ceremony dedicated to Lord Ganesha",
      price: 150000,
      image: "/lovable-uploads/07f5ed97-9548-4467-b6f8-68cf9301ec72.png",
      created_at: "2024-01-17",
      category: "HAVAN"
    },
    {
      id: 18,
      name: "Dhan Laxmi Pooja",
      description: "Wealth and prosperity pooja with special rituals",
      price: 200000,
      image: "/lovable-uploads/b9ec4e6a-73d1-4536-8eaa-809140586224.png",
      created_at: "2024-01-18",
      category: "HAVAN"
    },
    {
      id: 19,
      name: "Ganesh Havan",
      description: "Fire ceremony for Lord Ganesha with sacred offerings",
      price: 160000,
      image: "/lovable-uploads/9ec09147-1249-4be2-9391-19df10c3d32f.png",
      created_at: "2024-01-19",
      category: "HAVAN"
    },
    {
      id: 20,
      name: "Satyanarayan Havan",
      description: "Fire ceremony for Lord Satyanarayan with traditional rituals",
      price: 120000,
      image: "/lovable-uploads/1a779d2d-ca9c-4348-a5b7-1745de1e05fa.png",
      created_at: "2024-01-20",
      category: "HAVAN"
    },
    // Additional services
    {
      id: 21,
      name: "Kali Pooja",
      description: "Worship of Goddess Kali for protection and destruction of evil",
      price: 180000,
      image: "/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png",
      created_at: "2024-01-21",
      category: "FESTIVAL"
    },
    {
      id: 22,
      name: "Hanuman Pooja",
      description: "Worship of Lord Hanuman for strength and courage",
      price: 130000,
      image: "/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png",
      created_at: "2024-01-22",
      category: "REGULAR"
    },
    {
      id: 23,
      name: "Saraswati Pooja",
      description: "Worship of Goddess Saraswati for knowledge and wisdom",
      price: 110000,
      image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
      created_at: "2024-01-23",
      category: "FESTIVAL"
    },
    {
      id: 24,
      name: "Navaratri Celebration",
      description: "Nine nights of devotion to Goddess Durga",
      price: 300000,
      image: "/lovable-uploads/8f56705a-3508-48d2-b025-b9746aa30f85.png",
      created_at: "2024-01-24",
      category: "FESTIVAL"
    },
    {
      id: 25,
      name: "Makar Sankranti Pooja",
      description: "Harvest festival celebration with traditional rituals",
      price: 140000,
      image: "/lovable-uploads/6953ad6b-9da3-45bc-bc02-63febada4a34.png",
      created_at: "2024-01-25",
      category: "FESTIVAL"
    },
    {
      id: 26,
      name: "Shani Shanti",
      description: "Saturn peace ceremony to reduce malefic effects",
      price: 160000,
      image: "/lovable-uploads/251e248a-4351-49bd-8651-6aeefdaee648.png",
      created_at: "2024-01-26",
      category: "SHANTI"
    },
    {
      id: 27,
      name: "Mangal Dosha Shanti",
      description: "Mars defect removal ceremony for marriage harmony",
      price: 180000,
      image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
      created_at: "2024-01-27",
      category: "SHANTI"
    },
    {
      id: 28,
      name: "Surya Pooja",
      description: "Sun worship ceremony for health and vitality",
      price: 125000,
      image: "/lovable-uploads/7a18e668-8e8d-4d40-a8a8-a286e4089324.png",
      created_at: "2024-01-28",
      category: "REGULAR"
    },
    {
      id: 29,
      name: "Vishnu Sahasranamam",
      description: "Chanting of thousand names of Lord Vishnu",
      price: 100000,
      image: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png",
      created_at: "2024-01-29",
      category: "REGULAR"
    },
    {
      id: 30,
      name: "Maha Mrityunjaya Havan",
      description: "Victory over death ceremony with powerful mantras",
      price: 220000,
      image: "/lovable-uploads/07f5ed97-9548-4467-b6f8-68cf9301ec72.png",
      created_at: "2024-01-30",
      category: "HAVAN"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    if (priceFilter !== "all") {
      filtered = filtered.filter(service => {
        if (!service.price) return priceFilter === "contact";
        const price = service.price / 100;
        switch (priceFilter) {
          case "budget": return price < 1500;
          case "standard": return price >= 1500 && price < 2500;
          case "premium": return price >= 2500;
          default: return true;
        }
      });
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [searchTerm, services, priceFilter, sortBy]);

  const formatPrice = (priceInPaise: number | null) => {
    if (!priceInPaise) return "Contact for price";
    return `₹${(priceInPaise / 100).toFixed(2)}`;
  };

  const getPriceCategory = (priceInPaise: number | null) => {
    if (!priceInPaise) return "contact";
    const price = priceInPaise / 100;
    if (price < 1500) return "budget";
    if (price < 2500) return "standard";
    return "premium";
  };

  const getPriceBadgeColor = (category: string) => {
    switch (category) {
      case "budget": return "bg-green-500 text-white";
      case "standard": return "bg-blue-500 text-white";
      case "premium": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "budget": return "Budget Friendly";
      case "standard": return "Standard";
      case "premium": return "Premium";
      default: return "Contact";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "REGULAR": return "bg-blue-100 text-blue-800";
      case "FESTIVAL": return "bg-orange-100 text-orange-800";
      case "SHANTI": return "bg-green-100 text-green-800";
      case "HAVAN": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">Loading sacred services...</p>
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
          <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800 font-medium">30+ Sacred Services</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-orange-800 mb-6">
            Our Pooja Services
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Discover authentic spiritual services performed by experienced Pandits at your convenience. 
            From traditional ceremonies to modern celebrations, we cover all your spiritual needs.
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for pooja services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm rounded-full"
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-4 rounded-full font-semibold"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Filter Options */}
            {showFilters && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200 mb-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                    <select 
                      value={priceFilter} 
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full p-3 border border-orange-200 rounded-lg focus:border-orange-400 bg-white"
                    >
                      <option value="all">All Prices</option>
                      <option value="budget">Budget (Under ₹1,500)</option>
                      <option value="standard">Standard (₹1,500 - ₹2,500)</option>
                      <option value="premium">Premium (₹2,500+)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-3 border border-orange-200 rounded-lg focus:border-orange-400 bg-white"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="category">Category</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">View Mode</label>
                    <div className="flex gap-2">
                      <Button 
                        variant={viewMode === "grid" ? "default" : "outline"}
                        onClick={() => setViewMode("grid")}
                        className="flex-1 py-3"
                      >
                        <Grid className="w-4 h-4 mr-2" />
                        Grid
                      </Button>
                      <Button 
                        variant={viewMode === "list" ? "default" : "outline"}
                        onClick={() => setViewMode("list")}
                        className="flex-1 py-3"
                      >
                        <List className="w-4 h-4 mr-2" />
                        List
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg text-gray-600">
            Showing <span className="font-semibold text-orange-600">{filteredServices.length}</span> of <span className="font-semibold">{services.length}</span> services
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              Budget: {services.filter(s => getPriceCategory(s.price) === "budget").length}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              Standard: {services.filter(s => getPriceCategory(s.price) === "standard").length}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              Premium: {services.filter(s => getPriceCategory(s.price) === "premium").length}
            </Badge>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-600 mb-4">No services found</h3>
            <p className="text-xl text-gray-500 mb-8">
              {searchTerm ? `No services match "${searchTerm}"` : "Try adjusting your filters"}
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setPriceFilter("all");
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                      <span className="text-6xl">🕉️</span>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getPriceBadgeColor(getPriceCategory(service.price))} font-bold text-sm px-3 py-1 shadow-lg`}>
                      {formatPrice(service.price)}
                    </Badge>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getCategoryColor(service.category)} font-semibold shadow-lg`}>
                      {service.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-700 text-lg mb-2">
                    {service.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>2-3 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>At location</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {service.description || "Traditional pooja service performed with authentic rituals and proper arrangements."}
                  </CardDescription>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">Pandit Service</Badge>
                      <Badge variant="secondary" className="text-xs">Materials</Badge>
                      <Badge variant="secondary" className="text-xs">Prasad</Badge>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8/5)</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold"
                    >
                      View Details
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Book Now →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-20 bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm rounded-3xl p-10 max-w-5xl mx-auto shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-pink-600" />
            <Sparkles className="w-6 h-6 text-yellow-600" />
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          
          <h3 className="text-4xl font-bold text-orange-800 mb-4">
            Need a Custom Pooja Service?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find exactly what you're looking for? Our expert team can create personalized pooja arrangements tailored to your specific needs and traditions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:
