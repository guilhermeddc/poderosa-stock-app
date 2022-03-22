import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@firebase/firestore/lite';
import {IRequestResult} from 'shared/interfaces';
import {productDB} from 'shared/services/firebase';

import {IProvider, providerService} from './provider';
import {ISeller, sellerService} from './seller';

export interface IProduct {
  id: string;
  code: string;
  description: string;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
  size: string;
  seller: ISeller;
  provider: IProvider;
  sold: boolean;
  travel: string;
}

export interface ICreateProduct {
  code: string;
  description: string;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
  size: string;
  seller: string;
  provider: string;
  sold: boolean;
}

const getProducts = async (): Promise<IProduct[]> => {
  try {
    const productSnapshot = await getDocs(productDB);
    const productList = await Promise.all(
      productSnapshot.docs.map(async (data) => {
        return {
          id: data.id,
          code: data.data().code,
          description: data.data().description,
          purchaseValue: data.data().purchaseValue,
          saleValue: data.data().saleValue,
          profitValue: data.data().profitValue,
          size: data.data().size,
          seller: await sellerService.getSeller(data.data().seller),
          provider: await providerService.getProvider(data.data().provider),
          sold: data.data().sold,
          travel: data.data().travel,
        };
      }),
    );

    return productList;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getProduct = async (id: string): Promise<IProduct> => {
  try {
    const product = await getDoc(doc(productDB, id));

    return {id: product.id, ...product.data()} as IProduct;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const createProduct = async (
  payload: ICreateProduct,
): Promise<IRequestResult> => {
  try {
    const codExists = await getDocs(
      query(productDB, where('cod', '==', payload.code)),
    );

    if (codExists.docs.map((doc) => doc.data()).length > 0) {
      throw new Error('Código já utilizado');
    }

    await addDoc(productDB, {
      ...payload,
      sold: false,
      purchaseValue: Number(payload.purchaseValue),
      saleValue: Number(payload.saleValue),
    });

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const updateProduct = async (
  id: string,
  payload: Omit<IProduct, 'id'>,
): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(productDB, id), payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const deleteProduct = async (id: string): Promise<IRequestResult> => {
  try {
    await deleteDoc(doc(productDB, id));

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const productService = {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
