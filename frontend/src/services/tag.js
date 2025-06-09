import { getToken } from './authService';

const BASE_URL = '/api/tags';

// Get all tags
export async function getAll() {
  const res = await fetch(BASE_URL, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to fetch tags');
  }
}

// Create a new tag
export async function create(tagData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(tagData)
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to create tag');
  }
}

// Update a tag
export async function update(id, tagData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(tagData)
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to update tag');
  }
}

// Delete a tag
export async function deleteTag(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Failed to delete tag');
  }
}
