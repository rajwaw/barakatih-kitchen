document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formContents = document.querySelectorAll('.form-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            formContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and its target content
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-user-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember').checked;
            
            // In a real application, you would send this data to a server
            // For demo purposes, we'll just store it in localStorage
            if (email && password) {
                // Check if user exists (simplified demo)
                const users = JSON.parse(localStorage.getItem('barakatihUsers')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Store logged in state
                    localStorage.setItem('barakatihLoggedIn', 'true');
                    localStorage.setItem('barakatihCurrentUser', JSON.stringify({
                        name: user.name,
                        email: user.email,
                        remember: remember
                    }));
                    
                    // Show success message
                    alert('Login successful! Welcome back, ' + user.name);
                    
                    // Redirect to homepage
                    window.location.href = 'index.html';
                } else {
                    alert('Invalid email or password. Please try again.');
                }
            }
        });
    }
    
    // Registration form submission
    const registerForm = document.getElementById('register-user-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Validate form
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (!terms) {
                alert('You must agree to the Terms & Conditions');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For demo purposes, we'll just store it in localStorage
            if (name && email && password) {
                // Get existing users or create new array
                const users = JSON.parse(localStorage.getItem('barakatihUsers')) || [];
                
                // Check if user already exists
                if (users.some(user => user.email === email)) {
                    alert('Email already registered! Please login instead.');
                    
                    // Switch to login tab
                    tabBtns[0].click();
                    document.getElementById('login-email').value = email;
                    return;
                }
                
                // Add new user
                users.push({
                    name,
                    email,
                    password
                });
                
                // Save to localStorage
                localStorage.setItem('barakatihUsers', JSON.stringify(users));
                
                // Show success message
                alert('Registration successful! Please login with your new account.');
                
                // Switch to login tab
                tabBtns[0].click();
                document.getElementById('login-email').value = email;
            }
        });
    }
    
    // Menu toggle (for mobile)
    let menu = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    menu.onclick = () => {
        menu.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    }
    
    window.onscroll = () => {
        menu.classList.remove('bx-x');
        navbar.classList.remove('active');
    }

    // Update cart count
    updateCartCount();
});

// Function to update cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('barakatihCart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
}