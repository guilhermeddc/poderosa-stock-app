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
import {httpsCallable} from 'firebase/functions';
import {IRequestResult} from 'shared/interfaces';
import {functions, sellerDB, userDB} from 'shared/services/firebase';

import {IProduct} from './product';
import {IUser} from './user';

export interface ISeller {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  imageUrl?: string;
}

const getSellers = async (): Promise<IUser[]> => {
  try {
    const seller = await getDocs(
      query(userDB, where('type', 'array-contains', 'seller')),
    );

    return seller.docs.map((data) => {
      return {
        ...data.data(),
        id: data.id,
      };
    }) as IUser[];
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getSeller = async (id: string): Promise<ISeller> => {
  try {
    const seller = await getDoc(doc(userDB, id));

    return {id: seller.id, ...seller.data()} as ISeller;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const createSellerByGoogle = async (
  payload: ISeller,
): Promise<IRequestResult> => {
  try {
    await addDoc(sellerDB, payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const createSeller = async (
  payload: Omit<ISeller, 'id'>,
): Promise<IRequestResult> => {
  try {
    await addDoc(sellerDB, payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const updateSeller = async (
  id: string,
  payload: Omit<ISeller, 'id'>,
): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(sellerDB, id), payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const deleteSeller = async (id: string): Promise<IRequestResult> => {
  try {
    await deleteDoc(doc(sellerDB, id));

    return {success: true};
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
  totalQuantity: number;
  totalPurchaseValue: number;
}

const getSellerProducts = async (seller: string): Promise<IListProduct> => {
  try {
    const getProducts = httpsCallable(functions, 'getProducts');
    const result = await getProducts({seller});

    // eslint-disable-next-line
    console.log('*** result', result);

    return result.data as IListProduct;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const sellerService = {
  getSellers,
  getSeller,
  createSeller,
  createSellerByGoogle,
  updateSeller,
  deleteSeller,
  getSellerProducts,
};
