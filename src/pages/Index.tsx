import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Star, Users, Phone, Mail, CheckCircle, ArrowRight, Sparkles, Heart, Shield, Clock } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const popularServices = [
    {
      id: 1,
      name: "Ganesh Puja",
      price: "₹2,500",
      originalPrice: "₹3,000",
      image: "/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png",
      description: "Traditional Ganesh worship ceremony with authentic rituals",
      duration: "2-3 hours",
      rating: 4.8,
      bookings: 1200
    },
    {
      id: 2,
      name: "Lakshmi Puja",
      price: "₹3,000",
      originalPrice: "₹3,500",
      image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
      description: "Goddess Lakshmi worship for prosperity and wealth",
      duration: "2-4 hours",
      rating: 4.9,
      bookings: 980
    },
    {
      id: 3,
      name: "Saraswati Puja",
      price: "₹2,000",
      originalPrice: "₹2,500",
      image: "/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png",
      description: "Worship for knowledge, wisdom and academic success",
      duration: "1-2 hours",
      rating: 4.7,
      bookings: 850
    },
    {
      id: 6,
      name: "Marriage Ceremony",
      price: "₹15,000",
      originalPrice: "₹18,000",
      image: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png",
      description: "Complete Hindu wedding ceremony with all rituals",
      duration: "6-8 hours",
      rating: 4.9,
      bookings: 450
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Amazing experience! The pandit was very knowledgeable and performed the ceremony beautifully.",
      service: "Ganesh Puja"
    },
    {
      name: "Raj Kumar",
      location: "Delhi",
      rating: 5,
      text: "Professional service and authentic rituals. Highly recommend E-GURUJI!",
      service: "Marriage Ceremony"
    },
    {
      name: "Anjali Patel",
      location: "Bangalore",
      rating: 4,
      text: "Easy booking process and excellent customer service. Very satisfied!",
      service: "Lakshmi Puja"
    }
  ];

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-orange-300/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-3000"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500">
        <FloatingElements />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">India's #1 Spiritual Service Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
              E-GURUJI
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Experience divine blessings with <span className="font-semibold text-yellow-200">authenticated Pandits</span> performing 
              traditional ceremonies at your doorstep
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-50 px-10 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Book Your Pooja
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Users className="w-5 h-5 mr-2" />
              Join as Pandit
            </Button>
          </div>

          {/* Enhanced Quick Booking CTA */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Heart className="w-6 h-6 text-pink-300" />
              <h3 className="text-2xl font-bold">Book Your Sacred Ceremony</h3>
            </div>
            
            <p className="mb-6 text-lg opacity-90">Simple • Secure • Spiritual</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Choose Service</h4>
                <p className="text-sm opacity-80">Select from 50+ authentic ceremonies</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Select Details</h4>
                <p className="text-sm opacity-80">Pick date, time & location</p>
              </div>
              
              <div className="text-center group">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Confirm Booking</h4>
                <p className="text-sm opacity-80">Secure payment & confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 opacity-70">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-amber-50/50"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-6 py-3 mb-6">
              <Star className="w-5 h-5 text-orange-600" />
              <span className="text-orange-800 font-medium">Why Choose E-GURUJI?</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Trusted by <span className="text-orange-600">10,000+</span> Families
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of tradition and technology with our comprehensive spiritual services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-gradient-to-b from-white to-orange-50 group">
              <CardHeader className="pb-4">
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🕉️</div>
                <CardTitle className="text-2xl text-orange-800 mb-2">Verified Pandits</CardTitle>
                <div className="flex justify-center items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 Rating</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-base leading-relaxed">
                  Connect with background-verified, experienced Pandits who follow authentic Vedic traditions and rituals
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-gradient-to-b from-white to-amber-50 group">
              <CardHeader className="pb-4">
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">⚡</div>
                <CardTitle className="text-2xl text-orange-800 mb-2">Instant Booking</CardTitle>
                <div className="flex justify-center items-center gap-1 mb-4">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Within 30 seconds</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-base leading-relaxed">
                  Book your ceremony in minutes with flexible scheduling, real-time availability, and instant confirmation
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-gradient-to-b from-white to-yellow-50 group">
              <CardHeader className="pb-4">
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🛡️</div>
                <CardTitle className="text-2xl text-orange-800 mb-2">100% Secure</CardTitle>
                <div className="flex justify-center items-center gap-1 mb-4">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Money-back guarantee</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-base leading-relaxed">
                  Secure payments, insured ceremonies, and 24/7 customer support for complete peace of mind
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Popular Services Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span className="text-orange-800 font-medium">Most Popular</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-6">Sacred Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most sought-after spiritual ceremonies performed with devotion and authenticity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {popularServices.map((service) => (
              <Card key={service.id} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg overflow-hidden bg-white group">
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {service.price}
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs line-through opacity-75">
                      {service.originalPrice}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-sm text-gray-700 font-medium">{service.duration}</div>
                      <div className="text-xs text-gray-600">{service.bookings} bookings</div>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-orange-700 group-hover:text-orange-800 transition-colors">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-6 line-clamp-2">
                    {service.description}
                  </CardDescription>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full py-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Explore All 50+ Services
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our spiritual community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-b from-white to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs">
                      {testimonial.service}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600 text-white relative overflow-hidden">
        <FloatingElements />
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted Across India</h2>
            <p className="text-xl opacity-90">Our impact in numbers</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-lg opacity-90">Expert Pandits</div>
              <div className="text-sm opacity-70 mt-1">Verified & Trained</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">10,000+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
              <div className="text-sm opacity-70 mt-1">Satisfied Families</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-lg opacity-90">Cities Covered</div>
              <div className="text-sm opacity-70 mt-1">Pan-India Service</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-lg opacity-90">Support Available</div>
              <div className="text-sm opacity-70 mt-1">Always Here for You</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white relative overflow-hidden">
        <FloatingElements />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5 text-pink-300" />
              <span className="text-sm font-medium">Join the Spiritual Revolution</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to Begin Your <br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                Sacred Journey?
              </span>
            </h2>
            
            <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Join thousands of satisfied customers who trust E-GURUJI for their spiritual needs. 
              Experience the divine connection today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 px-10 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Book Your First Pooja
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm group"
              >
                <Users className="w-5 h-5 mr-2" />
                Join as Pandit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm opacity-75">
                ✨ Get 20% off on your first booking • No hidden charges • 100% satisfaction guaranteed
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
