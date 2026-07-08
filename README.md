# PantryPro — AI-Powered Inventory Management System

A full-stack inventory management web application built for small businesses to efficiently manage inventory, monitor stock levels, receive automated low-stock alerts via Gmail and Telegram, and interact with an AI-powered inventory assistant built using the Google Gemini API.

🔗 **Live Demo**: https://stock-management-website-frontend.vercel.app/  
📦 **Repository**: https://github.com/deepakbandla/stock-management-website

---

## Features

- **Authentication** — Register and login with email/password or Google OAuth 2.0
- **Inventory Management** — Add, edit, delete, search, and filter inventory items by category
- **Category Management** — Organize inventory into custom categories
- **Low Stock Alerts** — Automated Gmail and Telegram notifications when stock falls below configurable thresholds
- **Expiry Tracking** — Monitor products expiring within the next 7 days
- **Interactive Dashboard** — Visual analytics with bar and pie charts for inventory insights
- **AI Inventory Assistant** — Chat with an AI assistant powered by **Google Gemini** to:
  - View current inventory information
  - Check low-stock products
  - Understand dashboard statistics
  - Get answers about inventory and categories
  - Navigate application features using natural language
- **Protected Routes** — JWT-secured API endpoints
- ⏱**Auto Logout** — Automatic logout when authentication token expires

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| Passport.js | Google OAuth 2.0 |
| Google Gemini API | AI chatbot integration |
| Nodemailer | Gmail email alerts |
| Telegram Bot API | Telegram notifications |
| express-validator | Request validation |

### Frontend

| Technology | Purpose |
|------------|---------|
| React + Vite | Frontend framework |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Axios | API communication |
| Recharts | Dashboard visualizations |
| Lucide React | Icons |

### Deployment

| Service | Purpose |
|------------|---------|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| MongoDB Atlas | Cloud database |

---

# Project Structure

```text
stock-management-website/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   │
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── category.js
│   │   └── inventory.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── validators.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── InventoryItem.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── category.js
│   │   └── inventory.js
│   │
│   ├── services/
│   │   ├── emailService.js
│   │   ├── telegramService.js
│   │   └── geminiService.js
│   │
│   └── index.js
│
└── client/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── lib/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    │
    └── index.html
```

---

# AI Inventory Assistant

PantryPro includes an intelligent chatbot powered by **Google Gemini** that allows users to interact with their inventory using natural language.

### Example Questions

- Which items are low in stock?
- Show all dairy products.
- What items are expiring this week?
- Which category has the highest number of products?
- Explain the dashboard statistics.
- How do I add a new inventory item?
- How can I update stock quantities?

The chatbot provides context-aware responses to help users quickly understand and manage their inventory without manually navigating through the application.

---

# Getting Started

## Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console project with OAuth 2.0 credentials
- Gmail account with App Password enabled
- Telegram Bot Token from BotFather
- Google Gemini API Key

---

## 1. Clone Repository

```bash
git clone https://github.com/deepakbandla/stock-management-website.git

cd stock-management-website
```

---

## 2. Backend Setup

```bash
cd server

npm install
```

Create `server/.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

CLIENT_URL=http://localhost:3000

GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
NOTIFY_EMAIL=recipient@gmail.com

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

GEMINI_API_KEY=your_google_gemini_api_key
```

Start backend

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd client

npm install
```

Create `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend

```bash
npm run dev
```

Visit

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/google` | Google OAuth | No |
| GET | `/api/auth/google/callback` | Google OAuth Callback | No |

---

## Categories

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/categories` | Get categories | Yes |
| POST | `/api/categories` | Create category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

---

## Inventory

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/inventory` | Get inventory items | Yes |
| GET | `/api/inventory/dashboard` | Dashboard statistics | Yes |
| GET | `/api/inventory/low-stock` | Low stock items | Yes |
| GET | `/api/inventory/:id` | Get item | Yes |
| POST | `/api/inventory` | Create item | Yes |
| PUT | `/api/inventory/:id` | Update item | Yes |
| DELETE | `/api/inventory/:id` | Delete item | Yes |

---

## AI Chatbot

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/chat` | Chat with the Gemini-powered inventory assistant | Yes |

---

# Environment Variables

## Backend (`server/.env`)

| Variable | Description |
|------------|-------------|
| PORT | Server Port |
| MONGO_URI | MongoDB Atlas Connection String |
| JWT_SECRET | JWT Secret |
| GOOGLE_CLIENT_ID | Google OAuth Client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth Client Secret |
| GOOGLE_CALLBACK_URL | Google OAuth Callback URL |
| CLIENT_URL | Frontend URL |
| GMAIL_USER | Gmail Address |
| GMAIL_APP_PASSWORD | Gmail App Password |
| NOTIFY_EMAIL | Email to receive alerts |
| TELEGRAM_BOT_TOKEN | Telegram Bot Token |
| TELEGRAM_CHAT_ID | Telegram Chat ID |
| GEMINI_API_KEY | Google Gemini API Key |

---

## Frontend (`client/.env`)

| Variable | Description |
|------------|-------------|
| VITE_API_URL | Backend API URL |

---

# Deployment

## Backend (Render)

1. Create a new Web Service.
2. Select the repository.
3. Set **Root Directory** to `server`.
4. Build Command:

```bash
npm install
```

5. Start Command

```bash
node index.js
```

6. Add all backend environment variables.

---

## Frontend (Vercel)

1. Import repository.
2. Set **Root Directory** to `client`.
3. Framework Preset → **Vite**
4. Add

```env
VITE_API_URL=https://your-backend-url/api
```

Deploy.

---

# Future Improvements

- AI-powered demand forecasting
- Inventory consumption prediction
- Smart purchase recommendations
- Voice-enabled inventory assistant
- Barcode & QR code scanning
- Sales and inventory analytics
- Multi-user collaboration
- AI-generated inventory reports

---

# Author

**Deepak Bandla**

GitHub: https://github.com/deepakbandla

---

# License

This project is licensed under the MIT License.