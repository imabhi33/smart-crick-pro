# SmartCrick Pro 🏏

A comprehensive cricket analytics and training platform built with React, Vite, and Tailwind CSS. Experience the complete cricket ecosystem with 5 powerful modules, all working offline!

![SmartCrick Pro](./public/logo.png)

## 🌟 Features

### 1. Score Predictor 📊
- Input match details (teams, runs, balls, wickets)
- Real-time win percentage calculation
- Projected score analysis
- Run rate and required run rate metrics
- Beautiful progress bar visualization

### 2. Shot Analyzer 🏏
- 8 different cricket shots with detailed analysis
- Difficulty ratings for each shot
- Expert tips and techniques
- When to play each shot
- Common mistakes to avoid
- Practice recommendations

### 3. Match Simulator ⚡
- Interactive toss system
- Choose to bat or bowl
- Ball-by-ball random outcomes (0,1,2,3,4,6,W)
- Live scoreboard with runs, wickets, and overs
- Over-by-over summary
- Complete match simulation experience

### 4. Scorecard System 📝
- Add and manage batsmen details (runs, balls, fours, sixes)
- Add and manage bowler details (overs, runs, wickets)
- Ball-by-ball entry system
- Automatic strike rate calculation
- Automatic economy rate calculation
- LocalStorage persistence (data saved automatically)
- Restore data on page reload
- Complete offline functionality

### 5. Cricket Quiz 🎯
- 10 challenging cricket questions
- Multiple choice format
- Instant feedback (correct/incorrect)
- Score tracking
- Progress bar
- Performance analysis
- Retry functionality

## 🚀 Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **LocalStorage API** - Offline data persistence

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd smart-crick-pro

# Install dependencies
npm install

# Start development server on port 4000
npm run dev
```

The application will be available at `http://localhost:4000`

## 🏗️ Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation component
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── ScorePredictor.jsx  # Score prediction module
│   ├── ShotAnalyzer.jsx    # Shot analysis module
│   ├── MatchSimulator.jsx  # Match simulation module
│   ├── Scorecard.jsx       # Scorecard management
│   └── CricketQuiz.jsx     # Quiz module
├── utils/
│   ├── shotData.js         # Cricket shots data
│   ├── quizData.js         # Quiz questions data
│   └── localStorage.js     # LocalStorage utilities
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## 🎨 Design Features

- **Modern UI** - Clean, attractive interface with glassmorphism effects
- **Smooth Animations** - Fade-in, slide-up, and scale transitions
- **Responsive Design** - Works perfectly on all devices
- **Dark Theme** - Eye-friendly dark color scheme
- **Brand Colors** - Blue (#3B9FE8) and Green (#B8FF3C) theme
- **Interactive Elements** - Hover effects and smooth transitions

## 🔧 Configuration

### Tailwind CSS
Custom theme configuration in `tailwind.config.js`:
- Primary colors (blue, green, dark)
- Custom animations (fade-in, slide-up, bounce-slow)
- Glass effect utilities

### Vite
Server configuration in `vite.config.js`:
- Port: 4000
- Host: true (for network access)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 💾 Data Persistence

The Scorecard module uses LocalStorage to save:
- Batsmen statistics
- Bowler statistics
- Ball-by-ball entries

Data persists across page reloads and browser sessions.

## 🎯 Key Highlights

✅ 100% Offline functionality
✅ No backend required
✅ Instant load times
✅ Smooth animations
✅ Mobile-friendly
✅ Data persistence
✅ Modern UI/UX
✅ Easy to use

## 🛠️ Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 📄 License

MIT License - feel free to use this project for learning and development!

## 👨‍💻 Author

Built with ❤️ for cricket enthusiasts

---

**SmartCrick Pro** - Your Ultimate Cricket Analytics & Training Platform
