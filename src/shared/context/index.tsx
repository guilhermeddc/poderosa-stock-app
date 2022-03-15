import React, {useState} from 'react';

import {SplashScreen} from 'shared/components';

import {AuthProvider} from './Auth';
import {DrawerProvider} from './Drawer';
import {TitleProvider} from './Title';

export const AppProvider: React.FC = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <TitleProvider>
      {isLoading ? (
        <SplashScreen setIsLoading={setIsLoading} />
      ) : (
        <AuthProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </AuthProvider>
      )}
    </TitleProvider>
  );
};
