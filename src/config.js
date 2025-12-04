// src/config.js

export const config = {
  apiUrl: process.env.API_URL || 'http://54.235.18.43:8080',
  cognito: {
    poolId: process.env.AWS_COGNITO_POOL_ID || 'us-east-1_09DPjH0Gn',
    clientId: process.env.AWS_COGNITO_CLIENT_ID || '2gr73fhi7aogfoobcb8cjkrsgm',
    redirectUri: process.env.OAUTH_SIGN_IN_REDIRECT_URL || 'http://localhost:3000',
  }
};