import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

export const getSellerProductData = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.',
      );
    }

    const seller = data.seller;
    const products = await admin
      .firestore()
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
  },
);
