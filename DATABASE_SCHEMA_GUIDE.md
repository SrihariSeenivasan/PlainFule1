# Database Schema & Connection Guide

## 📍 Where is the Schema?

The database schema is **NOT** a separate SQL file. Instead, it's **automatically created** when the backend server starts.

### Schema Location:
**File:** `backend/src/config/init.ts`

This file contains the `initializeDatabase()` function that runs on server startup and creates all tables automatically.

---

## 📊 Database Tables

### 1. **users**
```sql
id (PRIMARY KEY)
email (UNIQUE)
password (hashed)
first_name
last_name
phone
role (user | admin)
address
city
state
zip
country
created_at
updated_at
```

### 2. **products**
```sql
id (PRIMARY KEY)
name
description
price
image_url
category
stock
created_at
updated_at
```

### 3. **orders**
```sql
id (PRIMARY KEY)
user_id (FOREIGN KEY → users)
order_number (UNIQUE)
total_amount
status (pending | processing | shipped | delivered | cancelled)
shipping_address
created_at
updated_at
```

### 4. **order_items**
```sql
id (PRIMARY KEY)
order_id (FOREIGN KEY → orders)
product_id (FOREIGN KEY → products)
quantity
price
created_at
```

### 5. **payments**
```sql
id (PRIMARY KEY)
order_id (FOREIGN KEY → orders)
amount
payment_method
status (pending | completed | failed)
transaction_id
created_at
updated_at
```

---

## 🔧 How to Initialize the Database

### Step 1: Start PostgreSQL
Make sure PostgreSQL is running on your system.

### Step 2: Create the Database
```sql
CREATE DATABASE plainfuel;
```

Or use this command:
```bash
psql -U postgres -c "CREATE DATABASE plainfuel;"
```

### Step 3: Update `.env` with DB Credentials
Backend `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=plainfuel
```

### Step 4: Start Backend Server
```bash
cd backend
npm run dev
```

✅ The schema will be created automatically on first run!

---

## 🎯 Frontend-Backend Connection Setup

### Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### How to Use in Components:

#### 1. **With useAuth Hook**
```tsx
'use client';
import { useAuth } from '@/lib/auth-context';

export default function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Hello, {user?.first_name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

#### 2. **Using API Functions Directly**
```tsx
import { userAPI, orderAPI, adminAPI } from '@/lib/api';

// Get user profile
const profile = await userAPI.getProfile();

// Get user orders
const orders = await userAPI.getOrders();

// Create order
const newOrder = await orderAPI.createOrder({
  items: [{ product_id: 1, quantity: 2, price: 49.99 }],
  shipping_address: "123 Main St"
});

// Admin: Get dashboard
const dashboard = await adminAPI.getDashboard();
```

---

## 🚀 Startup Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `plainfuel` created
- [ ] Backend `.env` file configured
- [ ] Frontend `.env.local` file created
- [ ] Backend running: `npm run dev` (from backend folder)
- [ ] Frontend running: `npm run dev` (from frontend folder)

Once both are running:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 🔐 Authentication Flow

1. **User registers** → Password hashed with bcrypt → JWT token created
2. **User logs in** → Credentials verified → JWT token returned
3. **Token stored** → localStorage on browser
4. **Token sent** → Authorization header on all API requests
5. **User role checked** → Routes to AdminPanel or UserPanel

All API calls automatically include the JWT token from localStorage!

---

## 📝 Important Notes

- Schema is **automatically created** - No manual SQL needed!
- All passwords are **hashed** with bcrypt (not stored as plaintext)
- JWT tokens expire in **7 days** (configurable)
- Frontend & Backend must be running to test auth
- Always use `NEXT_PUBLIC_` prefix for frontend env vars to expose them to browser
