import { getToken } from './authService';

const BASE_URL = '/api/meal-tags';

// Get all tags for a meal
export async function getAllForMeal(mealId) {
  const res = await fetch(`${BASE_URL}/meal/${mealId}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch meal tags');
  }
}

// Create a new meal-tag relationship
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
    throw new Error('Failed to create meal tag');
  }
}

// Delete a meal-tag relationship
export async function deleteMealTag(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to delete meal tag');
  }
}

// Delete all tags for a meal
export async function deleteAllForMeal(mealId) {
  const res = await fetch(`${BASE_URL}/meal/${mealId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to delete meal tags');
  }
}