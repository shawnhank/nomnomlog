import React, { useState, useEffect, useRef } from 'react';
import { autocomplete, searchRestaurants } from '../../services/yelp';

const YelpSearchAutocomplete = ({ onSelectRestaurant }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle autocomplete for restaurant name
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const results = await autocomplete(query);
          setSuggestions(results.businesses || []);
          setShowResults(true);
        } catch (error) {
          console.error('Error fetching autocomplete results:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle search for restaurants
  const handleSearch = async () => {
    if (!query || !location) return;
    
    setIsLoading(true);
    try {
      const results = await searchRestaurants(query, location);
      setSuggestions(results.businesses || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a restaurant from results
  const handleSelectRestaurant = async (businessId) => {
    setIsLoading(true);
    try {
      const businessDetails = await getBusinessDetails(businessId);
      
      // Format the data for our app
      const restaurantData = {
        name: businessDetails.name,
        address: [
          businessDetails.location.address1,
          businessDetails.location.address2,
          businessDetails.location.address3,
          businessDetails.location.city,
          businessDetails.location.state,
          businessDetails.location.zip_code
        ].filter(Boolean).join(', '),
        phone: businessDetails.phone,
        website: businessDetails.url,
        lat: businessDetails.coordinates?.latitude,
        long: businessDetails.coordinates?.longitude,
        yelpId: businessDetails.id,
        // If you have a field for images, you can add the first image
        restaurantImages: businessDetails.photos?.map((url, index) => ({
          url,
          isPrimary: index === 0,
          caption: ''
        })) || []
      };
      
      // Pass the data to the parent component
      onSelectRestaurant(restaurantData);
      setShowResults(false);
      setQuery('');
      setLocation('');
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-6">
      <h3 className="text-lg font-medium mb-2">Search Yelp</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Restaurant name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isLoading && (
            <div className="absolute right-3 top-2.5">
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (city, state)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!query || !location || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          Search
        </button>
      </div>
      
      {showResults && suggestions.length > 0 && (
        <div 
          ref={resultsRef}
          className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10"
        >
          {suggestions.map((business) => (
            <div
              key={business.id}
              onClick={() => handleSelectRestaurant(business.id)}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <div className="font-medium">{business.name}</div>
              {business.location && (
                <div className="text-sm text-gray-600">
                  {[
                    business.location.address1,
                    business.location.city,
                    business.location.state,
                    business.location.zip_code
                  ].filter(Boolean).join(', ')}
                </div>
              )}
              {business.categories && (
                <div className="text-xs text-gray-500 mt-1">
                  {business.categories.map(c => c.title).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YelpSearchAutocomplete;