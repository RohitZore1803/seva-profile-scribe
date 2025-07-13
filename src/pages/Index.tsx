
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-orange-800 mb-4">
            E-GURUJI
          </h1>
          <p className="text-lg text-orange-700 mb-8">
            Connect with experienced Pandits for authentic Pooja services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/services" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Services
            </Link>
            <Link 
              to="/auth" 
              className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In / Register
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">Expert Pandits</h3>
            <p className="text-gray-600">Connect with verified and experienced Pandits</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">Easy Booking</h3>
            <p className="text-gray-600">Schedule your Pooja services with flexible dates</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">At Your Location</h3>
            <p className="text-gray-600">Services delivered at your home or preferred venue</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">Popular Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-orange-700">Ganesh Pooja</h4>
              <p className="text-sm text-gray-600 mt-1">₹1500 onwards</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-orange-700">Satyanarayan Pooja</h4>
              <p className="text-sm text-gray-600 mt-1">₹2000 onwards</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-orange-700">Griha Pravesh</h4>
              <p className="text-sm text-gray-600 mt-1">₹3000 onwards</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-orange-700">Wedding Ceremonies</h4>
              <p className="text-sm text-gray-600 mt-1">₹5000 onwards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
