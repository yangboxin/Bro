import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const initializeUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    initializeUser();

    const handleStorageChange = () => {
      initializeUser();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    initializeUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Add inside useEffect in AuthProvider

    useEffect(() => {
        if (user) {
        const expirationTime = user.exp * 1000 - Date.now();
        const timer = setTimeout(() => {
            logout();
            alert('Session expired. Please log in again.');
        }, expirationTime);
        return () => clearTimeout(timer);
        }
    }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
