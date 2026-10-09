-- Create database
CREATE DATABASE wkm_transport;
USE wkm_transport;

-- Admins table
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (change password later)
INSERT INTO admins (username, password_hash, email) 
VALUES ('wkm', '$2y$10$YourHashedPasswordHere', 'wkm@email.com');

-- Routes table
CREATE TABLE routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    destination VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    departure_times TEXT, -- Store as JSON or comma separated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample routes
INSERT INTO routes (destination, price, departure_times) VALUES
('Kumasi', 120.00, '["6:00 AM", "10:00 AM", "2:00 PM"]'),
('Takoradi', 100.00, '["7:00 AM", "12:00 PM", "4:00 PM"]'),
('Cape Coast', 80.00, '["8:00 AM", "1:00 PM", "5:00 PM"]'),
('Tema', 50.00, '["6:30 AM", "9:30 AM", "3:30 PM"]');

-- Bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100),
    passenger_phone VARCHAR(20) NOT NULL,
    travel_date DATE NOT NULL,
    departure_time VARCHAR(20) NOT NULL,
    passengers INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    hubtel_transaction_id VARCHAR(100),
    ticket_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    hubtel_transaction_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);