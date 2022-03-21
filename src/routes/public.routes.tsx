import React, {lazy, Suspense, useEffect} from 'react';
import {Routes, Route, useLocation, useNavigate} from 'react-router-dom';

import {Box, CircularProgress} from '@mui/material';

const Login = lazy(() => import('pages/Login'));

export const PublicRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/') navigate('/');
  }, [location.pathname, navigate]);

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
      </Routes>
    </Suspense>
  );
};
