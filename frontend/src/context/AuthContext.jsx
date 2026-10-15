import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await authService.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem('staymate_token');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Continue client logout
    } finally {
      setUser(null);
      localStorage.removeItem('staymate_token');
    }
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
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
