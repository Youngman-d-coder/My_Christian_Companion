# My Christian Companion 🙏✝️

[![CI/CD Pipeline](https://github.com/Youngman-d-coder/My_Christian_Companion/actions/workflows/ci.yml/badge.svg)](https://github.com/Youngman-d-coder/My_Christian_Companion/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

A comprehensive Progressive Web App (PWA) for Christian spiritual growth, featuring Bible reading, prayer resources, and daily reminders across all major Christian denominations.

**Production-ready with enterprise-grade security, testing, and documentation.**

## ✨ Features

### 📖 Bible Reader
- **Multiple Translations**: Access KJV, NIV, ESV, NKJV, NLT, NASB, and more
- **Bookmark Verses**: Save your favorite passages for quick access
- **Reading History**: Track your Bible reading progress
- **Offline Access**: Read the Bible without internet connection
- **Easy Navigation**: Browse Old and New Testament books with chapter navigation

### 🙏 Prayer Library
- **Multi-Denominational**: Catholic, Protestant, Orthodox, and Anglican prayers
- **Catholic Prayers**: Complete Rosary guide, Angelus, Divine Mercy Chaplet
- **Protestant Prayers**: Lord's Prayer, Morning/Evening prayers, Grace
- **Orthodox Prayers**: Trisagion, Jesus Prayer, morning prayers
- **Common Prayers**: Serenity Prayer and other universal Christian prayers

### ⏰ Prayer Reminders
- **Smart Notifications**: Never miss your daily prayers
- **Customizable Schedule**: Set specific times and days
- **Prayer Types**: Morning, Evening, Rosary, Angelus, Divine Mercy, Custom
- **Enable/Disable**: Easily manage your active reminders

### 👤 User Profile
- **Cloud Sync**: Your data synced across all devices
- **Preferences**: Customize theme, Bible translation, and notifications
- **Bookmarks Management**: View and manage your saved verses
- **Reading History**: Track your spiritual journey

### 📱 Progressive Web App
- **Install on Any Device**: Works on iOS, Android, Windows, and Web
- **Offline Functionality**: Full features without internet
- **Fast & Responsive**: Optimized performance
- **Cross-Platform**: One app for all your devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (optional, for user data persistence)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Youngman-d-coder/My_Christian_Companion.git
   cd My_Christian_Companion
   ```

2. **Install dependencies**
   
   Backend:
   ```bash
   cd server
   npm install
   ```
   
   Frontend:
   ```bash
   cd client
   npm install
   ```

3. **Configure environment variables**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/christian-companion
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the development servers**
   
   Backend (from `server` directory):
   ```bash
   npm run dev
   ```
   
   Frontend (from `client` directory):
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Build

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd server
   npm start
   ```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **Axios** - HTTP client
- **Vite PWA Plugin** - Progressive Web App features
- **Workbox** - Service worker & offline caching

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## 📁 Project Structure

```
My_Christian_Companion/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── vite.config.ts     # Vite & PWA configuration
│
└── server/                # Backend API
    ├── src/
    │   ├── models/        # MongoDB models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Express middleware
    │   └── index.js       # Server entry point
    └── package.json

```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for secure authentication:
- Register with email, password, name, and denomination
- Login to access personalized features
- Secure password hashing with bcrypt
- Token-based session management

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/preferences` - Update preferences
- `POST /api/user/bookmarks` - Add bookmark
- `DELETE /api/user/bookmarks/:id` - Remove bookmark
- `POST /api/user/history` - Add reading history

### Prayers
- `GET /api/prayers` - Get all prayers
- `GET /api/prayers/:denomination` - Get denomination-specific prayers

### Bible
- `GET /api/bible/translations` - List available translations
- `GET /api/bible/books` - List Bible books
- `GET /api/bible/:translation/:book/:chapter` - Get chapter content

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

## 🎨 Customization

### Themes
Currently supports light mode with auto-theme detection. Theme preferences can be set in the user profile.

### Denominations
The app supports:
- Catholic ✝️
- Protestant ✝️
- Orthodox ☦️
- Anglican ✝️
- Other

## 📱 Installing as PWA

### On Mobile (iOS/Android)
1. Open the app in your browser
2. Tap the "Share" or menu button
3. Select "Add to Home Screen"
4. The app will install like a native app

### On Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Confirm installation

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of conduct
- Development workflow
- Code standards
- Testing requirements
- Pull request process

## 🔒 Security

Security is a top priority. This application includes:
- ✅ JWT authentication with required secrets
- ✅ Rate limiting (100 req/15min general, 5 req/15min auth)
- ✅ Input validation on all API endpoints
- ✅ CORS protection with origin whitelisting
- ✅ Password requirements (8+ chars, mixed case, numbers)
- ✅ Secure error handling with Winston logging
- ✅ Database indexes for performance
- ✅ Compression middleware

**For security issues, see [SECURITY.md](SECURITY.md)**

## 📚 Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to Heroku, Vercel, Railway, Docker, DigitalOcean
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](SECURITY.md)** - Security measures and vulnerability reporting

## 🧪 Testing

### Server Tests (Jest)
```bash
cd server
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

### Client Tests (Vitest)
```bash
cd client
npm test                 # Run tests
npm run test:ui          # UI mode
npm run test:coverage    # Coverage report
```

**Current Coverage:**
- Server: Unit tests for middleware and models (12 tests)
- Client: Vitest configured and ready

## 🚀 CI/CD

Automated workflows for:
- ✅ Linting and code quality checks
- ✅ Automated testing
- ✅ Build validation
- ✅ Security scanning (Trivy)
- ✅ Dependency vulnerability checks

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Bible content from public domain sources
- Prayer texts from traditional Christian sources
- Built with love for the Christian community

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with faith and love** ✝️ **for the global Christian community**
