# StressBuster - Mental Health Support Application

A comprehensive React Native mobile application with backend API and admin dashboard for mental health support, featuring AI-guided chatbot, appointment booking, educational resources, and stress-relief games.

## 🌟 Features

### Mobile App (React Native)
- **AI-Guided Chatbot**: Emotional support with coping strategies and referrals
- **Appointment Booking**: Schedule sessions with professional counselors
- **Resource Hub**: Videos, PDFs, and audio content for psychoeducation
- **Stress-Buster Games**:
  - Breathing Exercise with guided animation
  - Tap to Relax interactive game
  - Memory Puzzle for mindfulness
- **User Profiles**: Personalized experience and session tracking
- **Emergency Helplines**: Quick access to crisis support

### Backend API (Node.js + Express)
- RESTful API with JWT authentication
- MySQL database with comprehensive schema
- Intent-based chatbot with keyword detection
- Appointment management system
- Resource categorization and filtering
- Game session analytics
- Admin endpoints for dashboard

### Admin Dashboard (React Web)
- Anonymous analytics overview
- Chatbot query trends and insights
- Appointment booking statistics
- Resource popularity tracking
- Game engagement metrics
- Interactive charts and visualizations

## 🏗️ Project Structure

```
StressBuster/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth, validation, error handling
│   ├── routes/             # API endpoints
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── services/       # API and storage services
│   │   └── constants/      # Colors and strings
│   └── App.js
├── admin-dashboard/        # React web dashboard
│   ├── src/
│   │   ├── App.js         # Main dashboard
│   │   └── App.css        # Styling
│   └── public/
├── database/               # MySQL schema and seeds
│   ├── schema.sql         # Database structure
│   └── seed.sql           # Dummy data
└── SETUP.md               # Setup instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- React Native CLI
- Android Studio / Xcode

### Installation

1. **Setup Database**
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

2. **Start Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Run Mobile App**
```bash
cd mobile
npm install
npm run android  # or npm run ios
```

4. **Launch Admin Dashboard**
```bash
cd admin-dashboard
npm install
npm start
```

## 📖 Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions and troubleshooting.

## 🔑 Default Credentials

**User Account:**
- Email: `john@example.com`
- Password: `Test@123`

**Admin Dashboard:**
- Email: `admin@stressbuster.com`
- Password: `Admin@123`

## 🛠️ Technology Stack

- **Mobile**: React Native, React Navigation, Axios
- **Backend**: Node.js, Express.js, MySQL2, JWT, Bcrypt
- **Admin**: React, Recharts, Axios
- **Database**: MySQL

## 📱 Screenshots

The app includes:
- Modern UI with calming color scheme
- Bottom tab navigation
- Interactive games with animations
- Real-time chat interface
- Counselor booking system
- Resource library with filtering

## 🤝 Contributing

This is a mental health support application. Contributions should focus on:
- User privacy and data security
- Accessibility features
- Multi-language support
- Evidence-based mental health practices

## 📄 License

MIT License - feel free to use this project for educational purposes.

## ⚠️ Disclaimer

This application provides general mental health information and support but is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions regarding mental health conditions.

## 🙏 Acknowledgments

Built with care for students, office workers, and everyone experiencing stress. Your mental health matters! 💚
