import {config, https} from 'firebase-functions';
import {firestore, initializeApp} from 'firebase-admin';

initializeApp(config().firebase);

export interface ICreateProduct {
  code: string;
  description: string;
  quantity: number;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
  size: string;
  seller: string;
  provider: string;
  sold: boolean;
}

export const getSellerProductData = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    );
  }

  const seller = data.seller;
  const products = await firestore()
    .collection('products')
    .where('seller', '==', seller)
    .get();

  const productsData = products.docs.map((doc) => doc.data());

  let totalSaleValue = 0;
  let totalProfitValue = 0;
  let totalQuantity = 0;
  let totalPurchaseValue = 0;

  productsData.forEach((product) => {
    totalSaleValue += product.saleValue;
    totalProfitValue += product.profitValue;
    totalQuantity += Number(product.quantity);
    totalPurchaseValue += product.purchaseValue;
  });

  return {
    products: productsData,
    totalSaleValue,
    totalProfitValue,
    totalQuantity,
    totalPurchaseValue,
  };
});
