import React, {lazy, Suspense} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {LinearDeterminate} from 'shared/components';
import {BaseLayout} from 'shared/layouts';

const Home = lazy(() => import('pages/Home'));
const Product = lazy(() => import('pages/Product'));
const Sellers = lazy(() => import('pages/Sellers'));
const SellerDetail = lazy(() => import('pages/Sellers/Detail'));
const Providers = lazy(() => import('pages/Providers'));
const Users = lazy(() => import('pages/Users'));
const Purchases = lazy(() => import('pages/Purchases'));
const PurchaseNew = lazy(() => import('pages/Purchases/New'));
const PurchaseDetail = lazy(() => import('pages/Purchases/Detail'));

export const PrivateRoutes: React.FC = () => {
  return (
    <BaseLayout>
      <Suspense fallback={<LinearDeterminate />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="produtos" element={<Product />} />
          <Route path="vendedores" element={<Sellers />} />
          <Route path="vendedores/:id" element={<SellerDetail />} />
          <Route path="fornecedores" element={<Providers />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="compras" element={<Purchases />} />
          <Route path="compras/nova" element={<PurchaseNew />} />
          <Route path="compras/detalhe/:id" element={<PurchaseDetail />} />

          <Route path="*" element={() => <Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BaseLayout>
  );
};
