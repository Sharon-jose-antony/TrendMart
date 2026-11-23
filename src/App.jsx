import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';

import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ModulePlaceholder from './components/common/ModulePlaceholder';

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

                {/* Authenticated Dashboard Admin Shell */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route
                    path="categories"
                    element={
                      <ModulePlaceholder
                        moduleName="Categories Taxonomy"
                        branchName="feat/module-2-categories"
                      />
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <ModulePlaceholder
                        moduleName="Products Catalog"
                        branchName="feat/module-3-products"
                      />
                    }
                  />
                  <Route
                    path="customers"
                    element={
                      <ModulePlaceholder
                        moduleName="Customer Directory"
                        branchName="feat/module-4-5-customers-orders"
                      />
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <ModulePlaceholder
                        moduleName="Orders Management"
                        branchName="feat/module-4-5-customers-orders"
                      />
                    }
                  />
                  <Route
                    path="banners"
                    element={
                      <ModulePlaceholder
                        moduleName="Promotional Banners"
                        branchName="feat/module-6-7-banners-profile"
                      />
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ModulePlaceholder
                        moduleName="Administrator Profile"
                        branchName="feat/module-6-7-banners-profile"
                      />
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ModulePlaceholder
                        moduleName="Settings & Theme"
                        branchName="feat/module-8-settings"
                      />
                    }
                  />
                </Route>

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
