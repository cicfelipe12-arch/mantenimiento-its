import { createContext, useContext, useEffect, useState } from 'react';

import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await authService.getToken();

        if (token) {
          setUserToken(token);
        }
      } catch (error) {
        console.warn('No se pudo restaurar la sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUserToken(data.accessToken);
  };

  const logout = async () => {
    await authService.removeToken();
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);