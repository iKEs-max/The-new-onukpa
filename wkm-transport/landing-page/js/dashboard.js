// js/dashboard.js - WKM Transport Admin Dashboard
const API = '/api';
let token = localStorage.getItem('wkm_admin_token');

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    if (token) { verifyAndLoad(); } else { showLogin(); }
    initNavigation();
    initLogin();
    initRouteModal();
    initPasswordForm();
    initFilters();
    initSidebar();
});

// ===== Auth =====
function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    loadDashboard();
}

async function verifyAndLoad() {
    try {
        const res = await apiFetch('/auth/verify');
        if (res.success) {
            document.getElementById('admin-name').textContent = res.admin.username;
            showDashboard();
        } else { showLogin(); }
    } catch { 
        if (token === 'demo-token-123') {
            document.getElementById('admin-name').textContent = 'Admin (Demo Mode)';
            showDashboard();
        } else {
            showLogin(); 
        }
    }
}

function initLogin() {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errEl = document.getElementById('login-error');
        errEl.style.display = 'none';
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('login-username').value,
                    password: document.getElementById('login-password').value
                })
            });
            const data = await res.json();
            if (data.success) {
                token = data.token;
                localStorage.setItem('wkm_admin_token', token);
                document.getElementById('admin-name').textContent = data.admin.username;
                showDashboard();
            } else {
                errEl.textContent = data.message || 'Login failed';
                errEl.style.display = 'block';
            }
        } catch {
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            if ((user === 'wkm' || user === 'admin') && pass) {
                token = 'demo-token-123';
                localStorage.setItem('wkm_admin_token', token);
                document.getElementById('admin-name').textContent = 'Admin (Demo Mode)';
                showDashboard();
            } else {
                errEl.textContent = 'Server offline. Use "wkm" and "admin123" for Demo Mode.';
                errEl.style.display = 'block';
            }
        }
    });

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        token = null;
        localStorage.removeItem('wkm_admin_token');
        showLogin();
    });
}

// ===== API Helper =====
async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        }
    });
    return res.json();
}

// ===== Navigation =====
function initNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${page}`).classList.add('active');
            document.getElementById('page-title').textContent = item.textContent.trim();
            // Load data for page
            if (page === 'overview') loadDashboard();
            else if (page === 'bookings') loadAllBookings();
            else if (page === 'routes') loadRoutes();
            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('active');
        });
    });
}

function initSidebar() {
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
}

// ===== Load Dashboard =====
async function loadDashboard() {
    try {
        const data = await apiFetch('/bookings/admin/stats');
        if (data.success) {
            const s = data.stats;
            document.getElementById('stat-total-bookings').textContent = s.totalBookings;
            document.getElementById('stat-today-bookings').textContent = s.todayBookings;
            document.getElementById('stat-total-revenue').textContent = `GHS ${parseFloat(s.totalRevenue).toFixed(2)}`;
            document.getElementById('stat-today-revenue').textContent = `GHS ${parseFloat(s.todayRevenue).toFixed(2)}`;

            // Recent bookings
            const tbody = document.getElementById('recent-bookings-body');
            if (s.recentBookings.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:#9CA3AF;">No bookings yet</td></tr>';
            } else {
                tbody.innerHTML = s.recentBookings.map(b => `
                    <tr>
                        <td><strong>${b.ticket_code || '-'}</strong></td>
                        <td>${b.passenger_name}</td>
                        <td>Accra → ${b.destination}</td>
                        <td>${new Date(b.travel_date).toLocaleDateString('en-GB')}</td>
                        <td>GHS ${parseFloat(b.total_amount).toFixed(2)}</td>
                        <td><span class="status-badge status-${b.payment_status}">${b.payment_status}</span></td>
                    </tr>
                `).join('');
            }

            // Popular routes
            const routesList = document.getElementById('popular-routes-list');
            if (s.popularRoutes.length === 0) {
                routesList.innerHTML = '<p style="padding:1rem;color:#9CA3AF;">No data yet</p>';
            } else {
                routesList.innerHTML = s.popularRoutes.map(r => `
                    <div class="route-stat">
                        <span class="route-stat-name">Accra → ${r.destination}</span>
                        <span class="route-stat-count">${r.booking_count} bookings</span>
                        <span class="route-stat-revenue">GHS ${parseFloat(r.revenue).toFixed(2)}</span>
                    </div>
                `).join('');
            }
        }
    } catch (err) {
        if (token === 'demo-token-123') {
            document.getElementById('stat-total-bookings').textContent = '142';
            document.getElementById('stat-today-bookings').textContent = '8';
            document.getElementById('stat-total-revenue').textContent = 'GHS 12450.00';
            document.getElementById('stat-today-revenue').textContent = 'GHS 850.00';

            document.getElementById('recent-bookings-body').innerHTML = `
                <tr>
                    <td><strong>WKM-DEMO1</strong></td>
                    <td>Kwame Osei</td>
                    <td>Accra → Kumasi</td>
                    <td>${new Date().toLocaleDateString('en-GB')}</td>
                    <td>GHS 120.00</td>
                    <td><span class="status-badge status-paid">paid</span></td>
                </tr>
                <tr>
                    <td><strong>WKM-DEMO2</strong></td>
                    <td>Ama Mensah</td>
                    <td>Accra → Takoradi</td>
                    <td>${new Date().toLocaleDateString('en-GB')}</td>
                    <td>GHS 100.00</td>
                    <td><span class="status-badge status-pending">pending</span></td>
                </tr>
            `;
            
            document.getElementById('popular-routes-list').innerHTML = `
                <div class="route-stat">
                    <span class="route-stat-name">Accra → Kumasi</span>
                    <span class="route-stat-count">85 bookings</span>
                    <span class="route-stat-revenue">GHS 10200.00</span>
                </div>
                <div class="route-stat">
                    <span class="route-stat-name">Accra → Takoradi</span>
                    <span class="route-stat-count">57 bookings</span>
                    <span class="route-stat-revenue">GHS 5700.00</span>
                </div>
            `;
        } else {
            console.error('Dashboard load error:', err);
        }
    }
}

// ===== Bookings =====
async function loadAllBookings(filters = {}) {
    try {
        let query = '';
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.date) params.append('date', filters.date);
        if (params.toString()) query = '?' + params.toString();

        const data = await apiFetch(`/bookings/admin/all${query}`);
        const tbody = document.getElementById('all-bookings-body');
        if (data.success && data.bookings.length > 0) {
            tbody.innerHTML = data.bookings.map(b => `
                <tr>
                    <td><strong>${b.ticket_code || '-'}</strong></td>
                    <td>${b.passenger_name}</td>
                    <td>${b.passenger_phone}</td>
                    <td>Accra → ${b.destination}</td>
                    <td>${new Date(b.travel_date).toLocaleDateString('en-GB')}</td>
                    <td>${b.departure_time}</td>
                    <td>${b.passengers}</td>
                    <td>GHS ${parseFloat(b.total_amount).toFixed(2)}</td>
                    <td><span class="status-badge status-${b.payment_status}">${b.payment_status}</span></td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:2rem;color:#9CA3AF;">No bookings found</td></tr>';
        }
    } catch (err) {
        if (token === 'demo-token-123') {
            document.getElementById('all-bookings-body').innerHTML = `
                <tr>
                    <td><strong>WKM-DEMO1</strong></td>
                    <td>Kwame Osei</td>
                    <td>0541234567</td>
                    <td>Accra → Kumasi</td>
                    <td>${new Date().toLocaleDateString('en-GB')}</td>
                    <td>10:00 AM</td>
                    <td>1</td>
                    <td>GHS 120.00</td>
                    <td><span class="status-badge status-paid">paid</span></td>
                </tr>
                <tr>
                    <td><strong>WKM-DEMO2</strong></td>
                    <td>Ama Mensah</td>
                    <td>0209876543</td>
                    <td>Accra → Takoradi</td>
                    <td>${new Date().toLocaleDateString('en-GB')}</td>
                    <td>12:00 PM</td>
                    <td>1</td>
                    <td>GHS 100.00</td>
                    <td><span class="status-badge status-pending">pending</span></td>
                </tr>
            `;
        } else {
            console.error('Bookings load error:', err);
        }
    }
}

function initFilters() {
    document.getElementById('filter-btn').addEventListener('click', () => {
        loadAllBookings({
            status: document.getElementById('filter-status').value,
            date: document.getElementById('filter-date').value
        });
    });
}

// ===== Routes Management =====
async function loadRoutes() {
    try {
        const data = await apiFetch('/routes');
        const tbody = document.getElementById('routes-body');
        if (data.success && data.routes.length > 0) {
            tbody.innerHTML = data.routes.map(r => {
                const times = Array.isArray(r.departure_times) ? r.departure_times : JSON.parse(r.departure_times || '[]');
                return `
                <tr>
                    <td>${r.id}</td>
                    <td><strong>${r.destination}</strong></td>
                    <td>GHS ${parseFloat(r.price).toFixed(2)}</td>
                    <td>${times.join(', ')}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-edit" onclick="editRoute(${r.id},'${r.destination}',${r.price},'${times.join(', ')}')">Edit</button>
                            <button class="btn-delete" onclick="deleteRoute(${r.id})">Delete</button>
                        </div>
                    </td>
                </tr>`;
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;">No routes</td></tr>';
        }
    } catch (err) { 
        if (token === 'demo-token-123') {
            const routes = [
                { id: 1, destination: 'Kumasi', price: 120, departure_times: ['6:00 AM', '10:00 AM'] },
                { id: 2, destination: 'Takoradi', price: 100, departure_times: ['7:00 AM', '12:00 PM'] }
            ];
            document.getElementById('routes-body').innerHTML = routes.map(r => `
                <tr>
                    <td>${r.id}</td>
                    <td><strong>${r.destination}</strong></td>
                    <td>GHS ${parseFloat(r.price).toFixed(2)}</td>
                    <td>${r.departure_times.join(', ')}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-edit" onclick="editRoute(${r.id},'${r.destination}',${r.price},'${r.departure_times.join(', ')}')">Edit</button>
                            <button class="btn-delete" onclick="deleteRoute(${r.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            console.error('Routes error:', err); 
        }
    }
}

function initRouteModal() {
    document.getElementById('add-route-btn').addEventListener('click', () => {
        document.getElementById('route-modal-title').textContent = 'Add Route';
        document.getElementById('route-edit-id').value = '';
        document.getElementById('route-form').reset();
        document.getElementById('route-modal').style.display = 'flex';
    });

    document.getElementById('close-route-modal').addEventListener('click', () => {
        document.getElementById('route-modal').style.display = 'none';
    });

    document.getElementById('route-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('route-edit-id').value;
        const routeData = {
            destination: document.getElementById('route-destination').value,
            price: parseFloat(document.getElementById('route-price').value),
            departure_times: document.getElementById('route-times').value.split(',').map(t => t.trim())
        };

        try {
            let res;
            if (editId) {
                res = await apiFetch(`/routes/${editId}`, { method: 'PUT', body: JSON.stringify(routeData) });
            } else {
                res = await apiFetch('/routes', { method: 'POST', body: JSON.stringify(routeData) });
            }
            if (res.success) {
                document.getElementById('route-modal').style.display = 'none';
                loadRoutes();
            } else {
                alert(res.message || 'Failed to save route');
            }
        } catch { alert('Server error'); }
    });
}

window.editRoute = function(id, destination, price, times) {
    document.getElementById('route-modal-title').textContent = 'Edit Route';
    document.getElementById('route-edit-id').value = id;
    document.getElementById('route-destination').value = destination;
    document.getElementById('route-price').value = price;
    document.getElementById('route-times').value = times;
    document.getElementById('route-modal').style.display = 'flex';
};

window.deleteRoute = async function(id) {
    if (!confirm('Delete this route?')) return;
    try {
        const res = await apiFetch(`/routes/${id}`, { method: 'DELETE' });
        if (res.success) loadRoutes();
        else alert(res.message || 'Delete failed');
    } catch { alert('Server error'); }
};

// ===== Password =====
function initPasswordForm() {
    document.getElementById('password-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPw = document.getElementById('new-password').value;
        const confirmPw = document.getElementById('confirm-password').value;
        if (newPw !== confirmPw) { alert('Passwords do not match'); return; }
        try {
            const res = await apiFetch('/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify({
                    currentPassword: document.getElementById('current-password').value,
                    newPassword: newPw
                })
            });
            if (res.success) {
                alert('Password updated successfully');
                document.getElementById('password-form').reset();
            } else { alert(res.message || 'Update failed'); }
        } catch { alert('Server error'); }
    });
}
