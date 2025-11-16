# SmartCrick Pro - Command Reference

## 🚀 Quick Commands

### Development
```bash
# Start development server
npm run dev

# Start on specific port
npm run dev -- --port 4000

# Open in browser automatically
npm run dev -- --open
```

### Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Build and preview
npm run build && npm run preview
```

### Dependencies
```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Clean & Reset
```bash
# Remove node_modules
rm -rf node_modules

# Remove package-lock.json
rm package-lock.json

# Fresh install
rm -rf node_modules package-lock.json && npm install

# Clear npm cache
npm cache clean --force
```

---

## 📁 File Operations

### Create New Component
```bash
# Create component file
touch src/components/ComponentName.jsx
```

### Create New Page
```bash
# Create page file
touch src/pages/PageName.jsx
```

### Create New Utility
```bash
# Create utility file
touch src/utils/utilityName.js
```

---

## 🔧 Git Commands (If using Git)

### Initial Setup
```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: SmartCrick Pro"

# Add remote
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main
```

### Regular Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your message"

# Push changes
git push

# Pull latest changes
git pull
```

### Branching
```bash
# Create new branch
git checkout -b feature-name

# Switch branch
git checkout branch-name

# Merge branch
git merge branch-name

# Delete branch
git branch -d branch-name
```

---

## 🎨 Tailwind Commands

### Generate Tailwind Config
```bash
npx tailwindcss init

# With PostCSS
npx tailwindcss init -p

# Full config
npx tailwindcss init --full
```

### Build Tailwind CSS
```bash
# Watch mode
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch

# Production build
npx tailwindcss -i ./src/index.css -o ./dist/output.css --minify
```

---

## 📦 Package Management

### Check Versions
```bash
# Node version
node --version

# npm version
npm --version

# Check package version
npm list package-name

# Check global packages
npm list -g --depth=0
```

### Update Packages
```bash
# Update specific package
npm update package-name

# Update all packages
npm update

# Update to latest (breaking changes)
npm install package-name@latest
```

---

## 🧪 Testing Commands (If you add testing)

### Jest
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Vitest
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

---

## 🔍 Debugging Commands

### Check for Errors
```bash
# ESLint check
npm run lint

# Fix ESLint errors
npm run lint -- --fix

# Type check (if using TypeScript)
npm run type-check
```

### Analyze Bundle
```bash
# Install analyzer
npm install -D rollup-plugin-visualizer

# Build with analysis
npm run build -- --mode analyze
```

---

## 🌐 Deployment Commands

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### GitHub Pages
```bash
# Install gh-pages
npm install -D gh-pages

# Deploy
npm run deploy
```

---

## 🛠️ Useful npm Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "clean": "rm -rf dist node_modules",
    "reinstall": "npm run clean && npm install",
    "deploy": "npm run build && vercel --prod"
  }
}
```

---

## 📊 Performance Commands

### Lighthouse
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:4001 --view

# Save report
lighthouse http://localhost:4001 --output html --output-path ./report.html
```

### Bundle Size Analysis
```bash
# Install size-limit
npm install -D size-limit @size-limit/preset-app

# Check size
npx size-limit
```

---

## 🔐 Security Commands

### Audit Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update all to latest
npm update

# Interactive update
npx npm-check-updates -i
```

---

## 📱 Mobile Testing

### Using ngrok
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 4001
```

### Using localtunnel
```bash
# Install localtunnel
npm install -g localtunnel

# Create tunnel
lt --port 4001
```

---

## 🎯 Quick Shortcuts

### Development Workflow
```bash
# 1. Start development
npm run dev

# 2. Make changes (files auto-reload)

# 3. Build for production
npm run build

# 4. Test production build
npm run preview

# 5. Deploy
vercel --prod
```

### Daily Workflow
```bash
# Morning: Pull latest changes
git pull

# Work: Make changes and test
npm run dev

# Evening: Commit and push
git add .
git commit -m "Description of changes"
git push
```

---

## 🆘 Emergency Commands

### Server Won't Start
```bash
# Kill process on port
npx kill-port 4001

# Or on Windows
netstat -ano | findstr :4001
taskkill /PID <PID> /F
```

### Build Fails
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json dist
npm cache clean --force
npm install
npm run build
```

### Git Issues
```bash
# Discard all changes
git reset --hard

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Force push (careful!)
git push --force
```

---

## 📚 Documentation Commands

### Generate Docs
```bash
# Install JSDoc
npm install -D jsdoc

# Generate documentation
npx jsdoc src -r -d docs
```

---

## 🎨 Code Formatting

### Prettier
```bash
# Install Prettier
npm install -D prettier

# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .
```

---

## 💡 Pro Tips

### Aliases (Add to .bashrc or .zshrc)
```bash
alias dev="npm run dev"
alias build="npm run build"
alias preview="npm run preview"
alias deploy="npm run build && vercel --prod"
```

### Package.json Scripts
```json
{
  "scripts": {
    "start": "npm run dev",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && vercel --prod",
    "clean": "rm -rf dist",
    "fresh": "rm -rf node_modules package-lock.json && npm install"
  }
}
```

---

## 🔗 Useful Links

- **npm Docs**: https://docs.npmjs.com/
- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **Tailwind Docs**: https://tailwindcss.com/
- **Git Docs**: https://git-scm.com/doc

---

**Keep this file handy for quick reference! 📖**
