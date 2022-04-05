import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {IRequestResult} from 'shared/interfaces';

import {productDB, purchaseDB, purchaseTypeDB} from '../firebase';
import {IProduct} from './product';
import {providerService} from './provider';

export interface IPurchase {
  id: string;
  name: string;
  quantity: number;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
  type: string;
}

const getPurchases = async (): Promise<IPurchase[]> => {
  try {
    const purchaseSnapshot = await getDocs(
      query(purchaseDB, where('name', '!=', '')),
    );
    const purchaseList = await Promise.all(
      purchaseSnapshot.docs.map(async (doc) => {
        return {
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          purchaseValue: doc.data().purchaseValue,
          saleValue: doc.data().saleValue,
          profitValue: doc.data().profitValue,
          type: (await getPurchaseType(doc.data().type)).name,
        };
      }),
    );

    return purchaseList;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getPurchase = async (id: string): Promise<IPurchase> => {
  try {
    const purchase = await getDoc(doc(purchaseDB, id));

    return {id: purchase.id, ...purchase.data()} as IPurchase;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export interface IPurchaseType {
  id: string;
  name: string;
}

const getPurchaseTypes = async (): Promise<IPurchaseType[]> => {
  try {
    const purchaseTypeSnapshot = await getDocs(purchaseTypeDB);
    const purchaseTypeList = purchaseTypeSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
      };
    });

    return purchaseTypeList;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getPurchaseType = async (id: string): Promise<IPurchaseType> => {
  try {
    const purchaseType = await getDoc(doc(purchaseTypeDB, id));

    return {id: purchaseType.id, ...purchaseType.data()} as IPurchase;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export interface IListProduct {
  products: IProduct[];
  totalSaleValue: number;
  totalProfitValue: number;
  totalPurchaseValue: number;
  totalQuantity: number;
}

export interface ICreatePurchase {
  name: string;
  type: string;
  quantity: number;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
}

const createPurchase = async (): Promise<string> => {
  try {
    const purchaseExists = await getDocs(
      query(purchaseDB, where('name', '==', '')),
    );

    if (purchaseExists.docs.length > 0) {
      return purchaseExists.docs[0].id as string;
    }

    const res = await addDoc(purchaseDB, {
      name: '',
      profitValue: 0,
      quantity: 0,
      purchaseValue: 0,
      saleValue: 0,
      type: '',
    });

    return res.id;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const updatePurchase = async (
  id: string,
  payload: ICreatePurchase,
): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(purchaseDB, id), {...payload});

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const deletePurchase = async (
  id: string,
  productsIds: string[] | undefined,
): Promise<IRequestResult> => {
  try {
    await deleteDoc(doc(purchaseDB, id));

    if (productsIds) {
      await Promise.all(
        productsIds.map(async (productId) => {
          await deleteDoc(doc(productDB, productId));
        }),
      );
    }

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getPurchaseProducts = async (purchase: string): Promise<IListProduct> => {
  try {
    const productSnapshot = await getDocs(
      query(productDB, where('purchase', '==', purchase)),
    );
    const products = await Promise.all(
      productSnapshot.docs.map(async (data) => {
        return {
          ...data.data(),
          id: data.id,
          provider: await providerService.getProvider(data.data().provider),
        };
      }) as Promise<IProduct>[],
    );

    let totalSaleValue = 0;
    let totalProfitValue = 0;
    let totalQuantity = 0;
    let totalPurchaseValue = 0;

    products.forEach((product) => {
      totalSaleValue += product.saleValue;
      totalProfitValue += product.profitValue;
      totalQuantity += Number(product.quantity);
      totalPurchaseValue += product.purchaseValue;
    });

    return {
      products,
      totalSaleValue,
      totalProfitValue,
      totalQuantity,
      totalPurchaseValue,
    };
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const purchaseService = {
  getPurchases,
  getPurchase,
  getPurchaseTypes,
  getPurchaseType,
  createPurchase,
  deletePurchase,
  updatePurchase,
  getPurchaseProducts,
};
