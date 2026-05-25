<h1 align="center">✨ Slack Clone with Chat & Video Calling ✨</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

Highlights:

- 💬 Real-time Messaging with Threads, Reactions & Pinned Messages
- 📂 File Sharing (Images, PDFs, ZIPs & more)
- 📊 Polls with Multiple Options, Anonymous Mode, Suggestions & Comments
- 🔐 Simple Email/Password Authentication (JWT)
- 📨 Direct Messages & Private Channels
- 📹 1-on-1 and Group Video Calls with Screen Sharing & Recording
- 🎉 Real-time Reactions during Calls
- 🚨 Production-grade Error Monitoring with Sentry
- 🚀 Free Deployment Setup
- 🎯 Built with Scalable Technologies like Stream
- ⏳ And much more!

---

## 🧪 .env Setup

### Backend (`/backend`)

```
PORT=5001
MONGO_URI=your_mongo_uri_here

NODE_ENV=development

JWT_SECRET=your_long_random_secret_here

STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here

SENTRY_DSN=your_sentry_dsn_here

CLIENT_URL=http://localhost:5173
```

### Frontend (`/frontend`)

```
VITE_STREAM_API_KEY=your_stream_api_key_here
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Auth API

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/auth/me` | Bearer token required |

On register, users are synced to Stream Chat automatically.
