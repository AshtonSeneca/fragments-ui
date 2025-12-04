// src/api.js
import { config } from './config';

const apiUrl = config.apiUrl;

console.log('API_URL:', apiUrl);

// Get all fragments for authenticated user, optionally with expanded metadata
export async function getUserFragments(user, expand = false) {
  const expandParam = expand ? '?expand=1' : '';
  try {
    const res = await fetch(`${apiUrl}/v1/fragments${expandParam}`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('getUserFragments error:', err);
    throw err;
  }
}

// Get metadata for specific fragment
export async function getFragmentInfo(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('getFragmentInfo error:', err);
    throw err;
  }
}

// Get fragment data by ID
export async function getFragmentData(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return await res.text();
  } catch (err) {
    console.error('getFragmentData error:', err);
    throw err;
  }
}

// Create a new fragment with given content type
export async function createFragment(user, content, contentType) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: user.authorizationHeaders(contentType),
      body: content,
    });
    
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`${res.status} ${res.statusText}: ${errorText}`);
    }
    
    // Get the Location header from the response
    const location = res.headers.get('Location');
    console.log('Location header:', location);
    
    // Parse the JSON response body
    const data = await res.json();
    console.log('Fragment created successfully', { data, location });
    
    // Return both the data and location
    return { data, location };
  } catch (err) {
    console.error('createFragment error:', err);
    throw err;
  }
}

export async function createTextFragment(user, text) {
  return createFragment(user, text, 'text/plain');
}