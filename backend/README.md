# SmartCrick Pro - Backend API

Backend API for SmartCrick Pro cricket analytics platform with MongoDB authentication.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure MongoDB

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/smartcrick`

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `smartcrick`

Example Atlas URL:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smartcrick?retryWrites=true&w=majority
```

### 3. Configure Environment Variables

Update the `.env` file in the backend folder:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here

# Server Configuration
PORT=5000

# JWT Secret (Change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Environment
NODE_ENV=development
```

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on: **http://localhost:5000**

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Signup (Register New User)
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

---

#### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

---

#### 3. Get Current User (Protected)
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-16T12:00:00.000Z"
  }
}
```

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🧪 Testing with cURL

### Windows PowerShell:
```powershell
# Signup
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method POST -ContentType "application/json" -Body '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"john@example.com","password":"password123"}'
```

### Using Postman:
1. Download Postman
2. Create new request
3. Set method to POST
4. URL: `http://localhost:5000/api/auth/signup`
5. Body → raw → JSON
6. Paste the JSON request body
7. Click Send

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   └── auth.js            # JWT verification
├── models/
│   └── User.js            # User schema
├── routes/
│   └── authRoutes.js      # Auth routes
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
├── server.js             # Main server file
└── README.md             # This file
```

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS enabled
- ✅ Environment variables

---

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin requests

---

## 📝 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network connectivity (for Atlas)
- Whitelist your IP in MongoDB Atlas

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000

### JWT Token Issues
- Ensure JWT_SECRET is set in `.env`
- Check token format: `Bearer <token>`
- Verify token hasn't expired (30 days)

---

## 📞 Support

For issues or questions, check the main project README.

---

**Backend is ready! Start the server and test the APIs.** 🚀
