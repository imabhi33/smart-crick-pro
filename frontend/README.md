# SmartCrick Pro - Frontend

React + Vite frontend application for SmartCrick Pro cricket analytics platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will run on: **http://localhost:4001/**

### 3. Build for Production
```bash
npm run build
```

---

## 📦 Features

### 5 Complete Modules:

1. **Score Predictor** - Win percentage calculator
2. **Shot Analyzer** - 8 cricket shots with expert tips
3. **Match Simulator** - Ball-by-ball match simulation
4. **Live Scorecard** - Professional live cricket scoring system
5. **Cricket Quiz** - 10 questions with instant feedback

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── logo.png              # App logo
├── src/
│   ├── components/
│   │   └── Navbar.jsx        # Navigation
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── ScorePredictor.jsx
│   │   ├── ShotAnalyzer.jsx
│   │   ├── MatchSimulator.jsx
│   │   ├── Scorecard.jsx     # Live scoring system
│   │   └── CricketQuiz.jsx
│   ├── utils/
│   │   ├── shotData.js
│   │   ├── quizData.js
│   │   └── localStorage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design Features

- Modern glassmorphism UI
- Smooth animations
- Responsive design
- Dark theme
- Custom color scheme (Blue & Green)

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🌐 Routes

- `/` - Home page
- `/score-predictor` - Score prediction
- `/shot-analyzer` - Shot analysis
- `/match-simulator` - Match simulation
- `/scorecard` - Live scoring system
- `/quiz` - Cricket quiz

---

## 🔗 Connect to Backend

To connect with backend API, update API calls to:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

**Frontend is ready to use!** 🏏
