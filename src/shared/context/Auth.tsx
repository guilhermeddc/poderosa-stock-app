import React, {createContext, useCallback, useEffect, useState} from 'react';

import {User} from 'firebase/auth';
import {feedback} from 'shared/services/alertService';
import {authService} from 'shared/services/api/auth';

export interface IAuthContext {
  authenticated: boolean;
  isAdmin: boolean;
  user: User;
  signIn: () => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<User>({} as User);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleSignIn = useCallback(async () => {
    try {
      const response = await authService.signIn();

      localStorage.setItem('@user', JSON.stringify(response.user));
      localStorage.setItem('@admin', JSON.stringify(response.admin));

      setUser(response.user);
      setIsAdmin(response.admin);
    } catch (error) {
      feedback(String(error), 'error');
    }
  }, []);

  const handleSignOut = useCallback(() => {
    try {
      authService.signOut();

      setUser({} as User);
    } catch (error) {
      feedback(String(error), 'error');
    }
  }, []);

  useEffect(() => {
    const userStorage = localStorage.getItem('@user');
    const adminStorage = localStorage.getItem('@admin');

    userStorage && setUser(JSON.parse(userStorage) as User);
    adminStorage && setIsAdmin(!!JSON.parse(adminStorage));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        authenticated: !!user.uid,
        isAdmin,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
