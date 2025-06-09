import sendRequest from './sendRequest';

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

export function deleteRestaurant(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}
