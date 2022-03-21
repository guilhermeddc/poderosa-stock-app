import React, {createContext, useCallback, useEffect, useState} from 'react';

import {User, onAuthStateChanged} from 'firebase/auth';
import {feedback} from 'shared/services/alertService';
import {authService} from 'shared/services/api/auth';
import {auth} from 'shared/services/firebase';

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
    onAuthStateChanged(auth, (user) => {
      setUser(user as User);
    });
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
