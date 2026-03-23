# PlainFuel Backend - Prisma Setup Guide

## 🎯 Overview

The backend now uses **Prisma ORM** instead of raw SQL queries. All database operations are type-safe and managed through the `schema.prisma` file.

---

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client initialization
│   │   └── init.ts            # Database connection setup
│   ├── models/                # Prisma model wrappers
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Payment.ts
│   ├── controllers/           # Business logic
│   ├── middleware/
│   ├── routes/
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env                       # Environment variables
└── schema.sql                 # Raw SQL schema (reference only)
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- Express & TypeScript
- Prisma & Prisma Client
- All other required packages

### 2. Setup Environment

Create or update `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plainfuel"
JWT_SECRET=plainfuel_secret_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Create PostgreSQL Database

```bash
psql -U postgres -c "CREATE DATABASE plainfuel;"
```

### 4. Run Prisma Migrations

This creates all tables from `schema.prisma`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Follow the prompts and name your migration (e.g., "init")

### 5. Start the Server

```bash
npm run dev
```

You should see:
```
Connected to database successfully
Server running on port 5000
```

---

## 📊 Database Schema (schema.prisma)

### User Model
```prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  firstName String?
  lastName  String?
  phone     String?
  role      Role    @default(USER)    // USER or ADMIN
  address   String?
  city      String?
  state     String?
  zip       String?
  country   String?
  
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Product Model
```prisma
model Product {
  id          Int     @id @default(autoincrement())
  name        String
  description String?
  price       Decimal @db.Decimal(10, 2)
  imageUrl    String?
  category    String?
  stock       Int     @default(0)
  
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Order Model
```prisma
model Order {
  id              Int     @id @default(autoincrement())
  orderNumber     String  @unique
  totalAmount     Decimal @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  shippingAddress String?
  
  userId          Int
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  items           OrderItem[]
  payment         Payment?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### OrderItem Model
```prisma
model OrderItem {
  id        Int @id @default(autoincrement())
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  
  orderId   Int
  order     Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  
  createdAt DateTime @default(now())
}
```

### Payment Model
```prisma
model Payment {
  id            Int @id @default(autoincrement())
  amount        Decimal @db.Decimal(10, 2)
  paymentMethod String?
  status        PaymentStatus @default(PENDING)
  transactionId String?
  
  orderId       Int @unique
  order         Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Enums
```prisma
enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
}
```

---

## 🔧 Common Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate
# Follow the prompts and enter migration name

# View database in Prisma Studio (visual editor)
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

---

## 💾 Using Prisma in Code

### Example: User Operations

```typescript
import { User } from '../models/User';

// Create user
const user = await User.create({
  email: 'user@example.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'USER'
});

// Find by email
const user = await User.findByEmail('user@example.com');

// Find by ID
const user = await User.findById(1);

// Get all users
const users = await User.findAll();

// Update user
const updated = await User.update(1, {
  firstName: 'Jane',
  city: 'New York'
});

// Delete user
const deleted = await User.delete(1);
```

### Example: Order Operations

```typescript
import { Order } from '../models/Order';

// Create order
const order = await Order.create({
  userId: 1,
  orderNumber: 'ORD-123456',
  totalAmount: 99.99,
  status: 'PENDING',
  shippingAddress: '123 Main St'
});

// Get user's orders
const orders = await Order.findByUserId(1);

// Get order with items
const items = await Order.getItems(orderId);

// Add item to order
await Order.addItem(orderId, productId, quantity, price);

// Update order status
await Order.update(orderId, {
  status: 'SHIPPED',
  shippingAddress: 'new address'
});
```

---

## 🔐 Field Naming Convention

**Frontend & Backend use camelCase**:
- `firstName` (not `first_name`)
- `lastName` (not `last_name`)
- `shippingAddress` (not `shipping_address`)
- `imageUrl` (not `image_url`)
- `totalAmount` (not `total_amount`)
- `orderNumber` (not `order_number`)
- `paymentMethod` (not `payment_method`)
- `transactionId` (not `transaction_id`)
- `productId` (not `product_id`)
- `orderId` (not `order_id`)
- `userId` (not `user_id`)

**Enums use UPPERCASE**:
- `USER`, `ADMIN` (not `user`, `admin`)
- `PENDING`, `PROCESSING`, `SHIPPED` (not `pending`, `processing`, `shipped`)
- `COMPLETED`, `FAILED` (not `completed`, `failed`)

---

## 🐛 Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running:
- Windows: Services > PostgreSQL Server
- Mac: `brew services start postgresql`
- Linux: `sudo service postgresql start`

### Database Not Found
```
Error: database "plainfuel" does not exist
```
**Solution**: Create the database:
```bash
psql -U postgres -c "CREATE DATABASE plainfuel;"
```

### Schema Out of Sync
```
Error: Prisma schema validation error
```
**Solution**: Run migrations:
```bash
npm run prisma:migrate
```

### Need to Reset Database
```bash
npx prisma migrate reset
npm run prisma:migrate
```

---

## 📝 Notes

- Prisma automatically handles type safety for all database operations
- All passwords are hashed with bcryptjs before storage
- JWT tokens are used for authentication
- Timestamps (createdAt, updatedAt) are automatically managed
- Foreign keys ensure data integrity
- Cascade deletes clean up related records

---

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `plainfuel` created
- [ ] `.env` file configured with DATABASE_URL
- [ ] `npm install` completed
- [ ] `npm run prisma:generate` completed
- [ ] `npm run prisma:migrate` completed (creates tables)
- [ ] `npm run dev` started successfully
- [ ] `http://localhost:5000/health` returns `{"status":"healthy"}`
