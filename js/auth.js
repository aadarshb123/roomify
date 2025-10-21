export class Auth{
  constructor(){
    console.log('Auth constructor called');
    
    // Get DOM elements
    this.authView = document.getElementById('authView');
    this.profileView = document.getElementById('profileView');
    this.profileTab = document.getElementById('profileTab');
    this.authErr = document.getElementById('authErr');
    this.loginForm = document.getElementById('loginForm');
    this.email = document.getElementById('email');
    this.password = document.getElementById('password');
    this.remember = document.getElementById('remember');
    this.togglePw = document.getElementById('togglePw');
    this.signInBtn = document.getElementById('signInBtn');
    this.signOutBtn = document.getElementById('signOutBtn');
    this.closeProfile = document.getElementById('closeProfile');
    this.welcome = document.getElementById('welcome');

    this.userEmail = localStorage.getItem('userEmail');
    console.log('User email from storage:', this.userEmail);
    
    this.init();
  }

  init(){
    console.log('Initializing auth...');
    
    // Password show/hide toggle
    if(this.togglePw){
      this.togglePw.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Toggle password clicked');
        const isPassword = this.password.type === 'password';
        this.password.type = isPassword ? 'text' : 'password';
        this.togglePw.textContent = isPassword ? 'Hide' : 'Show';
      });
    }
    
    // Form validation
    const validateLogin = () => {
      if(!this.email || !this.password || !this.signInBtn) return false;
      
      const emailValid = this.email.value.includes('@');
      const passwordValid = this.password.value.length >= 6;
      const isValid = emailValid && passwordValid;
      
      this.signInBtn.disabled = !isValid;
      console.log('Validation:', { emailValid, passwordValid, isValid });
      return isValid;
    };
    
    // Add input listeners for validation
    if(this.email) this.email.addEventListener('input', validateLogin);
    if(this.password) this.password.addEventListener('input', validateLogin);
    
    // Login form submission
    if(this.loginForm){
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        if(!validateLogin()){
          this.authErr.textContent = 'Please enter a valid email and password (6+ characters)';
          return;
        }
        
        // Success - log in user
        this.userEmail = this.email.value;
        localStorage.setItem('userEmail', this.userEmail);
        
        console.log('Login successful for:', this.userEmail);
        this.closeAuth();
        this.showMainContent();
      });
    }
    
    // Profile tab click
    if(this.profileTab){
      this.profileTab.addEventListener('click', (e) => {
        e.preventDefault();
        if(this.userEmail){
          this.openProfile();
        } else {
          this.openAuth();
        }
      });
    }
    
    // Sign out
    if(this.signOutBtn){
      this.signOutBtn.addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        this.userEmail = '';
        this.closeProfile();
        this.openAuth();
        document.body.classList.add('locked');
      });
    }
    
    if(this.closeProfile){
      this.closeProfile.addEventListener('click', () => this.closeProfile());
    }
    
    // Initialize page state
    if(this.userEmail){
      console.log('User already logged in:', this.userEmail);
      document.body.classList.remove('locked');
      this.authView.classList.remove('open');
    } else {
      console.log('No user logged in, showing auth');
      document.body.classList.add('locked');
      this.authView.classList.add('open');
      if(this.email) this.email.focus();
    }
    
    // Initial validation
    validateLogin();
  }

  openAuth(){
    console.log('Opening auth overlay');
    this.authView.classList.add('open');
    document.body.classList.add('locked');
    if(this.email) this.email.focus();
  }
  
  closeAuth(){
    console.log('Closing auth overlay');
    this.authView.classList.remove('open');
    if(this.authErr) this.authErr.textContent = '';
  }
  
  showMainContent(){
    console.log('Showing main content');
    document.body.classList.remove('locked');
  }

  openProfile(){
    console.log('Opening profile');
    if(this.welcome){
      this.welcome.textContent = `Welcome${this.userEmail ? `, ${this.userEmail}` : ''}!`;
    }
    if(this.profileView){
      this.profileView.classList.add('open');
    }
  }
  
  closeProfile(){
    console.log('Closing profile');
    if(this.profileView){
      this.profileView.classList.remove('open');
    }
  }
}
