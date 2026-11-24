import React, { createContext, useContext, useState, useEffect } from 'react';

const SarcasmDetectorContext = createContext(null);

export function SarcasmDetectorProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Перевіряємо авторизацію з localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Можна додати перевірку токена через API
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SarcasmDetectorContext.Provider value={{ isSidebarOpen, toggleSidebar, theme, setTheme, isAuthenticated }}>
      {children}
    </SarcasmDetectorContext.Provider>
  );
}

export const useSarcasmDetector = () => {
  const context = useContext(SarcasmDetectorContext);
  if (!context) {
    throw new Error('useSarcasmDetector must be used within SarcasmDetectorProvider');
  }
  return context;
};