# SarcasmDetector AI Frontend

## Overview
Modern web interface for the SarcasmDetector AI system, built with React + Vite. This frontend communicates with the Python backend to provide intelligent sarcasm detection in news headlines.

## 🚀 Live Demo
**Development Server**: `http://localhost:5175/`

## 📋 Project Structure
```
sarcasmdetector-frontend/
├── public/              # Static files
├── src/
│   ├── app/             # App setup, router, store, providers
│   ├── features/        # 13 feature modules
│   │   ├── auth/        # Login/Register
│   │   ├── dashboard/   # Main dashboard
│   │   ├── analysis/    # Single headline analysis
│   │   ├── batch-analysis/  # Batch CSV/XLSX
│   │   ├── history/      # Analysis history
│   │   ├── statistics/   # Charts and metrics
│   │   ├── datasets/     # Dataset management
│   │   ├── models/       # AI models
│   │   ├── training/     # Model training
│   │   ├── newssources/  # News sources
│   │   ├── profile/      # User profile
│   │   ├── settings/     # Application settings
│   │   └── admin/        # Admin panel
│   ├── components/      # Reusable components
│   │   ├── layout/      # Header, Sidebar, MainLayout
│   │   └── common/      # Loader, ErrorMessage, etc.
│   ├── hooks/           # Custom hooks (useAuth)
│   ├── services/        # API services
│   ├── utils/           # Utilities
│   ├── theme/           # MUI theme config
│   ├── i18n/            # Localization
│   ├── charts/          # Chart components
│   └── tables/          # Table components
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## 🛠️ Technologies Used
- **React 18** + **Vite 8** - Fast development build
- **Redux Toolkit 2** + **RTK Query** - State management and API
- **Material-UI (MUI) v5** - UI components with custom themes
- **React Router DOM 7** - Navigation and routing
- **Axios** - HTTP requests with interceptors
- **Recharts** - Data visualization charts
- **React Hook Form + Yup** - Form handling and validation
- **i18next** - Ready for Ukrainian/English localization

## 📦 Available Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend running at `http://localhost:8000` (SarcasmDetector AI Backend)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5175/ in your browser
```

### Backend Integration
Ensure the backend is running:
```bash
# From the backend directory
cd D:\project\sarcasmdetector-backend
# Start the backend server
```

The frontend will automatically connect to the backend API endpoints.

## 📱 Features Implemented

### Authentication
- User login and registration
- Protected routes
- Role-based access control
- Session management

### Core Features
- **Dashboard** - Statistics cards, model status
- **Analysis** - Headline input + AI classification + AI explanation
- **History** - Analysis records with filters and search
- **Statistics** - Distribution charts, key metrics
- **Datasets** - Import CSV/XLSX, manage datasets
- **Models** - AI model registry, activation, metrics
- **Training** - Model training with hyperparameters
- **NewsSources** - RSS/URL ingestion and sync
- **Profile** - User account management
- **Settings** - Theme, language, confidence thresholds

### UI Components
- 15+ reusable components
- Light and dark theme support
- Responsive design
- Accessibility fundamentals

## 🌐 API Integration
The frontend connects to the backend via these base endpoints:
- `http://localhost:8000/api/auth/` - Authentication
- `http://localhost:8000/api/analysis/` - Analysis operations
- `http://localhost:8000/api/batch/` - Batch processing
- `http://localhost:8000/api/statistics/` - Statistics data
- `http://localhost:8000/api/datasets/` - Dataset management
- `http://localhost:8000/api/models/` - Model management
- `http://localhost:8000/api/training/` - Training operations
- `http://localhost:8000/api/sources/` - News sources

## 🛠️ Development

### Project Structure
The project uses **feature-based architecture**:
- Each feature has its own folder with components, API services, and state management
- Redux Toolkit slices for global state
- RTK Query endpoints for server data fetching

### Adding New Features
1. Create feature directory under `src/features/`
2. Add relevant API service to `src/services/`
3. Create Redux slice if needed
4. Implement page component
5 - Add route in `src/app/router.jsx`

## 🎯 Roadmap
- [x] Core authentication system
- [x] Dashboard with statistics
- [x] Single headline analysis
- [x] History and statistics
- [x] Dataset management
- [x] AI model management
- [x] Model training interface
- [x] News sources integration
- [x] User profile and settings
- [x] Admin panel structure
- [ ] Backend full integration
- [ ] Unit tests (Vitest + RTL)
- [ ] E2E tests (Playwright)
- [ ] Performance optimization
- [ ] PWA support

## 📄 License
This project is part of the SarcasmDetector AI system. See the backend repository for license information.

## 👥 Authors
Developed as part of the SarcasmDetector AI project.

---
**For support or questions, please refer to the backend repository or contact the development team.**