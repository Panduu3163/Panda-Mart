// Products state
let products = [];

// Cart state
let cart = [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cart-total-price');
const cartSubtotal = document.getElementById('cart-subtotal-price');
const deliveryFeeEl = document.getElementById('delivery-fee');
const discountAmountEl = document.getElementById('discount-amount');

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        products = data.products;
        displayProducts();
        updateCart(); // ensure cart updates after products loaded
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = `
            <div class="error">
                <p>Error loading products. Please check if products.json is in the correct location.</p>
                <p>Try opening the page using a local server instead of direct file access.</p>
            </div>
        `;
    }
}

// Hero slider logic
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000);
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Display products on page
function displayProducts() {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-unit">${product.unit}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
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

// 🛒 Update Cart with dynamic delivery fee and discount
function updateCart() {
    cartItems.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart-message">Your cart is empty.</div>`;
    } else {
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
            `;
            cartItems.appendChild(cartItemDiv);
        });
    }

    const deliveryFee = totalItems > 0 ? 5 + Math.floor(totalItems / 3) * 2 : 0;
    const discount = subtotal * 0.10;
    const total = subtotal + deliveryFee - discount;

    cartCount.textContent = totalItems;
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    deliveryFeeEl.textContent = `$${deliveryFee.toFixed(2)}`;
    discountAmountEl.textContent = `- $${discount.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}


// Cart toggle
cartIcon.addEventListener('click', () => {
    cartContainer.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartContainer.classList.remove('active');
});

// Initialize
loadProducts();

// Handle Checkout Button Click
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert('✅ Your order has been placed! Thank you for shopping with us!');
        cart = []; // Clear cart
        updateCart();
        cartContainer.classList.remove('active');
    }
});

