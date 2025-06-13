const yelpService = require('../services/yelpService');

module.exports = {
  search,
  getBusinessDetails,
  autocomplete
};

/**
 * Search for restaurants using Yelp API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function search(req, res) {
  try {
    const { term, location, limit = 10, offset = 0, sort_by = 'best_match' } = req.query;
    
    if (!term || !location) {
      return res.status(400).json({ error: 'Term and location are required' });
    }
    
    // Set up search options
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      sort_by,
      categories: 'restaurants,food'
    };
    
    const results = await yelpService.searchBusinesses(term, location, options);
    res.json(results);
  } catch (error) {
    console.error('Error in Yelp search controller:', error);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.description || 'Failed to search Yelp API' 
    });
  }
}

/**
 * Get business details by Yelp business ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getBusinessDetails(req, res) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Business ID is required' });
    }
    
    const business = await yelpService.getBusinessById(id);
    res.json(business);
  } catch (error) {
    console.error('Error in Yelp business details controller:', error);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.description || 'Failed to get business details from Yelp API' 
    });
  }
}

/**
 * Autocomplete search terms
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function autocomplete(req, res) {
  try {
    const { text, latitude, longitude } = req.query;
    
    if (!text) {
      return res.status(400).json({ error: 'Search text is required' });
    }
    
    const results = await yelpService.autocomplete(text, latitude, longitude);
    res.json(results);
  } catch (error) {
    console.error('Error in Yelp autocomplete controller:', error);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.description || 'Failed to get autocomplete results from Yelp API' 
    });
  }
}