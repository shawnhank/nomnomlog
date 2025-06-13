import React, { useState, useEffect } from 'react';
import { getBusinessDetails, getBusinessReviews } from '../../services/yelp';

const YelpIntegration = ({ yelpId }) => {
  const [yelpData, setYelpData] = useState(null);
  const [yelpReviews, setYelpReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchYelpData() {
      if (!yelpId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch business details and reviews in parallel
        const [businessData, reviewsData] = await Promise.all([
          getBusinessDetails(yelpId),
          getBusinessReviews(yelpId)
        ]);
        
        setYelpData(businessData);
        setYelpReviews(reviewsData.reviews || []);
      } catch (err) {
        console.error('Error fetching Yelp data:', err);
        setError('Unable to load Yelp data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchYelpData();
  }, [yelpId]);

  if (!yelpId) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-6 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (!yelpData) {
    return null;
  }

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center mb-4">
        <img 
          src="/images/yelp-logo.png" 
          alt="Yelp" 
          className="h-6 mr-2" 
        />
        <h3 className="text-lg font-medium">Yelp Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="font-medium mr-2">Rating:</span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{yelpData.rating}</span>
              <span className="text-gray-500 ml-1">({yelpData.review_count} reviews)</span>
            </div>
          </div>
          
          <div className="mb-2">
            <span className="font-medium mr-2">Price:</span>
            <span>{yelpData.price || 'Not available'}</span>
          </div>
          
          <div className="mb-2">
            <span className="font-medium mr-2">Categories:</span>
            <span>
              {yelpData.categories?.map(cat => cat.title).join(', ') || 'Not available'}
            </span>
          </div>
        </div>
        
        <div>
          <div className="mb-2">
            <span className="font-medium mr-2">Hours:</span>
            {yelpData.hours ? (
              <div className="text-sm">
                {yelpData.hours[0]?.open?.map((day, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <span>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day.day]}:
                    </span>
                    <span>
                      {day.start.slice(0, 2)}:{day.start.slice(2)} - 
                      {day.end.slice(0, 2)}:{day.end.slice(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span>Not available</span>
            )}
          </div>
        </div>
      </div>
      
      {yelpReviews.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Recent Reviews</h4>
          <div className="space-y-3">
            {yelpReviews.slice(0, 3).map((review, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center mb-1">
                  <div className="flex items-center text-yellow-500 mr-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.time_created).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{review.text}</p>
                <a 
                  href={review.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  Read full review on Yelp
                </a>
              </div>
            ))}
          </div>
          <a 
            href={yelpData.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-3 inline-block"
          >
            View more on Yelp
          </a>
        </div>
      )}
    </div>
  );
};

export default YelpIntegration;