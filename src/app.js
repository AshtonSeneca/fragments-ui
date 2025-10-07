// // src/app.js
// src/app.js
import { signIn, getUser } from './auth';
import { getUserFragments } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    signIn();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    return;
  }

  // Expose the signed-in user for easy inspection in DevTools
  // e.g., __lastUser.idToken and __lastUser.accessToken
  window.__lastUser = user;
  // Quick sanity log to confirm tokens are present
  console.log('tokens', {
    idFirst: user.idToken?.slice(0, 24),
    accessFirst: user.accessToken?.slice(0, 24),
  });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  try {
    const userFragments = await getUserFragments(user);
    console.log('Fragments:', userFragments);
  } catch (err) {
    console.error('Unable to load fragments:', err);
  }

  // TODO: later in the course, we will show all the user's fragments in the HTML...
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);

// import { signIn, getUser } from './auth';
// import { getUserFragments } from './api';

// async function init() {
//   // Get our UI elements
//   const userSection = document.querySelector('#user');
//   const loginBtn = document.querySelector('#login');

//   // Wire up event handlers to deal with login and logout.
//   loginBtn.onclick = () => {
//     // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
//     signIn();
//   };

//   // See if we're signed in (i.e., we'll have a `user` object)
//   const user = await getUser();
//   if (!user) {
//     return;
//   }

//   // Update the UI to welcome the user
//   userSection.hidden = false;

//   // Show the user's username
//   userSection.querySelector('.username').innerText = user.username;

//   // Disable the Login button
//   loginBtn.disabled = true;

//   // Do an authenticated request to the fragments API server and log the result
//   const userFragments = await getUserFragments(user);

//   // TODO: later in the course, we will show all the user's fragments in the HTML...
// }

// // Wait for the DOM to be ready, then start the app
// addEventListener('DOMContentLoaded', init);
