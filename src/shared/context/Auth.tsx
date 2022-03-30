import React, {createContext, useCallback, useEffect, useState} from 'react';

import {feedback} from 'shared/services/alertService';
import {authService} from 'shared/services/api/auth';
import {IUser} from 'shared/services/api/user';

export interface IAuthContext {
  authenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  user: IUser;
  signIn: () => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSeller, setIsSeller] = useState<boolean>(false);

  const handleSignIn = useCallback(async () => {
    try {
      const response = await authService.signIn();

      localStorage.setItem('@user', JSON.stringify(response));

      setUser(response);
      setIsAdmin(response.type.includes('k96XdK1e3zBOY5dimeE9'));
      setIsSeller(response.type.includes('8G5ap05MOUpfLg3OqrTl'));
    } catch (error) {
      feedback(String(error), 'error');
    }
  }, []);

  const handleSignOut = useCallback(() => {
    try {
      authService.signOut();

      localStorage.removeItem('@user');

      setUser({} as IUser);
    } catch (error) {
      feedback(String(error), 'error');
    }
  }, []);

  useEffect(() => {
    const userStorage = localStorage.getItem('@user');

    if (userStorage) {
      setUser(JSON.parse(userStorage) as IUser);
      setIsAdmin((JSON.parse(userStorage) as IUser).type.includes('admin'));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        authenticated:
          !!user.id &&
          (user.type.includes('admin') || user.type.includes('seller')),
        isAdmin: isAdmin || (isAdmin && isSeller),
        isSeller: !isAdmin && isSeller,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
