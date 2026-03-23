# PlainFuel Backend - API Documentation

## Authentication Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "role": "user" // optional, defaults to "user"
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "role": "user",
    ...
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  ...
}
```

---

## User Endpoints

### Get User Profile
```
GET /api/user/profile
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  ...
}
```

### Update User Profile
```
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+9876543210",
  "address": "456 Oak Ave",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA"
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Get User Orders
```
GET /api/user/orders
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "order_number": "ORD-1234567890-ABC123",
    "total_amount": 99.99,
    "status": "delivered",
    "shipping_address": "123 Main St",
    "items": [
      {
        "id": 1,
        "product_id": 5,
        "quantity": 2,
        "price": 49.99,
        "name": "Product Name",
        "image_url": "..."
      }
    ],
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Get Specific Order
```
GET /api/user/orders/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "order_number": "ORD-1234567890-ABC123",
  "total_amount": 99.99,
  "status": "delivered",
  "items": [ ... ],
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Order Endpoints

### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "items": [
    {
      "product_id": 5,
      "quantity": 2,
      "price": 49.99
    },
    {
      "product_id": 8,
      "quantity": 1,
      "price": 29.99
    }
  ],
  "shipping_address": "123 Main St, New York, NY 10001, USA"
}

Response (201):
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "order_number": "ORD-1234567890-ABC123",
    "total_amount": 129.97,
    "status": "pending",
    "items": [ ... ]
  }
}
```

### Get Orders
```
GET /api/orders
Authorization: Bearer <token>

Response (200):
[ ... array of orders ... ]
```

### Get Order Details
```
GET /api/orders/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "order_number": "ORD-1234567890-ABC123",
  "total_amount": 129.97,
  "status": "pending",
  "items": [ ... ],
  "payment": {
    "id": 1,
    "amount": 129.97,
    "status": "pending",
    "payment_method": "pending"
  }
}
```

### Update Payment
```
PUT /api/orders/:orderId/payment
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "completed",
  "transaction_id": "TXN-123456789"
}

Response (200):
{
  "message": "Payment updated successfully",
  "payment": { ... }
}
```

---

## Admin Endpoints

### Get Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer <admin_token>

Response (200):
{
  "stats": {
    "total_revenue": 5000.00,
    "total_orders": 42,
    "pending_orders": 3
  },
  "totalUsers": 25,
  "totalProducts": 18,
  "totalOrders": 42,
  "recentOrders": [ ... ]
}
```

### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>

Response (200):
[
  {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "role": "user",
    ...
  }
]
```

### Get All Orders
```
GET /api/admin/orders?status=pending
Authorization: Bearer <admin_token>

Query Parameters:
- status: optional (pending, processing, shipped, delivered, cancelled)

Response (200):
[ ... array of all orders ... ]
```

### Update Order Status
```
PUT /api/admin/orders/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "status": "shipped",
  "shipping_address": "123 Main St"
}

Response (200):
{
  "message": "Order updated successfully",
  "order": { ... }
}
```

### Get All Products
```
GET /api/admin/products
Authorization: Bearer <admin_token>

Response (200):
[ ... array of all products ... ]
```

### Create Product
```
POST /api/admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "name": "Product Name",
  "description": "Product description",
  "price": 49.99,
  "image_url": "https://example.com/image.jpg",
  "category": "Vitamins",
  "stock": 100
}

Response (201):
{
  "message": "Product created successfully",
  "product": { ... }
}
```

### Update Product
```
PUT /api/admin/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "name": "Updated Name",
  "price": 39.99,
  "stock": 80
}

Response (200):
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

### Delete Product
```
DELETE /api/admin/products/:id
Authorization: Bearer <admin_token>

Response (200):
{
  "message": "Product deleted successfully"
}
```

---

## Error Responses

All error responses follow this format:

```
{
  "error": "Error message"
}
```

Common errors:
- 400: Bad request (missing fields, validation errors)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 500: Internal server error
