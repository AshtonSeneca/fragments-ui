// src/app.js
import { signIn, getUser } from './auth';
import { getUserFragments, createFragment, getFragmentInfo } from './api';

async function displayFragments(user) {
  const fragmentsList = document.querySelector('#fragments-list');
  fragmentsList.innerHTML = '<p>Loading fragments...</p>';

  try {
    const response = await getUserFragments(user, true);
    console.log('Fragments response:', response);

    const fragments = response.fragments;

    if (!fragments || fragments.length === 0) {
      fragmentsList.innerHTML = '<p>No fragments found. Create one to get started!</p>';
      return;
    }

    let html = `<p>Total fragments: ${fragments.length}</p>`;
    
    for (const fragment of fragments) {
      const createdDate = new Date(fragment.created).toLocaleString();
      const updatedDate = new Date(fragment.updated).toLocaleString();
      
      html += `
        <div class="fragment-item">
          <p><strong>ID:</strong> ${fragment.id}</p>
          <p><strong>Type:</strong> ${fragment.type}</p>
          <p><strong>Size:</strong> ${fragment.size} bytes</p>
          <p><strong>Created:</strong> ${createdDate}</p>
          <p><strong>Updated:</strong> ${updatedDate}</p>
          <p><strong>Owner ID:</strong> ${fragment.ownerId}</p>
        </div>
      `;
    }

    fragmentsList.innerHTML = html;
  } catch (err) {
    console.error('Error loading fragments:', err);
    fragmentsList.innerHTML = `<p style="color: red;">Error loading fragments: ${err.message}</p>`;
  }
}

async function init() {
  console.log('App initializing...');
  
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const usernameEl = document.querySelector('.username');
  const form = document.querySelector('#create-form');
  const input = document.querySelector('#frag-input');
  const fragmentTypeSelect = document.querySelector('#fragment-type');
  const result = document.querySelector('#result');
  const refreshBtn = document.querySelector('#refresh-fragments');

  loginBtn.onclick = async () => {
    try {
      await signIn();
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed: ' + err.message);
    }
  };

  const user = await getUser();
  console.log('User:', user);
  
  if (user) {
    userSection.hidden = false;
    usernameEl.textContent = user.username;
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logged In';

    await displayFragments(user);

    refreshBtn.onclick = async () => {
      await displayFragments(user);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      result.textContent = 'Creating fragment...';
      
      try {
        const content = input.value.trim();
        const contentType = fragmentTypeSelect.value;

        if (!content) {
          result.textContent = 'Error: Fragment content cannot be empty';
          return;
        }

        console.log('Creating fragment:', { contentType, content });
        
        const { data, location } = await createFragment(user, content, contentType);
        
        result.textContent =
          `✓ Fragment Created Successfully!\n\n` +
          `Status: 201\n` +
          `Location: ${location || 'N/A'}\n\n` +
          `Fragment Details:\n` +
          JSON.stringify(data, null, 2);

        input.value = '';
        await displayFragments(user);
      } catch (err) {
        console.error('Create fragment error:', err);
        result.textContent = `Error: ${err.message}`;
      }
    });
  }
}

addEventListener('DOMContentLoaded', init);