---
description: Repository Information Overview
alwaysApply: true
---

# HRIS Frontend Information

## Summary
A React-based Human Resource Information System (HRIS) frontend application built with TypeScript and Vite. The project uses the Metronic UI framework and follows modern React patterns with React Router for navigation and React Query for data fetching.

## Structure
- **src/**: Source code containing React components and application logic
  - **_metronic/**: Metronic UI framework components and assets
  - **app/**: Main application components, modules, and pages
    - **modules/**: Feature modules including authentication
    - **pages/**: Page components
    - **routing/**: Routing configuration
- **public/**: Static assets including media files and splash screen
- **dist/**: Build output directory

## Language & Runtime
**Language**: TypeScript
**Version**: ES2020 target
**Build System**: Vite
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 19.1.0
- React Router 7.5.3
- React Query (@tanstack/react-query) 5.74.11
- Axios 1.9.0
- Bootstrap 5.3.5
- Formik 2.4.6
- Chart.js 4.4.9
- React Intl 7.1.11

**Development Dependencies**:
- TypeScript 5.8.3
- Vite 6.3.4
- ESLint 9.25.1
- SASS 1.77.6
- SWC (@vitejs/plugin-react-swc)

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
**Routing Configuration**: src/app/routing/AppRoutes.tsx

## Testing
The project includes Jest types (@types/jest) in development dependencies, but no test files or test configuration were found in the repository.