import { getToken } from './authService';

const BASE_URL = '/api/meals';

async function sendRequest(url, method = 'GET', payload = null) {
  const options = { method };
  if (payload) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }
  
  // Add authorization header
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${getToken()}`
  };
  
  const res = await fetch(url, options);
  if (res.ok) {
    // For DELETE requests that return 204 No Content
    if (res.status === 204) return null;
    return res.json();
  } else {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Request failed');
  }
}

// Get all meals
export async function getAll() {
  return sendRequest(BASE_URL);
}

// Get meal by ID
export async function getById(id) {
  return sendRequest(`${BASE_URL}/${id}`);
}

// Create a new meal
export async function create(mealData) {
  return sendRequest(BASE_URL, 'POST', mealData);
}

// Update a meal
export async function update(id, mealData) {
  return sendRequest(`${BASE_URL}/${id}`, 'PUT', mealData);
}

// Delete a meal
export async function deleteMeal(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

// Toggle favorite status
export async function toggleFavorite(id) {
  return sendRequest(`${BASE_URL}/${id}/favorite`, 'PUT');
}

// Set thumbs rating
export async function setThumbsRating(id, isThumbsUp) {
  return sendRequest(`${BASE_URL}/${id}/thumbs`, 'PUT', { isThumbsUp });
}

// Get all favorite meals
export async function getFavorites() {
  return sendRequest(`${BASE_URL}/favorites`);
}

// Get all thumbs up meals
export async function getThumbsUp() {
  return sendRequest(`${BASE_URL}/thumbs-up`);
}

// Get all thumbs down meals
export async function getThumbsDown() {
  return sendRequest(`${BASE_URL}/thumbs-down`);
}

// Get all unrated meals
export async function getUnrated() {
  return sendRequest(`${BASE_URL}/unrated`);
}
