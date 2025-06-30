# 🎓 MUST E-Portal

> **Malawi University of Science and Technology - Electronic Portal System**

A modern web application for university application management, built with React TypeScript frontend and Laravel PHP backend.

---

## 📁 Project Structure

```
must-e-portal/
├── 🖥️  backend/                 # Laravel API (PHP + MySQL)
│   ├── app/                     # Application logic
│   ├── database/                # Migrations & seeders
│   ├── routes/                  # API routes
│   └── artisan                  # Laravel CLI tool
│
├── 🌐  frontend/                # React TypeScript App
│   ├── src/                     # Source code
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   └── services/            # API services
│   ├── public/                  # Static assets
│   └── package.json             # Dependencies
│
├── 📚  docs/                    # Documentation & Research
│   ├── Research/                # Project research materials
│   └── PROJECT_STRUCTURE.md     # Legacy structure docs
│
├── 🔧  scripts/                 # Development Scripts
│   ├── migration-checklist.ps1 # Laravel setup verification
│   └── test-api.ps1             # API testing script
│
├── ⚙️   config/                 # Configuration Files
│   └── docs/                   # Project documentation
│
└── 📄  README.md                # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **PHP 8.2+** with XAMPP
- **Node.js 16+** 
- **MySQL** database
- **Composer** (PHP package manager)

### 🖥️ Backend Setup (Laravel)
```powershell
# Navigate to backend directory
cd backend

# Install dependencies
C:\xampp\php\php.exe C:\xampp\php\composer.phar install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
C:\xampp\php\php.exe artisan migrate

# Seed database
C:\xampp\php\php.exe artisan db:seed

# Start Laravel server
C:\xampp\php\php.exe artisan serve --host=0.0.0.0 --port=8000
```

### 🌐 Frontend Setup (React)
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

---

## 🛠️ Development Commands

### Backend (Laravel)
```powershell
# From backend/ directory
C:\xampp\php\php.exe artisan serve              # Start server
C:\xampp\php\php.exe artisan migrate           # Run migrations
C:\xampp\php\php.exe artisan migrate:rollback  # Rollback migrations
C:\xampp\php\php.exe artisan db:seed          # Seed database
C:\xampp\php\php.exe artisan route:list       # List all routes
```

### Frontend (React)
```powershell
# From frontend/ directory
npm start        # Start development server (localhost:3000)
npm run build    # Build for production
npm test         # Run tests
```

### 🔧 Utility Scripts
```powershell
# From project root
.\scripts\migration-checklist.ps1    # Verify Laravel setup
.\scripts\test-api.ps1               # Test API endpoints
```

---

## 🏗️ Architecture

### Backend (Laravel + MySQL)
- **Framework**: Laravel 10.x
- **Database**: MySQL
- **Authentication**: Laravel Passport (OAuth2)
- **Authorization**: Spatie Laravel Permission
- **Social Login**: Laravel Socialite (Google, Facebook)

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router
- **State Management**: Context API
- **Styling**: CSS Modules + Custom CSS
- **Build Tool**: Create React App

---

## 📊 Key Features

- ✅ **Multi-step Application Form**
- ✅ **User Authentication & Authorization**
- ✅ **Social Login (Google, Facebook)**
- ✅ **Admin Dashboard**
- ✅ **Application Management**
- ✅ **Role-based Access Control**
- ✅ **Responsive Design**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/user` | Get authenticated user |
| POST | `/api/applications` | Submit application |
| GET | `/api/applications` | Get user applications |

---

## 📱 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api

---

## 🔄 Development Workflow

1. **Start Backend**: `cd backend && C:\xampp\php\php.exe artisan serve`
2. **Start Frontend**: `cd frontend && npm start`
3. **Make Changes**: Edit files in respective directories
4. **Test Changes**: Use utility scripts or manual testing
5. **Commit**: Regular git commits with descriptive messages

---

## 📝 Important Notes

- **PowerShell Commands**: Use `;` instead of `&&` for command chaining
- **File Paths**: Always use the correct directory paths for Laravel commands
- **Database**: Ensure MySQL is running before starting Laravel
- **Environment**: Update `.env` files for both frontend and backend configurations

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

For technical support or questions:
- **Institution**: Malawi University of Science and Technology
- **Project**: MUST E-Portal Application System

---

*Last Updated: December 2024* 