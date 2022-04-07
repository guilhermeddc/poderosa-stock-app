import React, {lazy, Suspense, useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

import {LinearDeterminate} from 'shared/components';
import {useAuth} from 'shared/hooks';
import {PublicLayout} from 'shared/layouts';

const Login = lazy(() => import('pages/public/Login'));
const Home = lazy(() => import('pages/public/Home'));

export const PublicRoutes: React.FC = () => {
  const navigate = useNavigate();
  const {authenticated} = useAuth();

  useEffect(() => {
    if (authenticated) navigate('/');
    else navigate('/login');
  }, [authenticated, navigate]);

  return (
    <PublicLayout>
      <Suspense fallback={<LinearDeterminate />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </PublicLayout>
  );
};
