# ShopKart - Full-Stack MERN E-Commerce Platform

ShopKart is a modern, full-stack e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). It features end-to-end customer workflows including secure JWT authentication, product catalog browsing, wishlist management, cart state management powered by Redux Toolkit, checkout with Razorpay Test Mode payment gateway integration, and order tracking.

---

## Features

- **Customer Authentication**: Secure user registration, login, session checking (`/customers/me`), and logout using HTTP-only cookie-based JWT tokens and bcrypt password hashing.
- **Product Catalog**: Explore available products, search by keyword, filter by categories, and view detailed product pages with stock availability.
- **Wishlist Management**: Add, remove, or toggle items on a personal wishlist with real-time wishlist item counters.
- **Cart Management (Redux Toolkit)**: Global client-side cart state synchronized with the MongoDB backend database, providing quantity increments, decrements, item removals, and real-time total calculations.
- **Checkout & Razorpay Test Payment**: Server-side order creation with server-validated cart prices, Razorpay checkout modal, and HMAC-SHA256 signature verification.
- **Order History & Tracking**: Detailed order history overview and individual order detail timeline tracking with shipping and payment status.
- **Bonus Capabilities**:
  - In-app password change functionality (`PATCH /customers/change-password`).
  - Development order status transition endpoint (`PATCH /orders/:id/status`).
  - Pre-configured product database seeder script (`npm run seed`).

---

## Tech Stack

- **Frontend**:
  - React 19
  - Vite (Build Tool & Dev Server)
  - Redux Toolkit & React-Redux (Global State)
  - React Router DOM v7 (Client-side Routing)
  - Axios (HTTP client with credentials support)
  - Tailwind CSS (Styling)
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose (Data Modeling)
  - JSON Web Tokens (`jsonwebtoken`) & `cookie-parser`
  - `bcrypt` (Password Hashing)
  - `razorpay` (Payment Gateway SDK)
  - `cors` & `dotenv`

---

## Folder Structure

This repository is structured as a unified monorepo containing both the frontend and backend applications:

```text
shopkart/
├── backend/                  # Node.js / Express backend server
│   ├── config/               # Configuration (Razorpay SDK instance)
│   ├── controllers/          # Request handlers (auth, cart, order, product, wishlist)
│   ├── middlewares/          # JWT auth middleware
│   ├── models/               # Mongoose schemas (Customer, Product, Cart, Wishlist, Order)
│   ├── routes/               # Express route declarations
│   ├── utils/                # Helper utilities, token generation, seed script
│   ├── .env.example          # Environment variable template
│   ├── .gitignore            # Backend gitignore
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies and scripts
├── frontend/                 # React client application built with Vite
│   ├── public/               # Public assets and icons
│   ├── src/
│   │   ├── assets/           # Static asset files
│   │   ├── components/       # Reusable UI components
│   │   ├── features/cart/    # Redux Toolkit cart slice and async thunks
│   │   ├── pages/            # Page views (Login, Products, Cart, Checkout, Orders, etc.)
│   │   ├── services/         # Axios central instance and API services
│   │   ├── store/            # Redux store configuration
│   │   ├── App.jsx           # App routes and shell
│   │   └── main.jsx          # React entry point
│   ├── .env.example          # Frontend environment variable template
│   ├── .gitignore            # Frontend gitignore
│   ├── vercel.json           # SPA routing rewrite rule for Vercel
│   ├── vite.config.js        # Vite build configuration
│   └── package.json          # Frontend dependencies and scripts
├── .gitignore                # Root gitignore
└── README.md                 # Project documentation
```

---

## Prerequisites

- **Node.js**: `v18.x` or `v20.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: Active MongoDB Atlas cluster connection string or local MongoDB instance (`mongodb://localhost:27017/shopkart`)
- **Razorpay Account**: Razorpay Dashboard test mode credentials (`Key ID` and `Key Secret`)

---

## Step-by-Step Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ranjit-05/ShopeCart.git
cd ShopeCart
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Open `backend/.env` and fill in your actual connection values:
   - `PORT=5000`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-jwt-secret-string>`
   - `FRONTEND_URL=http://localhost:5173`
   - `RAZORPAY_KEY_ID=<your-razorpay-test-key-id>`
   - `RAZORPAY_KEY_SECRET=<your-razorpay-test-key-secret>`
5. (Optional) Seed the database with sample products:
   ```bash
   npm run seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend server will run on `http://localhost:5000`.*

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Verify `frontend/.env` contains:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend client will run on `http://localhost:5173`.*

---

## Environment Variables

### Backend Variables (`backend/.env`)

| Variable Name | Purpose | Example / Placeholder |
| --- | --- | --- |
| `PORT` | Port number the Express server listens on | `5000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `MONGO_URI` | MongoDB Atlas or local connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/shopkart` |
| `JWT_SECRET` | Secret key used for signing and verifying JWTs | `your_super_secret_jwt_key` |
| `COOKIE_EXPIRE` | Expiration time for authentication cookie in days | `7` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:5173` (or production URL) |
| `RAZORPAY_KEY_ID` | Razorpay API Test Key ID | `rzp_test_xxxxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Test Key Secret | `your_razorpay_key_secret` |
| `ENABLE_DEV_ORDER_STATUS` | Allow test updates to order statuses | `true` |

### Frontend Variables (`frontend/.env`)

| Variable Name | Purpose | Example / Placeholder |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000` (or Render deployed URL) |

---

## API Endpoints

All endpoints are verified against the backend route controllers.

### Health Check

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/` | API Health status check | No |
| `GET` | `/health` | API Health status check | No |

### Customer Authentication (`/customers`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/customers/register` | Register a new customer | No |
| `POST` | `/customers/login` | Authenticate customer and set auth cookie | No |
| `GET` | `/customers/me` | Retrieve profile of authenticated customer | **Yes** |
| `POST` | `/customers/logout` | Clear customer auth cookie | **Yes** |
| `PATCH` | `/customers/change-password` | Update account password | **Yes** |

### Products (`/products`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/products` | Fetch all products (supports query filters) | No |
| `GET` | `/products/:id` | Fetch product details by ID | No |
| `POST` | `/products` | Create a new product (admin/seed) | No |

### Wishlist (`/wishlist`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/wishlist` | Fetch customer wishlist items | **Yes** |
| `GET` | `/wishlist/count` | Get total count of wishlist items | **Yes** |
| `POST` | `/wishlist/:productId` | Add product to wishlist | **Yes** |
| `DELETE` | `/wishlist/:productId` | Remove product from wishlist | **Yes** |
| `PATCH` | `/wishlist/:productId/toggle` | Toggle item in/out of wishlist | **Yes** |

### Cart (`/cart`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/cart` | Fetch authenticated customer cart | **Yes** |
| `POST` | `/cart/:productId` | Add item to cart | **Yes** |
| `PATCH` | `/cart/:productId` | Update item quantity in cart | **Yes** |
| `DELETE` | `/cart/:productId` | Remove item from cart | **Yes** |

### Orders (`/orders`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/orders/create-payment-order` | Calculate totals & create Razorpay order | **Yes** |
| `POST` | `/orders/verify-payment` | Verify HMAC-SHA256 signature and mark Paid | **Yes** |
| `POST` | `/orders/payment-failed` | Record payment failure and update status | **Yes** |
| `GET` | `/orders` | Retrieve list of all orders for user | **Yes** |
| `GET` | `/orders/:id` | Retrieve single order details by ID | **Yes** |
| `PATCH` | `/orders/:id/status` | Update order delivery status (dev testing) | **Yes** |

---

## Razorpay Test Mode Note

This application is strictly configured for **Razorpay Test Mode**.

> [!WARNING]
> Never use real payment credentials, real credit/debit card numbers, or live API keys. Always use `rzp_test_...` credentials.

### How to Test a Payment

1. Log in to your Razorpay Dashboard and switch to **Test Mode**.
2. Copy your **Key ID** and **Key Secret** into `backend/.env`.
3. Add products to your cart and proceed to the Checkout page.
4. Fill in shipping details and click **Place Order & Pay**.
5. When the Razorpay test modal appears:
   - Select **Netbanking** or **Card**.
   - Use any test card number or test UPI/Netbanking bank option (e.g., SBI / HDFC).
   - Razorpay will present a simulated success/failure prompt: click **Success**.
6. The frontend will verify the payment signature with the backend and redirect to `/order-success/:id`.

---

## Deployment Links

- **Frontend (Vercel)**: https://shope-cart.vercel.app/
- **Backend (Render)**: https://shopkart-api-nqn1.onrender.com
- **GitHub Repository**: `https://github.com/ranjit-05/ShopeCart.git`

---

## Security Notes

1. **Environment Variables**: No real credentials, database strings, or secrets are committed to version control. All sensitive keys are loaded via environment variables and managed in hosting dashboards.
2. **Server-Side Validation**: Product pricing and order subtotals are computed on the backend directly from database records, preventing client-side price tampering.
3. **Cryptographic Signature Verification**: Razorpay payment signatures are validated using HMAC-SHA256 with `RAZORPAY_KEY_SECRET` before marking orders as paid.
4. **CORS Restrictions**: The backend rejects unauthorized cross-origin requests and permits only specified origins (`FRONTEND_URL` and local development hosts) with credentials enabled.
5. **Secure Authentication**: Customer passwords are encrypted with `bcrypt` (10 salt rounds) and session authentication is validated via verified JWT tokens.
