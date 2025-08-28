---
description: Repository Information Overview
alwaysApply: true
---

# HRIS Frontend Information

## Summary
A React-based Human Resource Information System (HRIS) frontend application built with TypeScript and Vite. The project uses the Metronic UI framework and follows modern React patterns with React Router for navigation and React Query for data fetching. The application includes both employee and admin interfaces with role-based access control.

## Structure
- **src/**: Source code containing React components and application logic
  - **_metronic/**: Metronic UI framework components, assets, and layout
  - **app/**: Main application components, modules, and pages
    - **modules/**: Feature modules including authentication and user management
    - **pages/**: Page components including dashboard and account
    - **routes/**: Routing configuration with role-based access control
    - **services/**: API services and HTTP configuration
- **public/**: Static assets including media files and splash screen
- **dist/**: Build output directory

## Language & Runtime
**Language**: TypeScript 5.8.3
**Version**: ES2020 target
**Build System**: Vite 6.3.4
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 19.1.0 with React DOM
- React Router 7.5.3
- React Query (@tanstack/react-query) 5.74.11
- Axios 1.9.0
- Bootstrap 5.3.5 with React Bootstrap 2.10.9
- Formik 2.4.6 with Yup 1.6.1
- Chart.js 4.4.9 with ApexCharts 4.7.0
- React Intl 7.1.11
- Firebase 12.1.0 for messaging and analytics

**Development Dependencies**:
- TypeScript 5.8.3
- Vite 6.3.4 with SWC plugin
- ESLint 9.25.1
- SASS 1.77.6
- Webpack 5.99.7 for additional build tools

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Main Entry Points
**Application Entry**: src/main.tsx
**Main Component**: src/app/App.tsx
**Routing Configuration**: 
- src/app/routes/AppRoutes.tsx (Main routes)
- src/app/routes/PrivateRoutes.tsx (Authenticated routes with role control)

## Authentication & Authorization
**Auth Module**: src/app/modules/auth/
**Login Flow**: Uses context-based authentication with JWT
**Role-Based Access**: 
- Admin users: Access to dashboard and employee management
- Regular users: Access to account pages only
- Role verification through RoleRoute component

## User Management
**Admin Interface**: src/app/modules/apps/user-management/
**Employee List**: Table-based interface with filtering and pagination
**User Editing**: Modal-based form for creating and editing employee records

## Firebase Integration
**Configuration**: firebase.ts in root directory
**Features**: 
- Firebase Messaging for notifications
- Analytics for user tracking
- Admin-specific topic subscriptions