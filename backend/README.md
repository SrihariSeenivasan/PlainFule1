# PlainFuel Backend API

Node.js + Express + PostgreSQL backend for PlainFuel e-commerce platform.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database
- Install PostgreSQL on your system
- Create a new database named `plainfuel`
- Update `.env` file with your database credentials

### 3. Environment Variables
Copy `.env.example` to `.env` and update with your values:
```bash
cp .env.example .env
```

### 4. Run the Server
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user profile (requires auth)

### User (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /orders` - Get all user orders
- `GET /orders/:id` - Get specific order

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /` - Get user orders
- `GET /:id` - Get order details
- `PUT /:orderId/payment` - Update payment status

### Admin (`/api/admin`)
- `GET /dashboard` - Get admin dashboard stats
- `GET /users` - Get all users
- `GET /orders` - Get all orders
- `PUT /orders/:id` - Update order status
- `GET /products` - Get all products
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Database Structure

### Users
- id, email, password, first_name, last_name, phone, role, address, city, state, zip, country

### Products
- id, name, description, price, image_url, category, stock

### Orders
- id, user_id, order_number, total_amount, status, shipping_address

### Order Items
- id, order_id, product_id, quantity, price

### Payments
- id, order_id, amount, payment_method, status, transaction_id

## JWT Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **user**: Standard user role for customers
- **admin**: Administrator role for managing orders, products, and users

Users are redirected to their respective dashboards based on their role after login.
