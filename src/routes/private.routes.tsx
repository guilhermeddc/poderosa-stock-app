import React, {lazy, Suspense} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {Box, CircularProgress} from '@mui/material';
import {BaseLayout} from 'shared/layouts';

const HomeLazy = lazy(() => import('pages/Home'));

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
          <Route path="/" element={<HomeLazy />} />

          <Route path="*" element={() => <Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BaseLayout>
  );
};
