import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const getSeller = async (id: string) => {
  const seller = await admin.firestore().doc(`sellers/${id}`).get();

  return {id: seller.id, ...seller.data()};
};

const getProvider = async (id: string) => {
  const provider = await admin.firestore().doc(`providers/${id}`).get();

  return {id: provider.id, ...provider.data()};
};

export const getProducts = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    );
  }

  let products;

  const {seller} = data;

  if (!seller) {
    products = await admin.firestore().collection('products').get();
  } else {
    products = await admin
      .firestore()
      .collection('products')
      .where('seller', '==', seller)
      .get();
  }

  const productsData = await Promise.all(
    products.docs.map(async (doc) => {
      return {
        ...doc.data(),
        id: doc.id,
        saleValue: doc.data().saleValue,
        profitValue: doc.data().profitValue,
        quantity: doc.data().quantity,
        purchaseValue: doc.data().purchaseValue,
        seller: data.data().seller ? await getSeller(data.data().seller) : null,
        provider: await getProvider(data.data().provider),
      };
    }),
  );

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
