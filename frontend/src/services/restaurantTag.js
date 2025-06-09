import { getToken } from './authService';

const BASE_URL = '/api/restaurant-tags';

// Get all tags for a restaurant
export async function getAllForRestaurant(restaurantId) {
  const res = await fetch(`${BASE_URL}/restaurant/${restaurantId}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch restaurant tags');
  }
}

// Create a new restaurant-tag relationship
export async function create(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to create restaurant tag');
  }
}

// Delete a restaurant-tag relationship
export async function deleteRestaurantTag(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to delete restaurant tag');
  }
}

// Delete all tags for a restaurant
export async function deleteAllForRestaurant(restaurantId) {
  const res = await fetch(`${BASE_URL}/restaurant/${restaurantId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to delete all restaurant tags');
  }
}