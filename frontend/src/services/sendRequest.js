import { getToken } from './authService';

export default async function sendRequest(url, method = 'GET', payload = null, additionalHeaders = {}) {
  // Add a cache-busting query parameter to all GET requests
  if (method === 'GET') {
    // Add a timestamp to prevent caching
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}_t=${Date.now()}`;
  }
  
  const options = { method };
  options.headers = { ...additionalHeaders };
  
  if (payload) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(payload);
  }
  
  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add cache control headers to prevent caching
  options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  options.headers['Pragma'] = 'no-cache';
  options.headers['Expires'] = '0';
  
  const res = await fetch(url, options);
  
  // Handle 304 Not Modified as a success case
  if (res.status === 304) {
    console.log('Got 304 response, retrying with cache disabled');
    // For 304, retry the request with a different timestamp
    return sendRequest(`${url}&_retry=${Date.now()}`, method, payload, additionalHeaders);
  }
  
  if (res.ok) return res.json();
  
  throw new Error('Bad Request');
}