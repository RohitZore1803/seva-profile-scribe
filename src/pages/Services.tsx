<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Star, Users, Phone, Mail } from 'lucide-react';

const Index = () => {
  const popularServices = [
    {
      id: 1,
      name: "Ganesh Puja",
      price: "₹2,500",
      image: "/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png",
      description: "Traditional Ganesh worship ceremony"
    },
    {
      id: 2,
      name: "Lakshmi Puja",
      price: "₹3,000",
      image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
      description: "Goddess Lakshmi worship for prosperity"
    },
    {
      id: 3,
      name: "Saraswati Puja",
      price: "₹2,000",
      image: "/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png",
      description: "Worship for knowledge and wisdom"
    },
    {
      id: 6,
      name: "Marriage Ceremony",
      price: "₹15,000",
      image: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png",
      description: "Complete Hindu wedding ceremony"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            E-GURUJI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with experienced Pandits for authentic Pooja services at your doorstep
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/services">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📿 Browse Services
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🙏 Join E-GURUJI
              </Button>
            </Link>
          </div>

          {/* Quick Booking CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold mb-4">Book Your Pooja Now!</h3>
            <p className="mb-4">Quick and easy booking in just 3 steps</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6" />
                </div>
                <p>Choose Service</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-6 h-6" />
                </div>
                <p>Select Date & Location</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6" />
                </div>
                <p>Confirm Booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose E-GURUJI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className="text-6xl mb-4">🙏</div>
                <CardTitle className="text-2xl text-orange-800">Expert Pandits</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Connect with verified and experienced Pandits who understand traditional rituals
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className="text-6xl mb-4">📅</div>
                <CardTitle className="text-2xl text-orange-800">Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Schedule your Pooja services with flexible dates and timings
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className="text-6xl mb-4">🏠</div>
                <CardTitle className="text-2xl text-orange-800">At Your Location</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Services delivered at your home or preferred venue with all arrangements
                </CardDescription>
              </CardContent>
            </Card>
=======

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image: string | null;
  created_at: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search term
    if (searchTerm) {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, services]);

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
          <div className="max-w-2xl mx-auto">
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
>>>>>>> b294da096ec2293080503655d0c944dfbb836fbd
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Popular Services Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-orange-800 mb-4">Popular Pooja Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most sought-after spiritual services performed by expert Pandits
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {popularServices.map((service) => (
              <Card key={service.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                    {service.price}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-orange-700">{service.name}</CardTitle>
=======
        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No services match "${searchTerm}"` : "No services available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
                <div className="relative">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                      <span className="text-6xl">🕉️</span>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getPriceBadgeColor(getPriceCategory(service.price))} font-bold text-sm px-3 py-1`}>
                      {formatPrice(service.price)}
                    </Badge>
                  </div>
                  
                  {/* Service Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-600 text-white font-semibold">
                      Traditional
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl text-orange-700 mb-2">
                    {service.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>2-3 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>At your location</span>
                    </div>
                  </div>
>>>>>>> b294da096ec2293080503655d0c944dfbb836fbd
                </CardHeader>
                <CardContent className="pt-0">
<<<<<<< HEAD
                  <CardDescription className="text-gray-600 mb-4">
                    {service.description}
                  </CardDescription>
                  <Link to={`/credentials/${service.id}`}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Book Now
                    </Button>
                  </Link>
=======
                  <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed">
                    {service.description || "Traditional pooja service performed with authentic rituals and proper arrangements."}
                  </CardDescription>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Includes:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">Pandit Service</Badge>
                      <Badge variant="secondary" className="text-xs">All Materials</Badge>
                      <Badge variant="secondary" className="text-xs">Prasad</Badge>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8/5 rating)</span>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to={`/product/${service.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-2"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/credentials/${service.id}`}>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        Book Now →
                      </Button>
                    </Link>
                  </div>
>>>>>>> b294da096ec2293080503655d0c944dfbb836fbd
                </CardContent>
              </Card>
            ))}
          </div>
<<<<<<< HEAD
          
          <div className="text-center mt-12">
            <Link to="/services">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                View All Services →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600"></div>
        <div className="relative container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Expert Pandits</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Spiritual Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust E-GURUJI for their spiritual needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?role=customer">
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🙏 Book Your First Pooja
              </Button>
            </Link>
            <Link to="/auth?role=pandit">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📿 Join as Pandit
=======
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
>>>>>>> b294da096ec2293080503655d0c944dfbb836fbd
              </Button>
            </Link>
          </div>
        </div>
<<<<<<< HEAD
      </section>
    </div>
  );
};

export default Index;
=======
      </div>
    </div>
  );
}
>>>>>>> b294da096ec2293080503655d0c944dfbb836fbd
