class SignupPage {
  constructor() {
    this.form = document.getElementById('signupForm');
    this.fullName = document.getElementById('fullName');
    this.email = document.getElementById('email');
    this.password = document.getElementById('password');
    this.confirmPassword = document.getElementById('confirmPassword');
    this.terms = document.getElementById('terms');
    this.togglePw = document.getElementById('togglePw');
    this.createBtn = document.getElementById('createAccountBtn');
    this.errorDiv = document.getElementById('signupErr');
    
    this.init();
  }

  init() {
    // Validation function
    const validate = () => {
      const nameOk = this.fullName.value.trim().length >= 2;
      const emailOk = this.email.value.trim().includes('@');
      const passOk = this.password.value.trim().length >= 6;
      const confirmOk = this.confirmPassword.value.trim() === this.password.value.trim();
      const termsOk = this.terms.checked;
      
      const allValid = nameOk && emailOk && passOk && confirmOk && termsOk;
      this.createBtn.disabled = !allValid;
      
      return allValid;
    };

    // Add event listeners for validation
    this.fullName.addEventListener('input', validate);
    this.email.addEventListener('input', validate);
    this.password.addEventListener('input', validate);
    this.confirmPassword.addEventListener('input', validate);
    this.terms.addEventListener('change', validate);

    // Password toggle
    this.togglePw.addEventListener('click', () => {
      const showing = this.password.type === 'text';
      this.password.type = showing ? 'password' : 'text';
      this.togglePw.setAttribute('aria-pressed', String(!showing));
      this.togglePw.textContent = showing ? 'Show' : 'Hide';
      this.password.focus();
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validate()) {
        this.errorDiv.textContent = 'Please fill all fields correctly and accept the terms.';
        return;
      }

      // Simulate account creation
      const userData = {
        fullName: this.fullName.value.trim(),
        email: this.email.value.trim(),
        password: this.password.value.trim()
      };

      // Store user data (in real app, this would be sent to server)
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userFullName', userData.fullName);

      // Show success message
      this.errorDiv.style.color = 'green';
      this.errorDiv.textContent = 'Account created successfully! Redirecting...';
      
      // Redirect to main page after 2 seconds
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    });

    // Initial validation
    validate();
  }
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new SignupPage();
});