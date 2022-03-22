import React, {lazy, Suspense} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {LinearDeterminate} from 'shared/components';
import {BaseLayout} from 'shared/layouts';

const Home = lazy(() => import('pages/Home'));
const Product = lazy(() => import('pages/Product'));
const Sellers = lazy(() => import('pages/Sellers'));
const Providers = lazy(() => import('pages/Providers'));

export const PrivateRoutes: React.FC = () => {
  return (
    <BaseLayout>
      <Suspense fallback={<LinearDeterminate />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="produtos" element={<Product />} />
          <Route path="vendedores" element={<Sellers />} />
          <Route path="fornecedores" element={<Providers />} />

          <Route path="*" element={() => <Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BaseLayout>
  );
};
