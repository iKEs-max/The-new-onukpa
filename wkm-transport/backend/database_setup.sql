-- ==========================================================
-- ONUKPA EXPRESS RIDE - MYSQL DATABASE SETUP SCRIPT
-- ==========================================================

CREATE DATABASE IF NOT EXISTS wkm_transport;
USE wkm_transport;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    available_seats INT NOT NULL DEFAULT 45,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_email VARCHAR(100),
    seat_number INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- 4. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    hubtel_transaction_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'hubtel',
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    hubtel_receipt_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- Insert Default Admin (Password: Admin@2024 )
-- Bcrypt hash generated for 'Admin@2024'
INSERT IGNORE INTO admins (username, email, password_hash) VALUES 
('admin', 'admin@onukpaexpress.com', '$2a$12$R9h/cIPz0gi.URNNX3cam2Os.O6vXyT8y4/S2p2nQ.l2a3A2uM2pC');

-- Insert Sample Routes
INSERT IGNORE INTO routes (origin, destination, departure_time, base_price, available_seats, status) VALUES 
('Accra (Nkrumah Circle)', 'Kumasi (Kejetia)', '2026-03-10 06:00:00', 80.00, 45, 'ACTIVE'),
('Kumasi (Kejetia)', 'Accra (Nkrumah Circle)', '2026-03-10 06:00:00', 80.00, 45, 'ACTIVE'),
('Legon (UG Main Gate)', 'KNUST (Ayigya)', '2026-03-10 07:00:00', 60.00, 30, 'ACTIVE'),
('KNUST (Ayigya)', 'Legon (UG Main Gate)', '2026-03-10 07:00:00', 60.00, 30, 'ACTIVE'),
('Accra (Circle)', 'Cape Coast (UCC)', '2026-03-10 06:30:00', 45.00, 40, 'ACTIVE'),
('Cape Coast (UCC)', 'Accra (Circle)', '2026-03-10 06:30:00', 45.00, 40, 'ACTIVE'),
('Accra', 'Takoradi', '2026-03-10 07:00:00', 70.00, 45, 'ACTIVE'),
('Kumasi', 'Tamale', '2026-03-10 05:00:00', 120.00, 45, 'ACTIVE');

SELECT '✅ Database wkm_transport created and seeded successfully!' AS 'Result';
