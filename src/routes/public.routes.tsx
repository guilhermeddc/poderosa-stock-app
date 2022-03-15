import React, {lazy, Suspense} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {Box, CircularProgress} from '@mui/material';

const Login = lazy(() => import('pages/Login'));

export const PublicRoutes: React.FC = () => {
  return (
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
        <Route path="/" element={<Login />} />

        <Route path="*" element={() => <Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};
