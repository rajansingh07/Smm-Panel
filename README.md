# SMM Panel

A complete Social Media Marketing (SMM) Panel built with React + Vite for the frontend and Node.js + Express + MongoDB for the backend.

## Features

### User Features
- User registration and authentication
- Dashboard with wallet balance and order statistics
- Place new orders for SMM services
- View order history with status tracking
- Add funds to wallet via Razorpay
- Browse available services by category
- Profile management

### Admin Features
- Admin dashboard with comprehensive statistics
- Manage services (CRUD operations)
- Manage users (view, edit, deactivate)
- View and manage all orders
- Manually add funds to user wallets
- Update order statuses

### Technical Features
- JWT authentication with HTTP-only cookies
- Role-based access control (user/admin)
- SMM provider API integration
- Razorpay payment gateway integration
- Cron jobs for order status updates
- Responsive Tailwind CSS design
- Clean, reusable component architecture

## Project Structure

```
SMM Panel/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic & external APIs
│   │   └── utils/           # Utility functions
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── routes/      # Route guards
│   │   │   └── ui/          # UI components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── auth/        # Auth pages
│   │   │   └── user/        # User pages
│   │   └── services/        # API services
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Installation

### Prerequisites
- Node.js v18+
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smm_panel
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMM_PROVIDER_URL=https://your-smm-provider.com/api/v2
SMM_PROVIDER_API_KEY=your_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password

### Services
- `GET /api/services` - Get all services
- `GET /api/services/categories` - Get categories
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/admin/all` - Get all orders (admin)
- `GET /api/orders/admin/stats` - Get order stats (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Wallet
- `GET /api/wallet/balance` - Get balance
- `GET /api/wallet/history` - Get transaction history
- `POST /api/wallet/add-funds` - Create payment order
- `POST /api/wallet/verify-payment` - Verify payment
- `POST /api/wallet/webhook` - Payment webhook
- `POST /api/wallet/admin/add-funds` - Admin add funds
- `GET /api/wallet/admin/transactions` - Get all transactions (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Models

### User
- name, email, password, role, walletBalance, isActive

### Service
- title, category, description, rate, min, max, providerServiceId, isActive

### Order
- user, service, link, quantity, amount, status, providerOrderId, startCount, remains

### WalletTransaction
- user, type, amount, description, balanceAfter, paymentId, paymentMethod, status, orderId

## Deployment

### Backend
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure Razorpay production keys
5. Run: `npm start`

### Frontend
1. Build: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure API URL in environment variables

## Default Admin Account

To create an admin account, register a normal user first, then update the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## License

MIT
