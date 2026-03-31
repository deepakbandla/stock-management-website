# PantryPro — Inventory Management System

A full-stack inventory management web application built for small businesses to track stock levels, manage categories, and receive automated low-stock alerts via Gmail and Telegram.

🔗 **Live Demo**: [stock-management-website-frontend.vercel.app](https://stock-management-website-frontend.vercel.app/)  
📦 **Repository**: [github.com/deepakbandla/stock-management-website](https://github.com/deepakbandla/stock-management-website)

---

## Features

- **Authentication** — Register and login with email/password or Google OAuth 2.0
- **Inventory Management** — Add, edit, delete and search inventory items with category filtering
- **Low Stock Alerts** — Automated Gmail and Telegram notifications when stock falls below threshold
- **Expiry Tracking** — Monitor items expiring within 7 days directly from the dashboard
- **Dashboard** — Visual analytics with bar and pie charts showing stock distribution by category
- **Protected Routes** — All inventory routes secured with JWT middleware
- **Auto Logout** — Automatically logs out user when token expires

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| Passport.js | Google OAuth 2.0 strategy |
| Nodemailer | Gmail SMTP email alerts |
| Telegram Bot API | Telegram notifications |
| express-validator | Request validation |

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP requests |
| Recharts | Dashboard charts |
| Lucide React | Icons |

### Deployment
| Service | Purpose |
|---|---|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| MongoDB Atlas | Cloud database |

---

## Project Structure
```
stock-management-website/
├── server/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── passport.js         # Google OAuth strategy
│   ├── controllers/
│   │   ├── auth.js             # Register, login logic
│   │   ├── category.js         # Category CRUD
│   │   └── inventory.js        # Inventory CRUD + dashboard stats
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   ├── validate.js         # Validation error handler
│   │   └── validators.js       # express-validator rules
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── InventoryItem.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── category.js
│   │   └── inventory.js
│   ├── services/
│   │   ├── emailService.js     # Nodemailer Gmail alerts
│   │   └── telegramService.js  # Telegram bot alerts
│   └── index.js                # Express app entry point
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── ui/             # Reusable UI components
    │   │   │   ├── badge.jsx
    │   │   │   ├── button.jsx
    │   │   │   ├── card.jsx
    │   │   │   ├── input.jsx
    │   │   │   └── select.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── lib/
    │   │   └── utils.js         # Tailwind merge utility
    │   ├── pages/
    │   │   ├── AuthSuccess.jsx  # Google OAuth callback
    │   │   ├── Categories.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Inventory.jsx
    │   │   ├── ItemForm.jsx
    │   │   ├── Login.jsx
    │   │   ├── NotFound.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js           # Axios instance + interceptors
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console project with OAuth 2.0 credentials
- Gmail account with App Password enabled
- Telegram Bot token from BotFather

### 1. Clone the repository
```bash
git clone https://github.com/deepakbandla/stock-management-website.git
cd stock-management-website
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
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
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login with email/password | No |
| GET | `/api/auth/google` | Initiate Google OAuth | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/categories` | Get all categories | Yes |
| POST | `/api/categories` | Create category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

### Inventory
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/inventory` | Get all items (search + filter) | Yes |
| GET | `/api/inventory/dashboard` | Get dashboard stats | Yes |
| GET | `/api/inventory/low-stock` | Get low stock items | Yes |
| GET | `/api/inventory/:id` | Get single item | Yes |
| POST | `/api/inventory` | Create item | Yes |
| PUT | `/api/inventory/:id` | Update item | Yes |
| DELETE | `/api/inventory/:id` | Delete item | Yes |

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | Google OAuth redirect URI |
| `CLIENT_URL` | Frontend URL for CORS and redirects |
| `GMAIL_USER` | Gmail address to send alerts from |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your account password) |
| `NOTIFY_EMAIL` | Email address to receive alerts |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from BotFather |
| `TELEGRAM_CHAT_ID` | Telegram chat ID to send alerts to |

### Frontend (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Deployment

### Backend — Render
1. Create a new Web Service on [render.com](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all environment variables from `server/.env`

### Frontend — Vercel
1. Import the repo on [vercel.com](https://vercel.com)
2. Set root directory to `client`
3. Framework preset: `Vite`
4. Add `VITE_API_URL` environment variable

---

## Author

**Deepak Bandla**  
[GitHub](https://github.com/deepakbandla)

---

## License

This project is open source and available under the [MIT License](LICENSE).