// src/auth.js
import { UserManager } from 'oidc-client-ts';
import { config } from './config';

const POOL_ID = config.cognito.poolId;
const CLIENT_ID = config.cognito.clientId;
const REDIRECT_URI = config.cognito.redirectUri;

console.log('Auth Config:', { POOL_ID, CLIENT_ID, REDIRECT_URI });

const region = POOL_ID.split('_')[0];
const authority = `https://cognito-idp.${region}.amazonaws.com/${POOL_ID}`;

const userManager = new UserManager({
  authority,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: 'code',
  scope: 'email openid profile',
  loadUserInfo: true,
  revokeTokenTypes: ['refresh_token'],
  automaticSilentRenew: false,
});

export async function signIn() {
  try {
    console.log('Attempting sign in...');
    await userManager.signinRedirect();
  } catch (err) {
    console.error('Sign in error:', err);
    throw err;
  }
}

function formatUser(user) {
  console.log('Raw user object from Cognito:', user);
  
  const idToken = user?.id_token || user?.idToken;
  const accessToken = user?.access_token || user?.accessToken;
  
  console.log('Extracted tokens:', { 
    idToken: idToken ? `${idToken.substring(0, 20)}...` : 'MISSING',
    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'MISSING',
    allKeys: Object.keys(user)
  });
  
  if (!idToken) {
    console.error('No id_token found in user object!');
    console.error('User object structure:', JSON.stringify(user, null, 2));
  }
  
  return {
    username: user?.profile?.name || user?.profile?.['cognito:username'] || user?.profile?.email || 'User',
    email: user?.profile?.email,
    idToken,
    accessToken,
    authorizationHeaders(contentType) {
      if (!idToken) {
        console.error('Cannot create auth headers - no token available!');
        return {};
      }
      
      const headers = {
        Authorization: `Bearer ${idToken}`,
      };
      
      if (contentType) {
        headers['Content-Type'] = contentType;
      }
      
      console.log('Generated headers:', {
        Authorization: `Bearer ${idToken.substring(0, 20)}...`,
        'Content-Type': contentType
      });
      
      return headers;
    },
  };
}

export async function getUser() {
  try {
    if (window.location.search.includes('code=')) {
      console.log('Processing OAuth callback...');
      const user = await userManager.signinCallback();
      console.log('Callback user:', user);
      
      window.history.replaceState({}, document.title, window.location.pathname);
      return formatUser(user);
    }
    
    const user = await userManager.getUser();
    console.log('Existing user:', user);
    
    return user ? formatUser(user) : null;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
}