// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        image: "🎧",
        category: "audio"
    },
    {
        id: 2,
        name: "Smartphone X",
        price: 699.99,
        image: "📱",
        category: "mobile"
    },
    {
        id: 3,
        name: "Laptop Pro",
        price: 1299.99,
        image: "💻",
        category: "computers"
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 199.99,
        image: "⌚",
        category: "wearables"
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 79.99,
        image: "🔊",
        category: "audio"
    },
    {
        id: 6,
        name: "Gaming Mouse",
        price: 49.99,
        image: "🖱️",
        category: "accessories"
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.querySelector('.cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the store
function initStore() {
    displayProducts();
    updateCart();
    setupEventListeners();
}

// Display Products
function displayProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
            </div>
            <h3>${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showCartNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image}
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = total.toFixed(2);

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show empty cart message
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    }
}

function showCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = 'Item added to cart!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Event Listeners
function setupEventListeners() {
    // Cart toggle
    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        cartOverlay.classList.add('active');
    });

    // Close cart
    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartOverlay.contains(e.target) && !cartToggle.contains(e.target)) {
            cartOverlay.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA button
    document.querySelector('.cta-button').addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your purchase! This is a demo store.');
        cart = [];
        updateCart();
        cartOverlay.classList.remove('active');
    });
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', initStore);

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);