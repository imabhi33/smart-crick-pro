# 🏏 SmartCrick Pro

Complete cricket analytics and live scoring platform with React frontend and Node.js backend.

## 📁 Project Structure

```
smart-crick-pro/
├── frontend/          # React + Vite application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/           # Node.js + Express API
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── server.js
│
└── README.md         # This file
```

---

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
**Runs on:** http://localhost:4001/

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
**Runs on:** http://localhost:5000/

---

## 📦 Features

### Frontend (React)
- ✅ Score Predictor - Win percentage calculator
- ✅ Shot Analyzer - 8 cricket shots with tips
- ✅ Match Simulator - Ball-by-ball simulation
- ✅ Live Scorecard - Professional scoring system
- ✅ Cricket Quiz - Knowledge testing

### Backend (Node.js)
- ✅ User Authentication (JWT)
- ✅ MongoDB Integration
- ✅ Signup/Login APIs
- ✅ Protected Routes
- ✅ Password Hashing

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- LocalStorage

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

---

## 📖 Documentation

- **Frontend:** See `frontend/README.md`
- **Backend:** See `backend/README.md`
- **API Testing:** See `backend/TEST_APIS.md`

---

## 🔧 Configuration

### Frontend
- Port: 4001 (configured in `frontend/vite.config.js`)

### Backend
- Port: 5000 (configured in `backend/.env`)
- MongoDB: Configure in `backend/.env`

---

## 🌐 API Endpoints

**Base URL:** http://localhost:5000/api

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

---

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## 🚀 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend
```bash
cd backend
npm start
# Deploy to Heroku, Railway, or any Node.js hosting
```

---

## 📞 Support

For detailed setup instructions:
- Frontend: Check `frontend/README.md`
- Backend: Check `backend/README.md`

---

## 🎯 Development Workflow

1. Start MongoDB (local or Atlas)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Access app at http://localhost:4001/

---

**Built with ❤️ for cricket enthusiasts!** 🏏
