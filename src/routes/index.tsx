import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import {useAuth} from 'shared/hooks';

import {PrivateRoutes} from './private.routes';
import {PublicRoutes} from './public.routes';

export const Routes: React.FC = () => {
  const {authenticated, isAdmin, isSeller} = useAuth();

  const Routes =
    authenticated && (isAdmin || isSeller) ? PrivateRoutes : PublicRoutes;

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};
