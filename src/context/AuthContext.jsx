import React, { createContext, useContext, useState } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { DEFAULT_USER } from '../utils/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if auth session exists
    const storedAuth = getStorageItem(STORAGE_KEYS.AUTH, null);
    if (storedAuth && storedAuth.isAuthenticated) {
      return storedAuth.user || DEFAULT_USER;
    }
    // Default to authenticated demo admin initially so user lands immediately in the rich dashboard
    const initialSession = {
      isAuthenticated: true,
      user: DEFAULT_USER,
    };
    setStorageItem(STORAGE_KEYS.AUTH, initialSession);
    return DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = getStorageItem(STORAGE_KEYS.AUTH, null);
    return storedAuth ? Boolean(storedAuth.isAuthenticated) : true;
  });

  const login = (email, password) => {
    // Demo admin check or fallback login
    const authenticatedUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    };
    const session = {
      isAuthenticated: true,
      user: authenticatedUser,
      timestamp: new Date().toISOString(),
    };
    setStorageItem(STORAGE_KEYS.AUTH, session);
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    // Only remove auth session, keep all business data (products, orders, customers, theme) intact!
    removeStorageItem(STORAGE_KEYS.AUTH);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      const session = getStorageItem(STORAGE_KEYS.AUTH, { isAuthenticated: true });
      session.user = nextUser;
      setStorageItem(STORAGE_KEYS.AUTH, session);
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
