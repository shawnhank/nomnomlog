const axios = require('axios');
require('dotenv').config();

// Yelp API configuration
const YELP_API_KEY = process.env.YELP_API_KEY;
const YELP_BASE_URL = 'https://api.yelp.com/v3';

// Create axios instance with default headers
const yelpAxios = axios.create({
  baseURL: YELP_BASE_URL,
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
    Accept: 'application/json'
  }
});

/**
 * Search for businesses by term and location
 * @param {string} term - Search term (e.g. "coffee", "restaurants")
 * @param {string} location - Location (e.g. "San Francisco, CA")
 * @param {Object} options - Additional search parameters
 * @returns {Promise} - Promise with search results
 */
async function searchBusinesses(term, location, options = {}) {
  try {
    const params = {
      term,
      location,
      ...options
    };
    
    const response = await yelpAxios.get('/businesses/search', { params });
    return response.data;
  } catch (error) {
    console.error('Yelp API search error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get business details by Yelp business ID
 * @param {string} id - Yelp business ID
 * @returns {Promise} - Promise with business details
 */
async function getBusinessById(id) {
  try {
    const response = await yelpAxios.get(`/businesses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Yelp API business details error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Autocomplete search terms
 * @param {string} text - Text to autocomplete
 * @param {string} latitude - Latitude
 * @param {string} longitude - Longitude
 * @returns {Promise} - Promise with autocomplete results
 */
async function autocomplete(text, latitude, longitude) {
  try {
    const params = {
      text,
      latitude,
      longitude
    };
    
    const response = await yelpAxios.get('/autocomplete', { params });
    return response.data;
  } catch (error) {
    console.error('Yelp API autocomplete error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  searchBusinesses,
  getBusinessById,
  autocomplete
};