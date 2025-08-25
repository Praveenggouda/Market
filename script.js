// DOM Elements
    const loginBtn = document.getElementById('login-btn');
    const cartBtn = document.getElementById('cart-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeLogin = document.getElementById('close-login');
    const closeRegister = document.getElementById('close-register');
    const closeCart = document.getElementById('close-cart');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Cart Data
    let cart = [];

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Load cart from localStorage if available
        const savedCart = localStorage.getItem('blinkitCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }

        // Modal Events
        loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
        cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
        
        closeLogin.addEventListener('click', () => loginModal.style.display = 'none');
        closeRegister.addEventListener('click', () => registerModal.style.display = 'none');
        closeCart.addEventListener('click', () => cartSidebar.classList.remove('active'));
        
        showRegister.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
        
        showLogin.addEventListener('click', () => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });

        // Form Submissions
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        checkoutBtn.addEventListener('click', handleCheckout);

        // Add to Cart Buttons
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const product = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    price: parseFloat(e.target.dataset.price),
                    img: e.target.dataset.img,
                    quantity: 1
                };
                addToCart(product);
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.style.display = 'none';
            if (e.target === registerModal) registerModal.style.display = 'none';
        });
    });

    // Cart Functions
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('blinkitCart', JSON.stringify(cart));
        
        updateCartUI();
        
        // Show cart sidebar when adding an item
        cartSidebar.classList.add('active');
        
        // Show confirmation (optional)
        showToast(`${product.name} added to cart!`);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('blinkitCart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                localStorage.setItem('blinkitCart', JSON.stringify(cart));
                updateCartUI();
            }
        }
    }

    function updateCartUI() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px;"></i>
                    <p>Your cart is empty</p>
                    <p>Start adding items to see them here</p>
                </div>
            `;
            cartTotal.textContent = '₹0';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">₹${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        cartTotal.textContent = `₹${total}`;
    }

    // Form Handlers
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            showToast('Please fill in all fields');
            return;
        }
        
        // In a real app, you would make an API call here
        showToast('Login successful!');
        loginModal.style.display = 'none';
        
        // Clear form
        loginForm.reset();
    }

    function handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match');
            return;
        }
        
        // In a real app, you would make an API call here
        showToast('Registration successful!');
        registerModal.style.display = 'none';
        
        // Clear form
        registerForm.reset();
    }

    function handleCheckout() {
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        
        // In a real app, you would proceed to payment
        showToast('Proceeding to checkout...');
        
        // Clear cart after checkout
        cart = [];
        localStorage.removeItem('blinkitCart');
        updateCartUI();
        cartSidebar.classList.remove('active');
    }

    // Utility Functions
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('blinkit-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'blinkit-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #333;
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(toast);
        }
        
        // Set message and show
        toast.textContent = message;
        toast.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }

    // Make functions available globally for onclick attributes
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;