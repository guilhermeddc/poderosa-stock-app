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

export const createProduct = https.onCall((data: ICreateProduct, context) => {
  if (!context.auth) {
    throw new https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    );
  }

  const product = {
    code: data.code,
    description: data.description,
    quantity: 1,
    purchaseValue: data.purchaseValue,
    saleValue: data.saleValue,
    profitValue: data.profitValue,
    size: data.size,
    seller: data.seller,
    provider: data.provider,
    sold: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  if (data.quantity === 1) {
    firestore().collection('products').add(product);
  } else {
    for (let index = 0; index < data.quantity; index++) {
      firestore().collection('products').add(product);
    }
  }

  return {success: true};
});
