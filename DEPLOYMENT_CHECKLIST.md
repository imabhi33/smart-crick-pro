# Deployment Checklist

## Backend Deployment (Render)

### 1. Environment Variables
Add these in Render dashboard → Environment:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartcrick
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2. Build Settings
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 20.x

### 3. MongoDB Atlas
- Go to Network Access
- Add IP: `0.0.0.0/0` (Allow from anywhere)
- Or add Render's IP addresses

### 4. Test Backend
Visit: `https://smart-crick-pro.onrender.com/`
Should see: `{"success": true, "message": "SmartCrick Pro API is running"}`

---

## Frontend Deployment (Vercel/Netlify)

### 1. Environment Variables
Add in Vercel/Netlify dashboard:
```
VITE_API_URL=https://smart-crick-pro.onrender.com/api
```

### 2. Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node Version:** 20.x

### 3. Rebuild
After adding environment variables, trigger a new deployment.

---

## Common Issues & Fixes

### Issue 1: "Route not found"
**Cause:** CORS not allowing your frontend domain
**Fix:** Add your frontend URL to backend CORS (already done in server.js)

### Issue 2: MongoDB connection fails
**Cause:** IP not whitelisted
**Fix:** Add `0.0.0.0/0` to MongoDB Atlas Network Access

### Issue 3: Environment variables not working
**Cause:** Not rebuilt after adding env vars
**Fix:** Trigger new deployment after adding env vars

### Issue 4: API calls fail with CORS error
**Cause:** Frontend URL not in CORS whitelist
**Fix:** Add `FRONTEND_URL` environment variable in backend

---

## Verification Steps

### 1. Backend Health Check
```bash
curl https://smart-crick-pro.onrender.com/
```
Expected: `{"success": true, ...}`

### 2. API Endpoint Test
```bash
curl https://smart-crick-pro.onrender.com/api/matches
```
Expected: `{"success": true, "data": [...]}`

### 3. Frontend Test
1. Open your deployed frontend
2. Open browser console (F12)
3. Try to login or view matches
4. Check Network tab for API calls
5. Should see successful responses (200 status)

---

## Quick Commands

### Redeploy Backend (if using git)
```bash
git add .
git commit -m "Update backend"
git push
```

### Redeploy Frontend
```bash
cd frontend
npm run build
# Then push to git or use Vercel/Netlify CLI
```

### Test API Locally
```bash
cd backend
npm run dev
# Visit http://localhost:5000
```

### Test Frontend Locally
```bash
cd frontend
npm run dev
# Visit http://localhost:4000
```

---

## Support

If issues persist:
1. Check backend logs in Render dashboard
2. Check frontend build logs in Vercel/Netlify
3. Check browser console for errors
4. Verify all environment variables are set correctly
