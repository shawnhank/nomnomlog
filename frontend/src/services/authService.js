import sendRequest from "./sendRequest";

const BASE_URL = '/api/auth';

export async function signUp(userData) {
  const token = await sendRequest(BASE_URL + '/signup', 'POST', userData);
  localStorage.setItem('token', token);
  return getUser();
}

export async function logIn(credentials) {
  const token = await sendRequest(`${BASE_URL}/login`, 'POST', credentials);
  localStorage.setItem('token', token);
  return getUser();
}

export function getUser() {
  const token = getToken();
  return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

export function getToken() {
  // getItem returns null if there's no key
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  // A JWT's exp is expressed in seconds, not milliseconds, so convert
  if (payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
    return null;
  }
  return token;
}

// Update user profile
export async function updateProfile(userData) {
  try {
    // Change from /users/profile to /profile which matches the backend route
    const response = await sendRequest(`${BASE_URL}/profile`, 'PUT', userData);
    
    // Update the stored token with the response
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    // Get the updated user from the token
    const updatedUser = getUser();
    
    // Store the user data in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (err) {
    console.error('Error updating profile:', err);
    throw new Error(err.message);
  }
}

export async function changePassword(passwordData) {
  return sendRequest(`${BASE_URL}/password`, 'PUT', passwordData);
}


export async function logOut() {
  try {
    // Call the logout API endpoint
    await sendRequest(`${BASE_URL}/logout`, 'POST');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove the token from localStorage
    localStorage.removeItem('token');
  }
}

export async function forgotPassword(email) {
  const response = await sendRequest(`${BASE_URL}/forgot-password`, 'POST', { email });
  return response;
}

export async function resetPassword(token, password) {
  const response = await sendRequest(`${BASE_URL}/reset-password/${token}`, 'POST', { password });
  return response;
}
