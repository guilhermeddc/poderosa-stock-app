import React, {createContext, useCallback, useEffect, useState} from 'react';

import {feedback} from 'shared/services/alertService';
import {authService} from 'shared/services/api/auth';
import {IUser} from 'shared/services/api/user';

export interface IAuthContext {
  authenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  user: IUser;
  signIn: (type: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSeller, setIsSeller] = useState<boolean>(false);

  const handleSignIn = useCallback(async (type: string) => {
    try {
      const response = await authService.signIn(type);

      localStorage.setItem('@user', JSON.stringify(response));

      if (response) {
        setUser(response);
        setIsAdmin(
          response.type.includes(String(process.env.REACT_APP_ADMIN_ID)),
        );
        setIsSeller(
          response.type.includes(String(process.env.REACT_APP_SELLER_ID)),
        );
      }
    } catch (error) {
      feedback(String(error), 'error');
    }
  }, []);

  const handleRefreshUser = useCallback(async () => {
    try {
      const response = await authService.getUser(user.id);

      localStorage.setItem('@user', JSON.stringify(response));

      setUser(response);
    } catch (error) {
      feedback(String(error), 'error');
    }
  }, [user.id]);

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
      setUser(JSON.parse(userStorage));
      setIsAdmin(JSON.parse(userStorage).type.includes('k96XdK1e3zBOY5dimeE9'));
      setIsSeller(
        JSON.parse(userStorage).type.includes('8G5ap05MOUpfLg3OqrTl'),
      );

      handleRefreshUser();
    }
  }, [handleRefreshUser, user.id]);

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signOut: handleSignOut,
        refreshUser: handleRefreshUser,
        authenticated: !!user.id,
        isAdmin: isAdmin || (isAdmin && isSeller),
        isSeller: !isAdmin && isSeller,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
