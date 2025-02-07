-- Ensure database exists
CREATE DATABASE IF NOT EXISTS fullstack1;
USE fullstack1;

-- ✅ Drop Tables in Reverse Order (if needed)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS sellers;
DROP TABLE IF EXISTS seller_applications;
DROP TABLE IF EXISTS delivery_address;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS userotps;

-- ✅ Create Tables in Correct Order
-- 1️⃣ Create Users Table (Dependency for delivery_address, carts, orders)
CREATE TABLE users (
    id CHAR(36) NOT NULL PRIMARY KEY, 
    fullname VARCHAR(255), 
    email VARCHAR(255) NOT NULL, 
    role VARCHAR(255) DEFAULT 'user', 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ Create Admins Table
CREATE TABLE admins (
    id CHAR(36) NOT NULL PRIMARY KEY, 
    fullname VARCHAR(255), 
    email VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    role VARCHAR(255) DEFAULT 'admin', 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ Create Seller Applications Table (✅ No Dependencies)
CREATE TABLE seller_applications (
    id CHAR(36) NOT NULL PRIMARY KEY, 
    full_name VARCHAR(255), 
    email VARCHAR(255) NOT NULL, 
    company_name VARCHAR(255), 
    company_address VARCHAR(255), 
    gstin CHAR(15) NOT NULL, 
    status VARCHAR(255) DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ Create Sellers Table (Depends on seller_applications)
CREATE TABLE sellers (
    id CHAR(36) NOT NULL PRIMARY KEY, 
    full_name VARCHAR(255), 
    email VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'seller',
    company_name VARCHAR(255), 
    company_address VARCHAR(255), 
    gstin CHAR(15) NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5️⃣ Create Delivery Address Table (Depends on users)
CREATE TABLE delivery_address (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    alternate_phone_number VARCHAR(15),
    pincode VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    landmark VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6️⃣ Create Products Table (Depends on sellers)
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,
    seller_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    mrp INT NOT NULL,
    stock INT DEFAULT 0 NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);

-- 7️⃣ Create Carts Table (Depends on users)
CREATE TABLE carts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8️⃣ Create Cart Items Table (Depends on carts & products)
CREATE TABLE cart_items (
    id CHAR(36) PRIMARY KEY,
    cart_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 9️⃣ Create Orders Table (Depends on users, delivery_address)
CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY NOT NULL,
    user_id CHAR(36) NOT NULL,
    delivery_address_id CHAR(36) NOT NULL,
    total INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_id VARCHAR(255),
    payment_status VARCHAR(50), 
    payment_method VARCHAR(50), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_address_id) REFERENCES delivery_address(id) ON DELETE CASCADE
);

-- 🔟 Create Order Items Table (Depends on orders, products, sellers)
CREATE TABLE order_items (
    id CHAR(36) PRIMARY KEY NOT NULL,
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    seller_id CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    mrp INT NOT NULL,
    product_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);

-- 1️⃣1️⃣ Create User OTPs Table (Independent)
CREATE TABLE userotps (
    id CHAR(36) NOT NULL PRIMARY KEY, 
    email VARCHAR(255), 
    otp INT NOT NULL
);

-- ✅ Verify Tables Exist
SHOW TABLES;

-- ✅ Query Data for Debugging
SELECT * FROM seller_applications;
SELECT * FROM sellers;
SELECT * FROM products;
SELECT * FROM carts;
SELECT * FROM cart_items;
SELECT * FROM users;
SELECT * FROM delivery_address;
SELECT * FROM admins;
SELECT * FROM userotps;
SELECT * FROM orders;
SELECT * FROM order_items;
