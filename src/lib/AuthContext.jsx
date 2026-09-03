import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const MOCK_USER = {
  id: 'usr-dev-01',
  email: 'alicia@dimetrix.io',
  full_name: 'Alicia Bactasa',
  role: 'admin',
  department: 'Community Outage Tracker',
  verified: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dimetrix_user');
      if (saved) return { ...MOCK_USER, ...JSON.parse(saved) };
    } catch (e) {}
    return MOCK_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const checkAppState = async () => {};
  const checkUserAuth = async () => {};

  const updateUser = (data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('dimetrix_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const login = async (email, password) => {
    const newUser = {
      ...user,
      id: 'usr-' + Date.now(),
      email: email || 'user@dimetrix.io',
      full_name: email ? email.split('@')[0] : 'Alicia Bactasa',
      role: 'admin'
    };
    setUser(newUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('dimetrix_user', JSON.stringify(newUser));
    } catch (e) {}
    return newUser;
  };

  const loginWithGoogle = async () => {
    const newUser = {
      ...user,
      id: 'usr-google-' + Date.now(),
      email: 'alicia.google@dimetrix.io',
      full_name: 'Alicia Bactasa (Google)',
      role: 'admin'
    };
    setUser(newUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('dimetrix_user', JSON.stringify(newUser));
    } catch (e) {}
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('dimetrix_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {};

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: true, 
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings,
      authChecked: true,
      updateUser,
      login,
      loginWithGoogle,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
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
