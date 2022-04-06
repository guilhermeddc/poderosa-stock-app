import React, {lazy, Suspense} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {LinearDeterminate} from 'shared/components';
import {BaseLayout} from 'shared/layouts';

const Home = lazy(() => import('pages/private/Home'));
const Product = lazy(() => import('pages/private/Product'));
const Sellers = lazy(() => import('pages/private/Sellers'));
const SellerDetail = lazy(() => import('pages/private/Sellers/Detail'));
const Providers = lazy(() => import('pages/private/Providers'));
const Users = lazy(() => import('pages/private/Users'));
const Purchases = lazy(() => import('pages/private/Purchases'));
const PurchaseDetail = lazy(() => import('pages/private/Purchases/Detail'));
const Shoppings = lazy(() => import('pages/private/Shoppings'));

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
          <Route path="compras/nova" element={<PurchaseDetail />} />
          <Route path="compras/editar/:id" element={<PurchaseDetail />} />
          <Route path="shopping" element={<Shoppings />} />

          <Route path="*" element={() => <Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BaseLayout>
  );
};
