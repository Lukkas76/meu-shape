// ============================================================
// FIREBASE BACKEND - EXPORTS
// ============================================================

// Config
export { app, auth, db, storage } from './src/config/firebase';

// Services
export { default as AuthService } from './src/services/AuthService';
export { default as UserService } from './src/services/UserService';
export { default as MeasurementService } from './src/services/MeasurementService';
export { default as StorageService } from './src/services/StorageService';

// Context & Hooks
export { AuthProvider, useAuth } from './src/contexts/AuthContext';
export { useMeasurements } from './src/hooks/useMeasurements';

// Types
export * from './src/types';
