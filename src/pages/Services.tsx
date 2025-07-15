import React, { useEffect, useState, useMemo } from "react";

// Mock data for testing - replace with your actual data source
const mockServices = [
  {
    id: 1,
    name: "Ganesh Chaturthi Pooja",
    description: "Traditional Ganesh Chaturthi celebration with complete rituals and arrangements",
    price: 250000, // in paise
    image: null,
    duration_hours: 3,
    requirements: "Coconut, flowers, sweets",
    benefits: "Removes obstacles, brings prosperity",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Lakshmi Pooja",
    description: "Complete Lakshmi Pooja for wealth and prosperity",
    price: 150000,
    image: null,
    duration_hours: 2,
    requirements: "Lotus flowers, sweets, coins",
    benefits: "Brings wealth and fortune",
    created_at: "2024-01-14T10:00:00Z"
  },
  {
    id: 3,
    name: "Satyanarayan Katha",
    description: "Traditional Satyanarayan Katha with complete arrangements",
    price: 500000,
    image: null,
    duration_hours: 4,
    requirements: "Fruits, flowers, prasad",
    benefits: "Fulfills wishes, brings peace",
    created_at: "2024-01-13T10:00:00Z"
  }
];

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

// Simple components to replace UI library dependencies
const Button = ({ children, className = "", variant = "default", size = "default", onClick, ...props }) => {
  const baseStyles = "px-4 py-2 rounded font-medium transition-all duration-200 cursor-pointer border-none outline-none";
  const variants = {
    default: "bg-orange-600 text-white hover:bg-orange-700",
    outline: "border-2 border-orange-600 text-orange-600 bg-transparent hover:bg-orange-50"
  };
  const sizes = {
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input 
    className={`w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-orange-400 focus:outline-none ${className}`}
    {...props}
  />
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-bold ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-gray-600 ${className}`}>
    {children}
  </p>
);

const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

const Select = ({ value, onValueChange, children, className = "" }) => (
  <select 
    value={value} 
    onChange={(e) => onValueChange(e.target.value)}
    className={`px-3 py-2 border-2 border-gray-300 rounded-md focus:border-orange-400 focus:outline-none ${className}`}
  >
    <option value="">Select...</option>
    {children}
  </select>
);

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// Simple icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Mock Link component
const Link = ({ to, children, className = "" }) => (
  <a href={to} className={`cursor-pointer ${className}`} onClick={(e) => e.preventDefault()}>
    {children}
  </a>
);

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchServices = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setServices(mockServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Memoized filtered services for better performance
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(service => {
        const nameMatch = service.name?.toLowerCase().includes(searchLower) || false;
        const descriptionMatch = service.description?.toLowerCase().includes(searchLower) || false;
        return nameMatch || descriptionMatch;
      });
    }

    // Price filter
    if (priceFilter) {
      filtered = filtered.filter(service => {
        if (service.price === null || service.price === undefined) return false;
        
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

    // Duration filter
    if (durationFilter) {
      filtered = filtered.filter(service => {
        if (service.duration_hours === null || service.duration_hours === undefined) return false;
        
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

    return filtered;
  }, [searchTerm, priceFilter, durationFilter, services]);

  const formatPrice = (priceInPaise: number | null) => {
    if (priceInPaise === null || priceInPaise === undefined) return "Contact for price";
    if (priceInPaise === 0) return "Free";
    return `₹${(priceInPaise / 100).toLocaleString()}`;
  };

  const getPriceCategory = (priceInPaise: number | null) => {
    if (priceInPaise === null || priceInPaise === undefined) return "contact";
    if (priceInPaise === 0) return "free";
    
    const price = priceInPaise / 100;
    if (price < 2000) return "budget";
    if (price < 5000) return "standard";
    return "premium";
  };

  const getPriceBadgeColor = (category: string) => {
    switch (category) {
      case "free": return "bg-green-100 text-green-800";
      case "budget": return "bg-blue-100 text-blue-800";
      case "standard": return "bg-yellow-100 text-yellow-800";
      case "premium": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("");
    setDurationFilter("");
  };

  const getDurationDisplay = (hours: number | null) => {
    if (hours === null || hours === undefined) return "Duration varies";
    if (hours === 0) return "Quick service";
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
  };

  // Error state
  if (error && !loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fed7aa, #fbbf24)', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>Error Loading Services</h2>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fed7aa, #fbbf24)', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                border: '3px solid #f3f4f6', 
                borderTop: '3px solid #ea580c', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p style={{ color: '#6b7280' }}>Loading services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fed7aa, #fbbf24)', padding: '2rem' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#9a3412', marginBottom: '1rem' }}>
            Our Pooja Services
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '48rem', margin: '0 auto 2rem' }}>
            Discover authentic spiritual services performed by experienced Pandits at your convenience
          </p>
          
          {/* Search and Filter Bar */}
          <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                <SearchIcon />
              </div>
              <Input
                type="text"
                placeholder="Search for pooja services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', fontSize: '1.125rem' }}
              />
            </div>
            
            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FilterIcon />
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Filters:</span>
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter} style={{ width: '10rem' }}>
                <SelectItem value="budget">Budget (&lt; ₹2,000)</SelectItem>
                <SelectItem value="standard">Standard (₹2,000-5,000)</SelectItem>
                <SelectItem value="premium">Premium (&gt; ₹5,000)</SelectItem>
              </Select>

              <Select value={durationFilter} onValueChange={setDurationFilter} style={{ width: '10rem' }}>
                <SelectItem value="short">Short (≤ 2 hours)</SelectItem>
                <SelectItem value="medium">Medium (2-4 hours)</SelectItem>
                <SelectItem value="long">Long (&gt; 4 hours)</SelectItem>
              </Select>

              {(searchTerm || priceFilter || durationFilter) && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#6b7280' }}>
            Showing {filteredServices.length} of {services.length} services
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.5rem' }}>No services found</h3>
            <p style={{ color: '#9ca3af' }}>
              {searchTerm || priceFilter || durationFilter ? 
                "Try adjusting your filters or search terms" : 
                "No services available at the moment"
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: '12rem', background: 'linear-gradient(to bottom right, #fed7aa, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>🕉️</span>
                  </div>
                  
                  {/* Price Badge */}
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <Badge className={getPriceBadgeColor(getPriceCategory(service.price))}>
                      {formatPrice(service.price)}
                    </Badge>
                  </div>
                  
                  {/* Service Category Badge */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <Badge className="bg-orange-600 text-white">
                      Traditional
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-orange-700 line-clamp-2">
                    {service.name || "Untitled Service"}
                  </CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ClockIcon />
                      <span>{getDurationDisplay(service.duration_hours)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPinIcon />
                      <span>At location</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent style={{ paddingTop: 0 }}>
                  <CardDescription className="line-clamp-3" style={{ marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {service.description || "Traditional pooja service performed with authentic rituals and proper arrangements."}
                  </CardDescription>
                  
                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', color: '#fbbf24' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>(4.8/5)</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to={`/product/${service.id}`}>
                      <Button 
                        variant="outline" 
                        style={{ width: '100%', fontSize: '0.875rem' }}
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/credentials/${service.id}`}>
                      <Button style={{ width: '100%', fontSize: '0.875rem' }}>
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
        <div style={{ textAlign: 'center', marginTop: '4rem', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(4px)', borderRadius: '1rem', padding: '2rem', maxWidth: '64rem', margin: '4rem auto 0' }}>
          <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#9a3412', marginBottom: '1rem' }}>
            Need a Custom Pooja Service?
          </h3>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            Can't find what you're looking for? Contact us for personalized pooja arrangements
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <Link to="/contact">
              <Button size="lg" style={{ borderRadius: '9999px' }}>
                Contact Us
              </Button>
            </Link>
            <Link to="/auth?role=customer">
              <Button size="lg" variant="outline" style={{ borderRadius: '9999px' }}>
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
