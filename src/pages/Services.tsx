import React, { useEffect, useState, useMemo, useCallback } from "react";

// Service images array for first 10 services
const serviceImages = [
  "/lovable-uploads/vaastu-shanti.png",
  "/lovable-uploads/griha-pravesh.png", 
  "/lovable-uploads/bhoomi-pooja.png",
  "/lovable-uploads/satya-narayan.png",
  "/lovable-uploads/durja-pooja.png",
  "/lovable-uploads/office-opening.png",
  "/lovable-uploads/mahalakshmi.png",
  "/lovable-uploads/ganpati-pooja.png",
  "/lovable-uploads/rudra-abhishek.png",
  "/lovable-uploads/mangalagaur.png"
];

// Optimized services data with better organization
const SERVICES_DATA = [
  {
    id: 1,
    title: "Vaastu Shanti",
    category: "REGULAR",
    img: serviceImages[0],
    price: "₹1000.00",
    link: "/product/1",
  },
  {
    id: 2,
    title: "Griha Pravesh",
    category: "REGULAR",
    img: serviceImages[1],
    price: "₹1200.00",
    link: "/product/2",
  },
  {
    id: 3,
    title: "Bhoomi Pooja",
    category: "REGULAR",
    img: serviceImages[2],
    price: "₹1100.00",
    link: "/product/3",
  },
  {
    id: 4,
    title: "Satya Narayan",
    category: "REGULAR",
    img: serviceImages[3],
    price: "₹900.00",
    link: "/product/4",
  },
  {
    id: 5,
    title: "Durja Pooja",
    category: "REGULAR",
    img: serviceImages[4],
    price: "₹1000.00",
    link: "/product/5",
  },
  {
    id: 6,
    title: "Office Opening Pooja",
    category: "REGULAR",
    img: serviceImages[5],
    price: "₹2000.00",
    link: "/product/6",
  },
  {
    id: 7,
    title: "Mahalakshmi Pooja",
    category: "REGULAR",
    img: serviceImages[6],
    price: "₹1400.00",
    link: "/product/7",
  },
  {
    id: 8,
    title: "Ganpati Pooja",
    category: "REGULAR",
    img: serviceImages[7],
    price: "₹1200.00",
    link: "/product/8",
  },
  {
    id: 9,
    title: "Rudra Abhishek",
    category: "REGULAR",
    img: serviceImages[8],
    price: "₹1800.00",
    link: "/product/9",
  },
  {
    id: 10,
    title: "Mangalagaur Pooja",
    category: "REGULAR",
    img: serviceImages[9],
    price: "₹1300.00",
    link: "/product/10",
  },
  {
    id: 11,
    title: "Ganpati Visarjan Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/8f56705a-3508-48d2-b025-b9746aa30f85.png",
    price: "₹900.00",
    link: "/product/11",
  },
  {
    id: 12,
    title: "Janmashtami Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/6953ad6b-9da3-45bc-bc02-63febada4a34.png",
    price: "₹1100.00",
    link: "/product/12",
  },
  {
    id: 13,
    title: "Diwali Lakshmi Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/7a18e668-8e8d-4d40-a8a8-a286e4089324.png",
    price: "₹2100.00",
    link: "/product/13",
  },
  {
    id: 14,
    title: "Ganapti Sthapana Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png",
    price: "₹1000.00",
    link: "/product/14",
  },
  {
    id: 15,
    title: "Udak Shanti",
    category: "SHANTI",
    img: "/lovable-uploads/251e248a-4351-49bd-8651-6aeefdaee648.png",
    price: "₹950.00",
    link: "/product/15",
  },
  {
    id: 16,
    title: "Navgraha Shanti",
    category: "SHANTI",
    img: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
    price: "₹1700.00",
    link: "/product/16",
  },
  {
    id: 17,
    title: "Ganapti Havan",
    category: "HAVAN",
    img: "/lovable-uploads/07f5ed97-9548-4467-b6f8-68cf9301ec72.png",
    price: "₹1500.00",
    link: "/product/17",
  },
  {
    id: 18,
    title: "Dhan Laxmi Pooja",
    category: "HAVAN",
    img: "/lovable-uploads/b9ec4e6a-73d1-4536-8eaa-809140586224.png",
    price: "₹2000.00",
    link: "/product/18",
  },
  {
    id: 19,
    title: "Ganesh Havan",
    category: "HAVAN",
    img: "/lovable-uploads/9ec09147-1249-4be2-9391-19df10c3d32f.png",
    price: "₹1600.00",
    link: "/product/19",
  },
  {
    id: 20,
    title: "Satyanarayan Havan",
    category: "HAVAN",
    img: "/lovable-uploads/1a779d2d-ca9c-4348-a5b7-1745de1e05fa.png",
    price: "₹1200.00",
    link: "/product/20",
  },
];

// Categories configuration
const CATEGORIES = {
  REGULAR: "Regular",
  FESTIVAL: "Festival", 
  SHANTI: "Shanti",
  HAVAN: "Havan"
};

// Price ranges configuration
const PRICE_RANGES = {
  budget: { label: "Budget (< ₹1,000)", min: 0, max: 999 },
  standard: { label: "Standard (₹1,000-1,500)", min: 1000, max: 1499 },
  premium: { label: "Premium (> ₹1,500)", min: 1500, max: Infinity }
};

interface Service {
  id: number;
  title: string;
  category: string;
  img: string | null;
  price: string;
  link: string;
}

// Optimized Link component with better accessibility
const Link = ({ to, children, className = "", ...props }) => (
  <a 
    href={to} 
    className={`cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${className}`}
    onClick={(e) => e.preventDefault()}
    {...props}
  >
    {children}
  </a>
);

// Optimized ServiceCard component to reduce re-renders
const ServiceCard = React.memo(({ service, onBookNow, onViewDetails }) => {
  const formatPrice = (price) => price + " onwards";
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 transform hover:scale-105">
      <div className="text-center mb-3">
        <div className="w-full h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
          {service.img ? (
            <img 
              src={service.img} 
              alt={service.title}
              className="w-16 h-16 object-cover rounded"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <span className="text-3xl" style={{ display: service.img ? 'none' : 'block' }}>
            🕉️
          </span>
        </div>
        <h3 className="text-lg font-semibold text-orange-800 mb-1 line-clamp-2">
          {service.title}
        </h3>
        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mb-2">
          {CATEGORIES[service.category] || service.category}
        </span>
      </div>
      
      <div className="text-center mb-3">
        <p className="text-orange-700 font-semibold text-sm">{formatPrice(service.price)}</p>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={() => onViewDetails(service)}
          className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          View Details
        </button>
        <button 
          onClick={() => onBookNow(service)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Book Now →
        </button>
      </div>
    </div>
  );
});

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [error, setError] = useState(null);

  // Optimized data fetching with error handling
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Simulate API call with realistic delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set services data
        setServices(SERVICES_DATA);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Optimized filtering logic with better performance
  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Search filter with trimmed input
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    // Price filter with optimized logic
    if (priceFilter && PRICE_RANGES[priceFilter]) {
      const { min, max } = PRICE_RANGES[priceFilter];
      filtered = filtered.filter(service => {
        const priceValue = parseFloat(service.price.replace(/[₹,]/g, ''));
        return priceValue >= min && priceValue <= max;
      });
    }

    return filtered;
  }, [searchTerm, categoryFilter, priceFilter, services]);

  // Optimized callback functions
  const handleViewDetails = useCallback((service) => {
    window.location.href = service.link;
  }, []);

  const handleBookNow = useCallback((service) => {
    window.location.href = `/credentials/${service.id}`;
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter("");
    setPriceFilter("");
  }, []);

  const retryFetch = useCallback(() => {
    window.location.reload();
  }, []);

  // Error state with retry functionality
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Services</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={retryFetch}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state with better UX
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasActiveFilters = searchTerm || categoryFilter || priceFilter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-orange-800 mb-4">
            Our Pooja Services
          </h1>
          <p className="text-lg text-orange-700 mb-8">
            Connect with experienced Pandits for authentic spiritual services
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for pooja services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-lg border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none bg-white transition-colors"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span className="text-orange-700 font-medium">Filters:</span>
              </div>
              
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none bg-white transition-colors"
              >
                <option value="">All Categories</option>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              
              <select 
                value={priceFilter} 
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none bg-white transition-colors"
              >
                <option value="">All Prices</option>
                {Object.entries(PRICE_RANGES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-orange-700">
            Showing {filteredServices.length} of {services.length} services
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">No services found</h3>
            <p className="text-orange-700">
              {hasActiveFilters ? 
                "Try adjusting your filters or search terms" : 
                "No services available at the moment"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
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

        {/* Bottom CTA */}
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-orange-800 mb-4">
            Need a Custom Pooja Service?
          </h3>
          <p className="text-lg text-orange-700 mb-6">
            Can't find what you're looking for? Contact us for personalized pooja arrangements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Us
              </button>
            </Link>
            <Link to="/auth?role=customer">
              <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Register Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}