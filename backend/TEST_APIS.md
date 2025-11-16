# Quick API Testing Guide

## 🚀 Start Server First
```bash
cd backend
npm run dev
```

Server should be running on: http://localhost:5000

---

## 📋 Test APIs with cURL

### 1. Test Server Health
```bash
curl http://localhost:5000/
```

### 2. Signup (Register New User)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Windows PowerShell:**
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method POST -ContentType "application/json" -Body $body
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Windows PowerShell:**
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
```

### 4. Get Current User (Use token from login response)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Windows PowerShell:**
```powershell
$token = "YOUR_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers @{Authorization="Bearer $token"}
```

---

## 🎯 Expected Responses

### Signup Success:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login Success:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🔥 Quick Test Sequence

1. Start server: `npm run dev`
2. Test health: `curl http://localhost:5000/`
3. Signup a user
4. Copy the token from response
5. Login with same credentials
6. Use token to access `/api/auth/me`

---

## ✅ Checklist

- [ ] MongoDB is running
- [ ] .env file is configured
- [ ] Server starts without errors
- [ ] Signup works
- [ ] Login works
- [ ] Token is returned
- [ ] Protected route works with token
