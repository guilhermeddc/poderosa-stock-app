import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@firebase/firestore/lite';
import {IRequestResult} from 'shared/interfaces';
import {db} from 'shared/services/firebase';

export interface IProduct {
  id: string;
  code: string;
  description: string;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
  size: string;
  seller: string;
  sold: boolean;
  travel: string;
}

const productDB = collection(db, 'products');

const getProducts = async (): Promise<IProduct[]> => {
  try {
    const productSnapshot = await getDocs(productDB);
    const productList = productSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        code: doc.data().code,
        description: doc.data().description,
        purchaseValue: doc.data().purchaseValue,
        saleValue: doc.data().saleValue,
        profitValue: doc.data().profitValue,
        size: doc.data().size,
        seller: doc.data().seller,
        sold: doc.data().sold,
        travel: doc.data().travel,
      };
    });

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
  payload: Omit<IProduct, 'id'>,
): Promise<IRequestResult> => {
  try {
    const codExists = await getDocs(
      query(productDB, where('cod', '==', payload.code)),
    );

    if (codExists.docs.map((doc) => doc.data()).length > 0) {
      throw new Error('Código já utilizado');
    }

    await addDoc(productDB, payload);

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
