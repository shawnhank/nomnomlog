import sendRequest from './sendRequest';
import { getToken } from './authService';

const BASE_URL = '/api/restaurants';

export function create(restaurantData) {
  return sendRequest(BASE_URL, 'POST', restaurantData);
}

export function getAll() {
  return sendRequest(BASE_URL);
}

export function getById(id, noCache = false) {
  const headers = {};
  
  // Add cache control if needed
  if (noCache) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
  }
  
  return sendRequest(`${BASE_URL}/${id}`, 'GET', null, headers);
}

export function update(id, restaurantData) {
  return sendRequest(`${BASE_URL}/${id}`, 'PUT', restaurantData);
}

export async function deleteRestaurant(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

// Toggle favorite status
export async function toggleFavorite(id) {
  const res = await fetch(`${BASE_URL}/${id}/favorite`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to toggle favorite status');
  }
}

// Get all favorite restaurants
export async function getFavorites() {
  const res = await fetch(`${BASE_URL}/favorites`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch favorite restaurants');
  }
}

// Set thumbs rating
export async function setThumbsRating(id, isThumbsUp) {
  const res = await fetch(`${BASE_URL}/${id}/thumbs`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ isThumbsUp })
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to set thumbs rating');
  }
}

// Get all thumbs up restaurants
export function getThumbsUp() {
  return sendRequest(`${BASE_URL}/thumbs-up`);
}

// Get all thumbs down restaurants
export function getThumbsDown() {
  return sendRequest(`${BASE_URL}/thumbs-down`);
}

// Get all unrated restaurants
export function getUnrated() {
  return sendRequest(`${BASE_URL}/unrated`);
}
