// --- APPLICATION STATE ---
let currentUser = JSON.parse(localStorage.getItem('apex_user')) || null;
let cart = JSON.parse(localStorage.getItem('apex_cart')) || [];

// Data Models
const servicePackages = [
    {
        id: 'pkg-1',
        name: 'Track Readiness Inspection',
        category: 'Maintenance',
        price: 249,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
        description: 'Comprehensive 50-point brake, suspension, fluid, and tire pressure evaluation tailored for high-speed track performance.'
    },
    {
        id: 'pkg-2',
        name: 'Ceramic Shield Detailing',
        category: 'Detailing',
        price: 799,
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80',
        description: 'Full exterior paint correction with 9H hydrophobic ceramic coating, interior leather deep cleaning, and glass treatment.'
    },
    {
        id: 'pkg-3',
        name: 'ECU Stage 1 Remap',
        category: 'Tuning',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
        description: 'Precision electronic control unit remapping offering up to +20% horsepower and enhanced throttle response.'
    }
];

const luxuryFleet = [
    {
        id: 'car-1',
        name: 'Porsche 911 GT3 RS',
        category: 'Rental',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
        description: 'Naturally aspirated 4.0L flat-6 engine producing 518 HP. Pure track perfection engineered for street performance.'
    },
    {
        id: 'car-2',
        name: 'Lamborghini Huracán Evo',
        category: 'Rental',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80',
        description: 'V10 power delivering 640 HP. Distinctive aggressive Italian design with state-of-the-art all-wheel drive.'
    },
    {
        id: 'car-3',
        name: 'Audi R8 V10 Performance',
        category: 'Rental',
        price: 950,
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80',
        description: 'Atmospheric V10 engine delivering unmatched everyday supercar driving comfort and raw sound.'
    }
];

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    renderPackages();
    renderFleet();
    updateCartUI();
    updateUserUI();
});

// --- NAVIGATION / TAB SWITCHING ---
function switchTab(tabId) {
    // Hide all views
    document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.remove('active');
    });

    // Deactivate nav links
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Activate corresponding nav item
    const activeNav = document.querySelector(`.nav-btn[href="#${tabId}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    if (tabId === 'cart') {
        renderCartItems();
    }
}

// --- RENDER FUNCTIONS ---
function renderPackages() {
    const container = document.getElementById('packages-container');
    container.innerHTML = servicePackages.map(pkg => `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${pkg.image}" alt="${pkg.name}">
                <span class="card-tag">${pkg.category}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${pkg.name}</h3>
                <p class="card-desc">${pkg.description}</p>
                <div class="card-footer">
                    <div class="card-price">$${pkg.price.toLocaleString()}</div>
                    <button class="btn btn-primary" onclick="addToCart('${pkg.id}', 'package')">
                        <i class="fa-solid fa-cart-plus"></i> Add Package
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFleet() {
    const container = document.getElementById('fleet-container');
    container.innerHTML = luxuryFleet.map(car => `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${car.image}" alt="${car.name}">
                <span class="card-tag">${car.category}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${car.name}</h3>
                <p class="card-desc">${car.description}</p>
                <div class="card-footer">
                    <div class="card-price">$${car.price.toLocaleString()} <span>/ day</span></div>
                    <button class="btn btn-primary" onclick="addToCart('${car.id}', 'fleet')">
                        <i class="fa-solid fa-key"></i> Reserve Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- CART LOGIC & AUTOMATIC REDIRECT ---
function addToCart(itemId, type) {
    const catalog = type === 'package' ? servicePackages : luxuryFleet;
    const item = catalog.find(i => i.id === itemId);

    if (!item) return;

    const existingIndex = cart.findIndex(c => c.id === itemId);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            type: type,
            qty: 1
        });
    }

    saveCart();
    showToast(`Added "${item.name}" to cart! Directing to Cart...`);
    
    // Redirect user to Cart view automatically
    setTimeout(() => {
        switchTab('cart');
    }, 800);
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(c => c.id !== itemId);
        }
        saveCart();
        renderCartItems();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCart();
    renderCartItems();
    showToast('Item removed from cart.');
}

function saveCart() {
    localStorage.setItem('apex_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countElement.textContent = totalQty;
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                <p>Your cart is empty.</p>
            </div>
        `;
        document.getElementById('summary-subtotal').textContent = '$0.00';
        document.getElementById('summary-tax').textContent = '$0.00';
        document.getElementById('summary-total').textContent = '$0.00';
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()} ${item.type === 'fleet' ? '/ day' : ''}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById('summary-subtotal').textContent = `$${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById('summary-tax').textContent = `$${tax.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById('summary-total').textContent = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

function checkoutProcess() {
    if (cart.length === 0) {
        showToast('Add items to your cart before checking out.');
        return;
    }

    if (!currentUser) {
        showToast('Please sign in to complete your checkout.');
        openAuthModal('login');
        return;
    }

    showToast('Processing payment...');
    setTimeout(() => {
        cart = [];
        saveCart();
        renderCartItems();
        showToast('Order confirmed! A confirmation email has been sent.');
    }, 1500);
}

// --- AUTHENTICATION MODAL LOGIC ---
function openAuthModal(mode = 'login') {
    document.getElementById('auth-modal').classList.add('active');
    switchAuthTab(mode);
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function switchAuthTab(mode) {
    document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    if (mode === 'login') {
        document.getElementById('tab-btn-login').classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else {
        document.getElementById('tab-btn-register').classList.add('active');
        document.getElementById('register-form').classList.add('active');
    }
}

function handleAuthSubmit(event, mode) {
    event.preventDefault();
    if (mode === 'login') {
        const email = document.getElementById('login-email').value;
        currentUser = { name: email.split('@')[0], email: email };
        showToast(`Welcome back, ${currentUser.name}!`);
    } else {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        currentUser = { name: name, email: email };
        showToast(`Account created successfully! Welcome, ${name}.`);
    }

    localStorage.setItem('apex_user', JSON.stringify(currentUser));
    updateUserUI();
    closeAuthModal();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('apex_user');
    updateUserUI();
    showToast('Logged out successfully.');
}

function updateUserUI() {
    const userSection = document.getElementById('user-profile-section');
    if (currentUser) {
        userSection.innerHTML = `
            <div class="user-chip">
                <i class="fa-solid fa-user-check"></i>
                <span>${currentUser.name}</span>
                <i class="fa-solid fa-right-from-bracket logout-icon" title="Sign Out" onclick="logout()"></i>
            </div>
        `;
    } else {
        userSection.innerHTML = `
            <button class="btn btn-outline" id="login-nav-btn" onclick="openAuthModal('login')">
                <i class="fa-solid fa-user"></i> Sign In
            </button>
        `;
    }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}