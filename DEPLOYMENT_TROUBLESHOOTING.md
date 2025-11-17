# Deployment Troubleshooting Guide

## Issue: "Route not found" after deployment

### Common Causes & Solutions:

## 1. CORS Configuration

**Problem:** Backend doesn't allow requests from your frontend domain.

**Solution:** Update `backend/server.js` CORS configuration:

```javascript
// Instead of:
app.use(cors());

// Use:
app.use(cors({
  origin: [
    'http://localhost:4000',
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app',
    'https://your-frontend-domain.netlify.app'
  ],
  credentials: true
}));
```

## 2. Environment Variables

**Frontend (.env):**
```
VITE_API_URL=https://smart-crick-pro.onrender.com/api
```

**Backend (.env on Render/Deployment):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=5000
```

## 3. API URL Format

Make sure your API URL ends with `/api`:
- ✅ Correct: `https://smart-crick-pro.onrender.com/api`
- ❌ Wrong: `https://smart-crick-pro.onrender.com/api/`
- ❌ Wrong: `https://smart-crick-pro.onrender.com`

## 4. Test Backend Directly

Test if your backend is running:

```bash
# Test health check
curl https://smart-crick-pro.onrender.com/

# Test auth route
curl https://smart-crick-pro.onrender.com/api/auth/login

# Test matches route
curl https://smart-crick-pro.onrender.com/api/matches
```

## 5. Check Deployment Logs

**On Render:**
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for errors like:
   - MongoDB connection errors
   - Missing environment variables
   - Route registration errors

## 6. Verify Build Command

**Backend (Render):**
- Build Command: `npm install`
- Start Command: `npm start` or `node server.js`

**Frontend (Vercel/Netlify):**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 7. Common Deployment Issues

### Issue: Routes work locally but not in production

**Solution:** Check if all route files are committed to git:
```bash
git status
git add backend/routes/
git commit -m "Add route files"
git push
```

### Issue: MongoDB connection fails

**Solution:** 
1. Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
2. Check MongoDB connection string in deployment env vars

### Issue: CORS errors in browser console

**Solution:** Update CORS to allow your frontend domain (see #1 above)

## 8. Frontend Environment Variables

After updating `.env`, rebuild your frontend:

```bash
cd frontend
npm run build
```

Then redeploy to Vercel/Netlify.

## 9. Debug API Calls

Add console logging in `frontend/src/services/api.service.js`:

```javascript
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);
```

## 10. Quick Fix Checklist

- [ ] Backend is deployed and running
- [ ] Frontend `.env` has correct `VITE_API_URL`
- [ ] Backend CORS allows frontend domain
- [ ] MongoDB connection string is correct
- [ ] All environment variables are set in deployment platform
- [ ] Routes are properly registered in `server.js`
- [ ] Git repository has all route files
- [ ] Frontend is rebuilt after env changes

## Testing Steps

1. **Test Backend Health:**
   ```
   https://smart-crick-pro.onrender.com/
   ```
   Should return: `{"success": true, "message": "SmartCrick Pro API is running"}`

2. **Test API Route:**
   ```
   https://smart-crick-pro.onrender.com/api/matches
   ```
   Should return matches data or empty array

3. **Test from Frontend:**
   Open browser console and check network tab for API calls

## Need More Help?

Check these logs:
1. Backend deployment logs (Render dashboard)
2. Frontend build logs (Vercel/Netlify dashboard)
3. Browser console (F12 → Console tab)
4. Browser network tab (F12 → Network tab)
