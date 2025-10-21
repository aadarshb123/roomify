import { Auth } from './auth.js';
import { FeedController } from './feed.js';

let authInstance;

// Global function for debugging
window.showSignup = function() {
  console.log('showSignup called');
  if (authInstance) {
    console.log('Calling authInstance.openSignup()');
    authInstance.closeAuth();
    authInstance.openSignup();
  } else {
    console.error('authInstance not available');
  }
};

// Boot
window.addEventListener('DOMContentLoaded', ()=>{
  console.log('DOM loaded, initializing auth');
  authInstance = new Auth();
  const feed = new FeedController();
});
