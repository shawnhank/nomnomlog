import { getToken } from './authService';

export default async function sendRequest(
  url,
  method = 'GET',
  payload = null
) {
  // Fetch accepts an options object as the 2nd argument
  // used to include a data payload, set headers, specifiy the method, etc.
  const options = { method };
  // If payload is a FormData object (used to upload files),
  // fetch will automatically set the Content-Type to 'multipart/form-data',
  // otherwise set the Content-Type header as usual
  if (payload instanceof FormData) {
    options.body = payload;
  } else if (payload) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }
  const token = getToken();
  if (token) {
    // Need to add an Authorization header
    // Use the Logical OR Assignment operator
    options.headers ||= {};
    // Older approach
    // options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, options);
  // if res.ok is false then something went wrong
  if (res.ok) return res.json();
  // Obtain error sent from server
  const err = await res.json();
  // Throw error to be handled in React
  throw new Error(err.message);
}