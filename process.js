// ========== GLOBAL VARIABLES ==========
const CART_KEY = 'morning_delight_cart';
const ORDERS_KEY = 'morning_delight_orders';
const CURRENT_ORDER_KEY = 'morning_delight_current_order';

// ========== UTILITY FUNCTIONS ==========
function generateOrderId() {
    return `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', ' at');
}

function updateCartBubble() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const bubble = document.getElementById('cart-bubble');
    if (bubble) {
        bubble.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        bubble.style.display = cart.length ? 'flex' : 'none';
    }
}

// ========== MENU PAGE FUNCTIONALITY ==========
function setupMenuPage() {
    const addToCartButtons = document.querySelectorAll('.orderss');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const foodItem = e.target.closest('.gridfoods');
            const itemName = foodItem.querySelector('.cont p').textContent;
            const itemPrice = parseFloat(foodItem.querySelector('.cont h5').textContent.replace('$', ''));
            const itemImage = foodItem.querySelector('.gridsimage img').src;
            
            let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            const existingItem = cart.find(item => item.name === itemName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: itemName,
                    price: itemPrice,
                    image: itemImage,
                    quantity: 1
                });
            }
            
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            updateCartBubble();
            
            // Visual feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        });
    });
    
    updateCartBubble();
}

// ========== CART PAGE FUNCTIONALITY ==========
function renderCartItems() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;
    
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty-view">
                <div class="icon"><i class="fas fa-shopping-cart"></i></div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items yet</p>
                <a href="menu/menu.html" class="button">Browse Menu</a>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="cart-items-box">
            <div class="cart-box-title">
                <span>Your Items</span>
                <button class="remove-all-btn" id="clearCart">Remove All</button>
            </div>
    `;
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="price">$${item.price.toFixed(2)} each</span>
                    <div class="quantity-control">
                        <button class="quantity-btn minus">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item-link">Remove</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    const deliveryFee = 5.00; // Example delivery fee
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + deliveryFee + tax;
    
    html += `
        </div>
        <div class="order-summary-box">
            <div class="cart-box-title">Order Summary</div>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Fee</span>
                <span>$${deliveryFee.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <button class="button button-checkout" id="checkoutBtn">Proceed to Checkout</button>
                <a href="menu.html" class="button button-continue">Continue Shopping</a>
            </div>
        </div>
    `;
    
    cartContent.innerHTML = html;
    
    // Add event listeners
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('.cart-item').dataset.index;
            updateCartItemQuantity(index, -1);
        });
    });
    
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('.cart-item').dataset.index;
            updateCartItemQuantity(index, 1);
        });
    });
    
    document.querySelectorAll('.remove-item-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('.cart-item').dataset.index;
            removeCartItem(index);
        });
    });
    
    document.getElementById('clearCart')?.addEventListener('click', clearCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', proceedToCheckout);
}

function updateCartItemQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartItems();
    updateCartBubble();
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartItems();
    updateCartBubble();
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    renderCartItems();
    updateCartBubble();
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'order1.html';
}

// ========== ORDER PAGE FUNCTIONALITY ==========
function setupOrderPage() {
    // Pre-fill cart items in the order form
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const menuContainer = document.getElementById('menu');
    
    if (menuContainer && cart.length > 0) {
        menuContainer.innerHTML = cart.map(item => `
            <div class="item">
                <label class="itemlabel">
                    <div class="itemgroup">
                        <input type="checkbox" class="checkbox" checked disabled>
                        <span class="itemname">${item.name}</span>
                    </div>
                    <span class="itemprice">$${item.price.toFixed(2)} × ${item.quantity}</span>
                </label>
            </div>
        `).join('');
    }
    
    // Handle form submission
    const orderForm = document.getElementById('form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById('fullname').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                time: document.getElementById('time').value,
                items: JSON.parse(localStorage.getItem(CART_KEY)) || [],
                date: new Date().toISOString(),
                status: 'confirmed',
                orderId: generateOrderId()
            };
            
            // Save order to history
            let orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
            orders.push(formData);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            
            // Save as current order for tracking
            localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(formData));
            
            // Clear cart
            localStorage.removeItem(CART_KEY);
            updateCartBubble();
            
            // Show success modal
            document.getElementById('modal').style.display = 'flex';
            
            // Close modal and redirect
            document.getElementById('close').addEventListener('click', () => {
                window.location.href = 'track.html';
            });
        });
    }
    
    // Location button functionality
    document.getElementById('getLocationBtn')?.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                document.getElementById('address').value = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
                window.open(`https://www.google.com/maps?q=${latitude},${longitude}`);
            }, error => {
                console.error('Error getting location:', error);
                alert('Could not get your location. Please enter manually.');
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });
}

// ========== TRACK PAGE FUNCTIONALITY ==========
function setupTrackPage() {
    const trackForm = document.getElementById('trackForm');
    if (trackForm) {
        trackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const trackingId = document.getElementById('trackingId').value.trim();
            trackOrder(trackingId);
        });
    }
    
    // Check if coming from order page
    const currentOrder = JSON.parse(localStorage.getItem(CURRENT_ORDER_KEY));
    if (currentOrder) {
        document.getElementById('trackingId').value = currentOrder.orderId;
        trackOrder(currentOrder.orderId);
        localStorage.removeItem(CURRENT_ORDER_KEY);
    }
}

function trackOrder(trackingId) {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const order = orders.find(o => o.orderId === trackingId || o.phone === trackingId);
    const errorElement = document.getElementById('track-error');
    const resultContainer = document.getElementById('trackingResultContainer');
    
    if (!order) {
        errorElement.textContent = 'Order not found. Please check your order ID or phone number.';
        resultContainer.style.display = 'none';
        return;
    }
    
    errorElement.textContent = '';
    resultContainer.style.display = 'block';
    
    // Update order info
    document.getElementById('final-status').textContent = 'Order Confirmed';
    document.getElementById('final-message').textContent = `Order #${order.orderId} placed on ${formatDate(order.date)}`;
    
    // Simulate order progress
    const statusStages = ['confirmed', 'preparing', 'delivery', 'delivered'];
    const currentStageIndex = statusStages.indexOf(order.status);
    const progressPercent = (currentStageIndex / (statusStages.length - 1)) * 100;
    
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
    
    // Update status indicators
    statusStages.forEach((stage, index) => {
        const element = document.getElementById(`status-${stage}`);
        if (!element) return;
        
        element.className = 'status-item';
        if (index < currentStageIndex) element.classList.add('completed');
        if (index === currentStageIndex) element.classList.add('active');
    });
    
    // Simulate progress if not delivered
    if (order.status !== 'delivered') {
        simulateDeliveryProgress(order);
    } else {
        document.getElementById('final-icon').innerHTML = '<i class="fas fa-check-circle"></i>';
        document.getElementById('final-status').textContent = 'Delivered';
    }
}

function simulateDeliveryProgress(order) {
    const statusStages = ['confirmed', 'preparing', 'delivery', 'delivered'];
    let currentStageIndex = statusStages.indexOf(order.status);
    
    const progressInterval = setInterval(() => {
        currentStageIndex++;
        if (currentStageIndex >= statusStages.length) {
            clearInterval(progressInterval);
            return;
        }
        
        order.status = statusStages[currentStageIndex];
        const progressPercent = (currentStageIndex / (statusStages.length - 1)) * 100;
        
        document.getElementById('progressBar').style.width = `${progressPercent}%`;
        document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
        
        // Update status element
        const prevElement = document.getElementById(`status-${statusStages[currentStageIndex - 1]}`);
        const currentElement = document.getElementById(`status-${statusStages[currentStageIndex]}`);
        
        if (prevElement) prevElement.classList.replace('active', 'completed');
        if (currentElement) currentElement.classList.add('active');
        
        // Update final status when delivered
        if (statusStages[currentStageIndex] === 'delivered') {
            document.getElementById('final-icon').innerHTML = '<i class="fas fa-check-circle"></i>';
            document.getElementById('final-status').textContent = 'Delivered';
            
            // Update in storage
            const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
            const orderIndex = orders.findIndex(o => o.orderId === order.orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'delivered';
                localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            }
        }
    }, 5000); // Update every 5 seconds for demo
}

// ========== HISTORY PAGE FUNCTIONALITY ==========
function renderOrderHistory() {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const historyContainer = document.querySelector('.order');
    
    if (!historyContainer) return;
    
    if (orders.length === 0) {
        historyContainer.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <i class="fas fa-history" style="font-size: 3rem; color: #EA580B; margin-bottom: 20px;"></i>
                <h3>No order history yet</h3>
                <p>Your completed orders will appear here</p>
                <a href="menu.html" style="display: inline-block; margin-top: 20px; 
                   padding: 10px 20px; background: #EA580B; color: white; border-radius: 5px;">
                   Browse Menu
                </a>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render orders
    historyContainer.innerHTML = orders.map(order => {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 5.00;
        const tax = total * 0.1;
        const grandTotal = total + deliveryFee + tax;
        
        return `
            <div class="order-box">
                <div class="block">
                    <div class="address">
                        <div class="dinner">
                            <div class="round"><i class="fa-solid fa-utensils"></i></div>
                            <h3>${order.orderId}<br><span>${formatDate(order.date)}</span></h3>
                        </div>
                        <div class="dollar">
                            <h1>$${grandTotal.toFixed(2)}<br><p>total</p></h1>
                            <div class="deliver">
                                <i class="fa-solid fa-${order.status === 'delivered' ? 'check' : 'truck'}"></i>
                                ${order.status === 'delivered' ? 'Delivered' : 'In Progress'}
                            </div>
                        </div>
                    </div>
                    <div class="details">
                        <h3>Items Ordered</h3>
                        <ul>
                            ${order.items.slice(0, 3).map(item => `
                                <li>${item.name}${item.quantity > 1 ? ` (×${item.quantity})` : ''}</li>
                            `).join('')}
                            ${order.items.length > 3 ? '<li>+ more</li>' : ''}
                        </ul>
                    </div>
                    <div class="view">
                        <div class="view1">
                            <button class="view-details" data-orderid="${order.orderId}">
                                <a>View Details</a>
                            </button>
                        </div>
                        <div class="view2">
                            <button class="reorder-btn" data-orderid="${order.orderId}">
                                <a>Reorder</a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.target.closest('button').dataset.orderid;
            viewOrderDetails(orderId);
        });
    });
    
    document.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.target.closest('button').dataset.orderid;
            reorderItems(orderId);
        });
    });
}

function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (order) {
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 5.00;
        const tax = total * 0.1;
        const grandTotal = total + deliveryFee + tax;
        
        const detailsHtml = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="font-family: 'Pacifico', cursive; text-align: center; margin-bottom: 20px;">
                    Order #${order.orderId}
                </h2>
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <h3 style="margin-bottom: 5px;">Customer Info</h3>
                            <p>${order.fullName}</p>
                            <p>${order.phone}</p>
                            <p>${order.address}</p>
                        </div>
                        <div style="text-align: right;">
                            <h3 style="margin-bottom: 5px;">Order Info</h3>
                            <p>${formatDate(order.date)}</p>
                            <p>${order.time}</p>
                            <p style="color: ${order.status === 'delivered' ? 'green' : 'orange'}; font-weight: bold;">
                                ${order.status === 'delivered' ? 'Delivered' : 'In Progress'}
                            </p>
                        </div>
                    </div>
                    
                    <h3 style="margin-bottom: 10px;">Items Ordered</h3>
                    <div style="margin-bottom: 20px;">
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                                <div>
                                    ${item.name} × ${item.quantity}
                                </div>
                                <div>
                                    $${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="border-top: 2px solid #eee; padding-top: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Subtotal:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Delivery Fee:</span>
                            <span>$${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Tax (10%):</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px;">
                            <span>Total:</span>
                            <span>$${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // You could use a modal here, but for simplicity we'll just show an alert
        alert(`Order Details for #${order.orderId}\n\nItems: ${order.items.map(i => `${i.name} (×${i.quantity})`).join(', ')}\n\nTotal: $${grandTotal.toFixed(2)}`);
    }
}

function reorderItems(orderId) {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (order) {
        localStorage.setItem(CART_KEY, JSON.stringify(order.items));
        updateCartBubble();
        window.location.href = 'cart.html';
    }
}

// ========== NAVIGATION TOGGLE ==========
function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

// ========== INITIALIZE BASED ON CURRENT PAGE ==========
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    updateCartBubble();
    
    if (document.querySelector('.gridfoods')) setupMenuPage();
    if (document.getElementById('cart-content')) renderCartItems();
    if (document.getElementById('form')) setupOrderPage();
    if (document.getElementById('trackForm')) setupTrackPage();
    if (document.querySelector('.order')) renderOrderHistory();
});