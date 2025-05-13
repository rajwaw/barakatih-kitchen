// Navigation Menu Toggle
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

// Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    // Check if the element is in view
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Apply animation to elements when they come into view
    function checkVisibility() {
        document.querySelectorAll('.animate__animated').forEach(function(element) {
            if (isInViewport(element) && !element.classList.contains('animate__animated--triggered')) {
                // Extract the animation class
                const animationClass = Array.from(element.classList).find(cls => cls.startsWith('animate__') && cls !== 'animate__animated');
                if (animationClass) {
                    element.classList.add(animationClass);
                    element.classList.add('animate__animated--triggered');
                }
            }
        });
    }

    // Initial check and add event listener
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
});

// Shopping Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.querySelector('.close-cart');
    const clearCartBtn = document.getElementById('clear-cart');
    const cartDOM = document.querySelector('.cart-sidebar');
    const cartItemsDOM = document.querySelector('.cart-items');
    const cartTotalDOM = document.getElementById('cart-total-amount');
    const cartCountDOM = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeCheckoutBtn = document.querySelector('.close-checkout');
    const checkoutModal = document.querySelector('.checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsDOM = document.querySelector('.checkout-items');
    const checkoutSubtotalDOM = document.getElementById('checkout-subtotal');
    const checkoutTotalDOM = document.getElementById('checkout-total');
    const confirmationModal = document.querySelector('.confirmation-modal');
    const closeConfirmationBtn = document.querySelector('.close-confirmation');
    const orderIdDOM = document.getElementById('order-id');
    const overlay = document.querySelector('.overlay');
    const toast = document.querySelector('.toast');
    const closeToast = document.querySelector('.toast .close');
    const progress = document.querySelector('.toast .progress');

    // Cart array
    let cart = [];

    // Get products from localStorage
    function getCart() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update cart UI
    function updateCartUI() {
        // Clear cart items in DOM
        cartItemsDOM.innerHTML = '';

        // Show cart items in DOM
        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">Rp ${formatPrice(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class='bx bx-trash'></i>
                </button>
            `;
            cartItemsDOM.appendChild(cartItemEl);
        });

        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountDOM.textContent = totalItems;

        // Update cart total
        const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        cartTotalDOM.textContent = `Rp ${formatPrice(cartTotal)}`;

        // Add event listeners for quantity buttons and remove buttons
        addQuantityBtnListeners();
        addRemoveItemListeners();
    }

    // Add to cart functionality
    function addToCart() {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const name = this.dataset.name;
                const price = parseInt(this.dataset.price);
                const image = this.dataset.img;

                // Check if item is already in cart
                const existingItem = cart.find(item => item.id === id);

                if (existingItem) {
                    // If item exists, increase quantity
                    existingItem.quantity++;
                } else {
                    // If item doesn't exist, add it to cart
                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }

                // Save cart to localStorage
                saveCart();

                // Update cart UI
                updateCartUI();

                // Show toast notification
                showToast();
            });
        });
    }

    // Toast notification
    function showToast() {
        toast.classList.add('active');
        progress.classList.add('active');

        // Auto hide toast after 5s
        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);

        // Reset progress animation when toast is closed
        setTimeout(() => {
            progress.classList.remove('active');
        }, 5300);
    }

    // Close toast
    if (closeToast) {
        closeToast.addEventListener('click', () => {
            toast.classList.remove('active');
            
            setTimeout(() => {
                progress.classList.remove('active');
            }, 300);
        });
    }

    // Event listeners for quantity buttons
    function addQuantityBtnListeners() {
        const decreaseBtns = document.querySelectorAll('.decrease');
        const increaseBtns = document.querySelectorAll('.increase');

        decreaseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const itemIndex = cart.findIndex(item => item.id === id);

                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1);
                }

                saveCart();
                updateCartUI();
            });
        });

        increaseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const itemIndex = cart.findIndex(item => item.id === id);

                cart[itemIndex].quantity++;
                saveCart();
                updateCartUI();
            });
        });
    }

    // Event listeners for remove buttons
    function addRemoveItemListeners() {
        const removeBtns = document.querySelectorAll('.remove-item');

        removeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const itemIndex = cart.findIndex(item => item.id === id);

                cart.splice(itemIndex, 1);
                saveCart();
                updateCartUI();
            });
        });
    }

    // Clear cart
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        saveCart();
        updateCartUI();
    });

    // Open cart sidebar
    cartBtn.addEventListener('click', function() {
        cartDOM.classList.add('active');
        overlay.style.display = 'block';
    });

    // Close cart sidebar
    closeCartBtn.addEventListener('click', function() {
        cartDOM.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Show checkout modal
        checkoutModal.classList.add('active');
        overlay.style.display = 'block';
        cartDOM.classList.remove('active');

        // Update checkout items
        updateCheckoutItems();
    });

    // Close checkout modal
    closeCheckoutBtn.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Update checkout items
    function updateCheckoutItems() {
        checkoutItemsDOM.innerHTML = '';

        cart.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.classList.add('checkout-item');
            checkoutItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="checkout-item-info">
                    <h4 class="checkout-item-name">${item.name}</h4>
                    <p class="checkout-item-price">Rp ${formatPrice(item.price)}</p>
                    <p class="checkout-item-quantity">Quantity: ${item.quantity}</p>
                </div>
            `;
            checkoutItemsDOM.appendChild(checkoutItem);
        });

        // Update subtotal and total
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const deliveryFee = 15000; // Fixed delivery fee
        const total = subtotal + deliveryFee;

        checkoutSubtotalDOM.textContent = `Rp ${formatPrice(subtotal)}`;
        checkoutTotalDOM.textContent = `Rp ${formatPrice(total)}`;
    }

    // Submit checkout form
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Generate random order ID
        const orderId = 'BK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        orderIdDOM.textContent = orderId;

        // Show confirmation modal
        checkoutModal.classList.remove('active');
        confirmationModal.classList.add('active');

        // Clear cart after successful order
        cart = [];
        saveCart();
        updateCartUI();
    });

    // Close confirmation modal
    closeConfirmationBtn.addEventListener('click', function() {
        confirmationModal.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Close modals when clicking on overlay
    overlay.addEventListener('click', function() {
        cartDOM.classList.remove('active');
        checkoutModal.classList.remove('active');
        confirmationModal.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Format price with commas
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Initialize the cart
    function init() {
        getCart();
        updateCartUI();
        addToCart();
    }

    init();
});
