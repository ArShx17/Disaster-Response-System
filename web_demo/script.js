// Initialize localStorage arrays if they don't exist
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('emergencies')) {
  localStorage.setItem('emergencies', JSON.stringify([]));
}
if (!localStorage.getItem('incidents')) {
  localStorage.setItem('incidents', JSON.stringify([]));
}

// Current logged in user (simulation)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Utility: Show Toast Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Global Auth Check
function requireAuth() {
  if (!currentUser) {
      window.location.href = 'login.html';
  }
}

// Auth: Login
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      showToast('Login successful!');
      setTimeout(() => {
          window.location.href = 'index.html';
      }, 1000);
  } else {
      showToast('Invalid email or password', 'danger');
  }
}

// Auth: Register setup
let generatedOTP = null;

function sendOTP() {
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  
  if (!phone && !email) {
      showToast('Please enter a phone number or email first', 'danger');
      return;
  }
  
  // Simulate OTP generation (4-digit code)
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  
  // In a real app, this would use Twilio or SendGrid. We'll just alert it for the demo.
  alert(`Simulation: Your OTP code is ${generatedOTP}`);
  showToast('OTP sent securely via simulation.');
}

function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const emContact = document.getElementById('emergency-contact').value;
  const password = document.getElementById('password').value;
  const otp = document.getElementById('otp').value;
  
  if (otp !== generatedOTP) {
      showToast('Invalid OTP. Please verify again.', 'danger');
      return;
  }
  
  const users = JSON.parse(localStorage.getItem('users'));
  
  // Check if email already registered
  if (users.find(u => u.email === email)) {
      showToast('Email is already registered.', 'danger');
      return;
  }
  
  const newUser = {
      id: Date.now(),
      name, email, phone, address, 
      emergencyContact: emContact, 
      password,
      credits: 100 // Starting credits
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  showToast('Registration successful! Redirecting to login...');
  setTimeout(() => {
      window.location.href = 'login.html';
  }, 1500);
}

// Helper to update current user credit visually and in DB
function updateUserCreditsUI() {
  if (!currentUser) return;
  const creditBadge = document.getElementById('credit-badge');
  if (creditBadge) {
      creditBadge.innerHTML = `🛡️ Credits: ${currentUser.credits}`;
      if (currentUser.credits <= 20) {
          creditBadge.className = 'credits-badge low';
      } else {
          creditBadge.className = 'credits-badge';
      }
  }
  
  const sosBtn = document.getElementById('sos-btn');
  if (sosBtn) {
      if (currentUser.credits <= 0) {
          sosBtn.disabled = true;
          sosBtn.innerText = 'DISABLED';
          document.getElementById('sos-warning').innerText = 'SOS functionality disabled due to zero credits.';
      } else {
          sosBtn.disabled = false;
          sosBtn.innerText = 'SOS';
          document.getElementById('sos-warning').innerText = 'Press only in case of extreme emergency.';
      }
  }
  // save to DB
  updateUserInDB(currentUser);
}

function updateUserInDB(updatedUser) {
  localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // update session
  const users = JSON.parse(localStorage.getItem('users'));
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
  }
}

// SOS Logic
function triggerSOS() {
  if (!currentUser) return;
  
  if (currentUser.credits <= 0) {
      showToast('SOS feature disabled: 0 Credits remaining.', 'danger');
      return;
  }
  
  const confirmSOS = confirm("WARNING: Are you sure this is a real emergency? False reports will deduct 20 credits and may result in legal action.");
  
  if (!confirmSOS) {
      // Considered misuse / cancel but let's only deduct on confirm for the sake of the demo, 
      // or we can simulate it randomly. Let's say if they confirm, it goes through. 
      return;
  }
  
  // Deduct credits for "Misuse" simulation just to show the feature requirement
  // Let's ask via prompt if it's a test to simulate misuse
  const isMisuse = confirm("DEMO PROMPT: Is this a fake/test request? (Click 'OK' for Yes/Misuse, 'Cancel' for Real Emergency)");
  
  if (isMisuse) {
      currentUser.credits = Math.max(0, currentUser.credits - 20);
      updateUserCreditsUI();
      showToast('🚨 MISUSE DETECTED: 20 Credits deducted. Authority notified.', 'danger');
      if (currentUser.credits === 0) return; // Block from sending further if 0 now
  }
  
  showToast('Locating...', 'success');
  
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          sendEmergencyRequest(position.coords.latitude, position.coords.longitude);
      }, (error) => {
          console.warn("Geolocation denied/failed. Sending without exact coordinates.");
          sendEmergencyRequest('Unknown', 'Unknown');
      });
  } else {
      sendEmergencyRequest('Not Supported', 'Not Supported');
  }
}

function sendEmergencyRequest(lat, lng) {
  const emergencies = JSON.parse(localStorage.getItem('emergencies'));
  
  const request = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      location: lat === 'Unknown' ? 'Location tracking failed' : `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      time: new Date().toLocaleString(),
      status: 'Emergency', // Pending responder assignment
      address: currentUser.address,
      contact: currentUser.phone
  };
  
  emergencies.unshift(request); // Add to top
  localStorage.setItem('emergencies', JSON.stringify(emergencies));
  
  showToast('⚠️ Emergency alert sent to authorities immediately.', 'success');
}

// Dashboard UI Navigation
function switchSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  // Deactivate all links
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  
  // Show target
  document.getElementById(sectionId).classList.add('active');
  const activeLink = document.querySelector(`[onclick="switchSection('${sectionId}')"]`);
  if (activeLink) activeLink.classList.add('active');
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Incident Report System
function handleIncidentReport(event) {
  event.preventDefault();
  
  const type = document.getElementById('incident-type').value;
  const location = document.getElementById('incident-location').value;
  const desc = document.getElementById('incident-desc').value;
  
  const incidents = JSON.parse(localStorage.getItem('incidents'));
  
  incidents.unshift({
      id: Date.now(),
      type,
      location,
      description: desc,
      reportedBy: currentUser.name,
      time: new Date().toLocaleString(),
      status: 'reported'
  });
  
  localStorage.setItem('incidents', JSON.stringify(incidents));
  
  showToast('Incident reported successfully. Authorities notified.');
  document.getElementById('incident-form').reset();
  
  // Switch back to dashboard
  switchSection('home-section');
}

// Disaster Prediction Logic (Demo Simulation)
function simulateDisasterWarning() {
  const types = ['Earthquake', 'Tsunami', 'Flash Flood'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  // Create an alert banner dynamically
  const layout = document.querySelector('.main-content');
  const alertDiv = document.createElement('div');
  alertDiv.className = 'glass-panel alert-banner danger';
  alertDiv.innerHTML = `
      <div>
          <h3 style="margin-bottom:5px; color:#fca5a5;">🚨 EARLY WARNING SYSTEM</h3>
          <p style="color:white; margin:0;">${randomType} predicted in your area soon. Seek safe shelter immediately!</p>
      </div>
      <button class="btn btn-outline" onclick="this.parentElement.remove()" style="color:white; border-color:white;">Dismiss</button>
  `;
  
  layout.insertBefore(alertDiv, layout.firstChild);
  
  // Play sound optional (skipped audio file for pure code demo but logic here)
  // new Audio('alarm.mp3').play();
  
  showToast('CRITICAL: Disaster Prediction Triggered', 'danger');
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  // Setup forms
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  
  const registerForm = document.getElementById('register-form');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
  
  const incidentForm = document.getElementById('incident-form');
  if (incidentForm) incidentForm.addEventListener('submit', handleIncidentReport);
  
  // Dashboard Init
  if (document.getElementById('home-section')) {
      requireAuth();
      document.getElementById('user-greeting').innerText = `Welcome, ${currentUser.name}`;
      document.getElementById('profile-name').innerText = currentUser.name;
      document.getElementById('profile-email').innerText = currentUser.email;
      document.getElementById('profile-phone').innerText = currentUser.phone;
      document.getElementById('profile-address').innerText = currentUser.address;
      updateUserCreditsUI();
  }
});

// Premium Theme Toggle System
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Update button icon if exists across DOM
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerText = currentTheme === 'light' ? '🌙' : '☀️';
    });
}
