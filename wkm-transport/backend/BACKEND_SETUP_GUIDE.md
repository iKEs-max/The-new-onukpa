# Onukpa Express - Backend Setup Guide

Hello! To run the backend and the real database on your machine, you need to install **MySQL**. Follow these simple steps below.

## 1. Download & Install XAMPP
The easiest way to get MySQL running on Windows is by using XAMPP.

1. Go to: [Apache Friends XAMPP](https://www.apachefriends.org/index.html)
2. Click **XAMPP for Windows** to download it.
3. Install it (just keep clicking "Next").
4. Once installed, open the **XAMPP Control Panel**.
5. Next to **MySQL**, click the **Start** button. 
   *(It should turn green, meaning your database is now running!)*

## 2. Import the Database
Now we need to tell MySQL to create our tables (Admins, Routes, Bookings, Payments).

1. I have created a file for you called `database_setup.sql`. It is located right here in the backend folder:
   `c:\Users\Binak\OneDrive\Desktop\wkm-transport\backend\database_setup.sql`
2. Open the **XAMPP Control Panel** again.
3. Next to **MySQL**, click the **Admin** button. (This opens phpMyAdmin in your browser).
4. Click the **Import** tab at the top.
5. Click **Choose File** and select the `database_setup.sql` file mentioned above.
6. Scroll down and click **Import** (or **Go**). 
   *(You should see a green success message.)*

## 3. Hubtel Payment Integration
You asked me to leave spaces for Hubtel APIs. **Good news! I already found them built into the code.**

- **Payment Initiation:** Open `controllers/paymentController.js`. You will see it already sends a `POST` request to `https://payproxyapi.hubtel.com/items/initiate`.
- **Payment Webhook (Callback):** Open `controllers/webhookController.js`. You will see it already has the `/api/webhook/hubtel` endpoint waiting to receive Hubtel's confirmation.

All you need to do is put your real Hubtel API keys inside the `backend/config/hubtel.js` file when you get them!

## 4. Run the Backend
Once your MySQL is running in XAMPP and the database is imported, run your backend in the terminal:

```powershell
cd c:\Users\Binak\OneDrive\Desktop\wkm-transport\backend
npm start
```

Your API will be live at `http://localhost:5000`!
