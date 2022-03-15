import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import {useAuth} from 'shared/hooks';

import {PrivateRoutes} from './private.routes';
import {PublicRoutes} from './public.routes';

export const Routes: React.FC = () => {
  const {authenticated} = useAuth();

  const Routes = authenticated ? PrivateRoutes : PublicRoutes;

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};
