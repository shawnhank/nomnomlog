import sendRequest from './sendRequest';

const BASE_URL = '/api/yelp';

/**
 * Search for restaurants using Yelp API
 * @param {string} term - Search term
 * @param {string} location - Location
 * @param {Object} options - Additional search parameters
 * @returns {Promise} - Promise with search results
 */
export function searchRestaurants(term, location, options = {}) {
  const params = new URLSearchParams({
    term,
    location,
    ...options
  });
  
  return sendRequest(`${BASE_URL}/search?${params.toString()}`);
}

/**
 * Get business details by Yelp business ID
 * @param {string} id - Yelp business ID
 * @returns {Promise} - Promise with business details
 */
export function getBusinessDetails(id) {
  return sendRequest(`${BASE_URL}/business/${id}`);
}

/**
 * Autocomplete search terms
 * @param {string} text - Text to autocomplete
 * @param {Object} options - Additional parameters (latitude, longitude)
 * @returns {Promise} - Promise with autocomplete results
 */
export function autocomplete(text, options = {}) {
  const params = new URLSearchParams({
    text,
    ...options
  });
  
  return sendRequest(`${BASE_URL}/autocomplete?${params.toString()}`);
}