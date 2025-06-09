import sendRequest from './sendRequest';

const BASE_URL = '/api/restaurant';

export function create(restaurantData) {
  return sendRequest(BASE_URL, 'POST', restaurantData);
}