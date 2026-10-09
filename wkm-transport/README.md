# Onukpa Express Ride - Documentation

## 🚗 Project Overview
Onukpa Express Ride is a premium student-focused transportation booking platform in Ghana. It connects major universities with city centers through a safe, reliable, and convenient booking system.

## 🛠️ Tech Stack
- **Frontend**: Vanilla JS, HTML5, CSS3 (Modern Glassmorphism Design)
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Prisma ORM), Redis (Rate Limiting)
- **Payments**: Hubtel Unified Checkout (Mobile Money / Cards)

## 📍 Configuration
Contact details and API endpoints are parameterized in `landing-page/js/config.js`:
```javascript
const CONFIG = {
    contact: {
        phone: "0212345678",
        email: "info@onukpaexpress.com",
        location: "Accra, Ghana"
    },
    api: {
        baseUrl: "https://api.yourdomain.com/api/v1"
    }
};
```

## 🛰️ Key Features
1. **Real-time Booking**: Automated seat management and instant ticket generation.
2. **Secure Payments**: Integration with Ghana's leading payment gateways.
3. **Trip Tracking**: Public tracking interface for loved ones to monitor trip progress using ticket codes.
4. **Admin Dashboard**: Comprehensive management of routes, bookings, and financial analytics.

## 🚀 Setup Instructions
1. **Backend**:
   - `npm install` in `backend` directory.
   - Configure `.env` with `DATABASE_URL`, `JWT_SECRET`, etc.
   - `npx prisma migrate dev` to setup schema.
   - `npm run dev` to start server.
2. **Frontend**:
   - Serve the `landing-page` directory using a static web server.
   - Update `js/config.js` with your backend URL.

## 💰 Service Costs
- Detailed breakdown of hosting and development costs are provided in the `brain` folder:
  - `cost_estimate.md`: Operational costs in GHS.
  - `developer_service_cost.md`: Professional development fees in GHS.
