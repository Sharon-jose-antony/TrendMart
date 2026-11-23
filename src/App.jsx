import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';

import MainLayout from './components/layout/MainLayout';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Screen */}
                <Route path="/login" element={<Login />} />

                {/* Authenticated Admin Management Layout */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/settings" replace />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/settings" replace />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;