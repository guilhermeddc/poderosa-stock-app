import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import {BaseLayout} from 'shared/layouts';

import {PrivateRoutes} from './private.routes';

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <BaseLayout>
        <PrivateRoutes />
      </BaseLayout>
    </BrowserRouter>
  );
};
