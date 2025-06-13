import React, { useState, useEffect } from 'react';
import { searchNearby } from '../../services/yelp';
import { useNavigate } from 'react-router';
import * as restaurantService from '../../services/restaurants';

const NearbyRestaurants = () => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Get user's location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchNearbyRestaurants(latitude, longitude);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  // Fetch nearby restaurants
  const fetchNearbyRestaurants = async (latitude, longitude) => {
    try {
      const results = await searchNearby(latitude, longitude, {
        limit: 10,
        sort_by: 'distance'
      });
      
      setNearbyRestaurants(results.businesses || []);
    } catch (err) {
      console.error('Error fetching nearby restaurants:', err);
      setError('Unable to load nearby restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add a restaurant from Yelp to your app
  const addRestaurant = async (business) => {
    try {
      setLoading(true);
      
      // Format the restaurant data
      const restaurantData = {
        name: business.name,
        address: [
          business.location.address1,
          business.location.address2,
          business.location.address3,
          business.location.city,
          business.location.state,
          business.location.zip_code
        ].filter(Boolean).join(', '),
        phone: business.phone,
        website: business.url,
        lat: business.coordinates?.latitude,
        long: business.coordinates?.longitude,
        yelpId: business.id,
        restaurantImages: business.image_url ? [
          {
            url: business.image_url,
            isPrimary: true,
            caption: business.name
          }
        ] : []
      };
      
      // Create the restaurant
      const newRestaurant = await restaurantService.create(restaurantData);
      
      // Navigate to the new restaurant
      navigate(`/restaurants/${newRestaurant._id}`);
    } catch (err) {
      console.error('Error adding restaurant:', err);
      setError('Unable to add restaurant. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Find Nearby Restaurants</h3>
      
      {!userLocation && !loading && (
        <button
          onClick={getUserLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Use My Location
        </button>
      )}
      
      {loading && (
        <div className="flex items-center justify-center py-4">
          <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 mb-4">
          {error}
        </div>
      )}
      
      {nearbyRestaurants.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Restaurants Near You</h4>
          <div className="space-y-3">
            {nearbyRestaurants.map((business) => (
              <div key={business.id} className="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <div className="flex">
                  {business.image_url && (
                    <img 
                      src={business.image_url} 
                      alt={business.name} 
                      className="w-16 h-16 object-cover rounded-md mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium">{business.name}</h5>
                    <div className="text-sm text-gray-600">
                      {business.location.address1}, {business.location.city}
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <div className="flex items-center text-yellow-500 mr-2">
                        {Array.from({ length: Math.floor(business.rating) }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                        {business.rating % 1 !== 0 && <span>½</span>}
                      </div>
                      <span className="text-gray-500">
                        {business.review_count} reviews
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => addRestaurant(business)}
                      className="px-3 py-1 bg