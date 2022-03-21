import React, {lazy, Suspense} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {Box, CircularProgress} from '@mui/material';
import {BaseLayout} from 'shared/layouts';

const Home = lazy(() => import('pages/Home'));
const Product = lazy(() => import('pages/Product'));
const Sellers = lazy(() => import('pages/Sellers'));

export const PrivateRoutes: React.FC = () => {
  return (
    <BaseLayout>
      <Suspense
        fallback={
          <Box
            display="flex"
            width="100%"
            height="100%"
            justifyContent="center"
            alignContent="center">
            <CircularProgress />
          </Box>
        }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="produtos" element={<Product />} />
          <Route path="vendedores" element={<Sellers />} />

          <Route path="*" element={() => <Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BaseLayout>
  );
};
