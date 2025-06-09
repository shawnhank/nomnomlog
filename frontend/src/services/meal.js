import { getToken } from './authService';

const BASE_URL = '/api/meals';

// Get all meals
export async function getAll() {
  const res = await fetch(BASE_URL, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch meals');
  }
}

// Get meal by ID
export async function getById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch meal');
  }
}

// Create a new meal
export async function create(mealData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(mealData)
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to create meal');
  }
}

// Update a meal
export async function update(id, mealData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(mealData)
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to update meal');
  }
}

// Delete a meal
export async function deleteMeal(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to delete meal');
  }
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

// Get all favorite meals
export async function getFavorites() {
  const res = await fetch(`${BASE_URL}/favorites`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch favorite meals');
  }
}