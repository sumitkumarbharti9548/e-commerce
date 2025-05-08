// Product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        category: "electronics",
        image: "Screenshot 2025-05-08 000757.png"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "Screenshot 2025-05-08 001339.png"
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 24.99,
        category: "clothing",
        image: "Screenshot 2025-05-08 001619.png"
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 79.99,
        category: "clothing",
        image: "Screenshot 2025-05-08 002016.png"
    },
    {
        id: 5,
        name: "Coffee Mug",
        price: 12.99,
        category: "home",
        image: "Screenshot 2025-05-08 002235.png"
    },
    {
        id: 6,
        name: "Desk Lamp",
        price: 34.99,
        category: "home",
        image: "Screenshot 2025-05-08 002504.png"
    }
];

// Cart functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        renderCartItems();
    }
}

function updateCartCount() {
    const countElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    countElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Rendering functions
function renderProducts(productsToRender) {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product';
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productsContainer.appendChild(productEl);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.querySelector('#subtotal').textContent = '0.00';
        document.querySelector('#tax').textContent = '0.00';
        document.querySelector('#total').textContent = '0.00';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease">-</button>
                <input type="number" value="${item.quantity}" min="1">
                <button class="increase">+</button>
            </div>
            <p class="item-total">$${itemTotal.toFixed(2)}</p>
            <span class="remove-item">&times;</span>
        `;
        cartContainer.appendChild(cartItemEl);
        
        // Add event listeners
        const decreaseBtn = cartItemEl.querySelector('.decrease');
        const increaseBtn = cartItemEl.querySelector('.increase');
        const quantityInput = cartItemEl.querySelector('input');
        const removeBtn = cartItemEl.querySelector('.remove-item');
        
        decreaseBtn.addEventListener('click', () => {
            const newQuantity = Math.max(1, item.quantity - 1);
            quantityInput.value = newQuantity;
            updateQuantity(item.id, newQuantity);
        });
        
        increaseBtn.addEventListener('click', () => {
            const newQuantity = item.quantity + 1;
            quantityInput.value = newQuantity;
            updateQuantity(item.id, newQuantity);
        });
        
        quantityInput.addEventListener('change', () => {
            const newQuantity = parseInt(quantityInput.value) || 1;
            updateQuantity(item.id, newQuantity);
        });
        
        removeBtn.addEventListener('click', () => {
            removeFromCart(item.id);
        });
    });
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    document.querySelector('#subtotal').textContent = subtotal.toFixed(2);
    document.querySelector('#tax').textContent = tax.toFixed(2);
    document.querySelector('#total').textContent = total.toFixed(2);
}

// Filter and search functionality
function filterProducts() {
    const searchInput = document.querySelector('#search');
    const categoryFilter = document.querySelector('#category-filter');
    
    if (!searchInput || !categoryFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filteredProducts);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Render products on homepage (only 4 featured)
    if (document.querySelector('.featured .products')) {
        renderProducts(products.slice(0, 4));
    }
    
    // Render all products on products page
    if (document.location.pathname.includes('products.html')) {
        renderProducts(products);
        
        // Set up filter event listeners
        document.querySelector('#search').addEventListener('input', filterProducts);
        document.querySelector('#category-filter').addEventListener('change', filterProducts);
    }
    
    // Render cart items on cart page
    if (document.location.pathname.includes('cart.html')) {
        renderCartItems();
        
        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', () => {
            alert('Checkout functionality would go here in a real application!');
        });
    }
    
    // Update cart count on all pages
    updateCartCount();
});

// chat bot
  