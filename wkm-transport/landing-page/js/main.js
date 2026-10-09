const API = CONFIG.api.baseUrl;
let routes = [];
let selectedRoute = null;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initContactInfo();
    initHeader();
    initThemeToggle();
    initScrollReveal();
    loadRoutes();
    initBookingForm();
    initModal();
    initTicketCheck();
    initTripTracking();
    setMinDate();
});

// ===== Contact Info =====
function initContactInfo() {
    document.getElementById('contact-phone').textContent = CONFIG.contact.phone || '0212345678';
    document.getElementById('contact-email').textContent = CONFIG.contact.email || 'info@onukpaexpress.com';
    document.getElementById('contact-location').textContent = CONFIG.contact.location || 'Accra, Ghana';
}

// ===== Trip Tracking =====
function initTripTracking() {
    const btn = document.getElementById('track-btn');
    const input = document.getElementById('track-ticket-input');
    if (btn) btn.addEventListener('click', trackTrip);
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') trackTrip(); });
}

async function trackTrip() {
    const code = document.getElementById('track-ticket-input').value.trim().toUpperCase();
    const resultDiv = document.getElementById('track-result');
    if (!code) { showToast('Please enter a ticket number', 'warning'); return; }

    try {
        const res = await fetch(`${API}/bookings/track/${code}`);
        const data = await res.json();
        
        if (data.success) {
            resultDiv.hidden = false;
            document.getElementById('track-status-text').textContent = data.status;
            document.getElementById('track-dest').textContent = data.booking.destination;
            document.getElementById('track-eta').textContent = data.eta || '30-45 mins';
            
            // Adjust progress bar based on status
            const bar = document.getElementById('track-progress');
            const marker = document.querySelector('.bus-marker');
            let progress = "10%";
            if (data.status === 'In Transit') progress = "55%";
            if (data.status === 'Arriving') progress = "85%";
            if (data.status === 'Arrived') progress = "100%";
            
            bar.style.width = progress;
            marker.style.left = progress;
            
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        } else {
            showToast(data.message || 'Trip not found', 'error');
        }
    } catch (err) {
        // demo fallback if backend not running
        showToast('System simulated: Showing demo tracking for ' + code, 'info');
        resultDiv.hidden = false;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Header =====
function initHeader() {
    const header = document.getElementById('header');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== Theme Toggle =====
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('wkm-theme');

    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            toggle.textContent = '🌙';
            localStorage.setItem('wkm-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggle.textContent = '☀️';
            localStorage.setItem('wkm-theme', 'dark');
        }
        // Animate the toggle button
        toggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => { toggle.style.transform = ''; }, 400);
    });
}

// ===== Scroll Reveal Animations =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });
}

// Re-observe new elements (for dynamically loaded route cards)
function observeNewElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.route-card.reveal-scale:not(.visible)').forEach(el => {
        observer.observe(el);
    });
}

// ===== Load Routes from API =====
async function loadRoutes() {
    try {
        const res = await fetch(`${API}/routes`);
        const data = await res.json();
        if (data.success && data.routes && data.routes.length > 0) {
            routes = data.routes;
            renderRouteCards();
            populateRouteSelect();
        } else {
            throw new Error('API returned no routes or success=false');
        }
    } catch (err) {
        // Fallback routes if API unavailable or DB not configured
        routes = [
            { id: 1, destination: 'Kumasi', price: 120, departure_times: ['6:00 AM', '10:00 AM', '2:00 PM'] },
            { id: 2, destination: 'Takoradi', price: 100, departure_times: ['7:00 AM', '12:00 PM', '4:00 PM'] },
            { id: 3, destination: 'Cape Coast', price: 80, departure_times: ['8:00 AM', '1:00 PM', '5:00 PM'] },
            { id: 4, destination: 'Tema', price: 50, departure_times: ['6:30 AM', '9:30 AM', '3:30 PM'] }
        ];
        renderRouteCards();
        populateRouteSelect();
    }
}

function renderRouteCards() {
    const grid = document.getElementById('route-grid');
    grid.innerHTML = routes.map((route, i) => {
        const times = Array.isArray(route.departure_times) ? route.departure_times : JSON.parse(route.departure_times || '[]');
        return `
        <div class="route-card reveal-scale" style="transition-delay: ${i * 0.1}s">
            <div class="route-card-header">
                <div class="route-destination">
                    <div class="route-icon">🚌</div>
                    <div>
                        <h4>Accra → ${route.destination}</h4>
                        <small>Daily departures</small>
                    </div>
                </div>
                <div class="route-price">GHS ${parseFloat(route.price).toFixed(0)}</div>
            </div>
            <div class="route-times">
                ${times.map(t => `<span class="time-badge" onclick="selectTime('${route.id}', '${t}', event)">${t}</span>`).join('')}
            </div>
            <button class="btn-primary" onclick="quickBook('${route.id}')">Book Now →</button>
        </div>`;
    }).join('');

    // Observe new cards for scroll animation
    setTimeout(observeNewElements, 100);
}

function populateRouteSelect() {
    const select = document.getElementById('route-select');
    select.innerHTML = '<option value="">Select destination...</option>' +
        routes.map(r => `<option value="${r.id}">Accra → ${r.destination} (GHS ${parseFloat(r.price).toFixed(0)})</option>`).join('');
}

// ===== Booking Form =====
function initBookingForm() {
    const routeSelect = document.getElementById('route-select');
    const timeSelect = document.getElementById('departure-time');
    const passengersSelect = document.getElementById('passengers');
    const continueBtn = document.getElementById('continue-booking-btn');

    routeSelect.addEventListener('change', () => {
        const route = routes.find(r => r.id == routeSelect.value);
        selectedRoute = route;
        if (route) {
            const times = Array.isArray(route.departure_times) ? route.departure_times : JSON.parse(route.departure_times || '[]');
            timeSelect.innerHTML = '<option value="">Select time...</option>' +
                times.map(t => `<option value="${t}">${t}</option>`).join('');
            updatePrice();
        } else {
            timeSelect.innerHTML = '<option value="">Select time...</option>';
            document.getElementById('price-display').hidden = true;
        }
    });

    passengersSelect.addEventListener('change', updatePrice);

    continueBtn.addEventListener('click', () => {
        if (!validateBookingForm()) return;
        showPassengerModal();
    });
}

function updatePrice() {
    const priceDisplay = document.getElementById('price-display');
    if (!selectedRoute) { priceDisplay.hidden = true; return; }
    const passengers = parseInt(document.getElementById('passengers').value);
    const unitPrice = parseFloat(selectedRoute.price);
    document.getElementById('unit-price').textContent = `GHS ${unitPrice.toFixed(2)}`;
    document.getElementById('total-price').textContent = `GHS ${(unitPrice * passengers).toFixed(2)}`;
    priceDisplay.hidden = false;
}

function validateBookingForm() {
    const route = document.getElementById('route-select').value;
    const date = document.getElementById('travel-date').value;
    const time = document.getElementById('departure-time').value;
    if (!route) { showToast('Please select a destination', 'error'); return false; }
    if (!date) { showToast('Please select a travel date', 'error'); return false; }
    if (!time) { showToast('Please select a departure time', 'error'); return false; }
    return true;
}

function setMinDate() {
    const dateInput = document.getElementById('travel-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

window.selectedTimes = {};
window.selectTime = function(routeId, time, event) {
    const card = event.target.closest('.route-card');
    card.querySelectorAll('.time-badge').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
    window.selectedTimes[routeId] = time;
}

window.quickBook = function(routeId) {
    document.getElementById('route-select').value = routeId;
    document.getElementById('route-select').dispatchEvent(new Event('change'));
    
    if (window.selectedTimes[routeId]) {
        setTimeout(() => {
            document.getElementById('departure-time').value = window.selectedTimes[routeId];
            document.getElementById('departure-time').dispatchEvent(new Event('change'));
        }, 100);
    }
    
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
    
    const formCard = document.querySelector('.booking-card');
    formCard.style.transition = 'box-shadow 0.3s ease';
    formCard.style.boxShadow = '0 0 0 4px var(--accent)';
    setTimeout(() => { formCard.style.boxShadow = ''; }, 1500);
}

// ===== Passenger Modal =====
function initModal() {
    const modal = document.getElementById('passenger-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('passenger-form');

    closeBtn.addEventListener('click', () => modal.hidden = true);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleBooking();
    });
}

function showPassengerModal() {
    const modal = document.getElementById('passenger-modal');
    const summary = document.getElementById('modal-summary');
    const passengers = document.getElementById('passengers').value;
    const date = document.getElementById('travel-date').value;
    const time = document.getElementById('departure-time').value;
    const total = parseFloat(selectedRoute.price) * parseInt(passengers);

    summary.innerHTML = `
        <p><strong>Route:</strong> Accra → ${selectedRoute.destination}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Passengers:</strong> ${passengers}</p>
        <p><strong>Total:</strong> GHS ${total.toFixed(2)}</p>
    `;
    modal.hidden = false;
}

// ===== Handle Booking & Payment =====
async function handleBooking() {
    const btn = document.getElementById('pay-now-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    btn.disabled = true;
    btnText.hidden = true;
    btnLoader.hidden = false;

    try {
        const bookingData = {
            route_id: parseInt(document.getElementById('route-select').value),
            passenger_name: document.getElementById('passenger-name').value,
            passenger_phone: document.getElementById('passenger-phone').value,
            passenger_email: document.getElementById('passenger-email').value || null,
            travel_date: document.getElementById('travel-date').value,
            departure_time: document.getElementById('departure-time').value,
            passengers: parseInt(document.getElementById('passengers').value)
        };

        // Create booking
        const bookRes = await fetch(`${API}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        const bookData = await bookRes.json();

        if (!bookData.success) {
            showToast(bookData.message || 'Booking failed', 'error');
            return;
        }

        // Initiate payment
        const payRes = await fetch(`${API}/payments/initiate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookingId: bookData.booking.id,
                amount: bookData.booking.total_amount,
                passengerName: bookingData.passenger_name,
                passengerPhone: bookingData.passenger_phone,
                destination: selectedRoute.destination
            })
        });
        const payData = await payRes.json();

        if (payData.success && payData.checkoutUrl) {
            if (typeof HubtelCheckoutSdk !== 'undefined') {
                const checkout = new HubtelCheckoutSdk();
                checkout.openModal({
                    checkoutUrl: payData.checkoutUrl,
                    callBacks: {
                        onPaymentSuccess: () => {
                            window.location.href = `/booking-success.html?ticket=${bookData.booking.ticket_code}&ref=${payData.clientReference}`;
                        },
                        onPaymentFailure: () => {
                            showToast('Payment failed. Please try again.', 'error');
                        },
                        onClose: () => { }
                    }
                });
            } else {
                window.location.href = payData.checkoutUrl;
            }
        } else {
            showToast(`Booking created! Ticket: ${bookData.booking.ticket_code}`, 'success');
            document.getElementById('passenger-modal').hidden = true;
            setTimeout(() => {
                window.location.href = `/booking-success.html?ticket=${bookData.booking.ticket_code}`;
            }, 1500);
        }
    } catch (err) {
        console.error('Booking error:', err);
        showToast('Something went wrong. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btnText.hidden = false;
        btnLoader.hidden = true;
    }
}

// ===== Ticket Check =====
function initTicketCheck() {
    const btn = document.getElementById('check-ticket-btn');
    const input = document.getElementById('ticket-code-input');
    btn.addEventListener('click', () => checkTicket());
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkTicket(); });
}

async function checkTicket() {
    const code = document.getElementById('ticket-code-input').value.trim().toUpperCase();
    const result = document.getElementById('ticket-result');
    if (!code) { showToast('Please enter a ticket code', 'error'); return; }

    try {
        const res = await fetch(`${API}/bookings/ticket/${code}`);
        const data = await res.json();
        if (data.success) {
            const b = data.booking;
            const statusClass = b.payment_status === 'paid' ? 'paid' : b.payment_status === 'pending' ? 'pending' : 'failed';
            result.hidden = false;
            result.innerHTML = `
                <div class="ticket-info">
                    <p><strong>Ticket:</strong> ${b.ticket_code}</p>
                    <p><strong>Passenger:</strong> ${b.passenger_name}</p>
                    <p><strong>Route:</strong> Accra → ${b.destination}</p>
                    <p><strong>Date:</strong> ${new Date(b.travel_date).toLocaleDateString('en-GB')}</p>
                    <p><strong>Time:</strong> ${b.departure_time}</p>
                    <p><strong>Amount:</strong> GHS ${parseFloat(b.total_amount).toFixed(2)}</p>
                    <p><strong>Status:</strong> <span class="ticket-badge ${statusClass}">${b.payment_status.toUpperCase()}</span></p>
                </div>`;
        } else {
            result.hidden = false;
            result.innerHTML = '<p style="color:#EF4444;text-align:center;padding:1rem;">❌ Ticket not found. Please check the code and try again.</p>';
        }
    } catch (err) {
        result.hidden = false;
        result.innerHTML = '<p style="color:#EF4444;text-align:center;padding:1rem;">Unable to check ticket. Server may be offline.</p>';
    }
}

// ===== Toast Notification =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.className = `toast ${type}`;
    toast.querySelector('.toast-icon').textContent = icons[type] || '';
    toast.querySelector('.toast-message').textContent = message;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 4000);
}
