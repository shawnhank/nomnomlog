import sendRequest from './sendRequest';

const BASE_URL = '/api/restaurants';

export function create(restaurantData) {
  return sendRequest(BASE_URL, 'POST', restaurantData);
}

export function getAll() {
  return sendRequest(BASE_URL);
}

export function getById(id) {
  return sendRequest(`${BASE_URL}/${id}`);
}

export function update(id, restaurantData) {
  return sendRequest(`${BASE_URL}/${id}`, 'PUT', restaurantData);
}

export function deleteRestaurant(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}