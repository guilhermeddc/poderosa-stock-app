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
import {productDB, sellerDB, userDB} from 'shared/services/firebase';

import {IProduct} from './product';
import {providerService} from './provider';
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
    const seller = await getDocs(query(userDB, where('type', '==', 'seller')));

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
  productList: IProduct[];
  totalSaleValue: number;
  totalProfitValue: number;
  totalQuantity: number;
  totalPurchaseValue: number;
}

const getSellerProducts = async (seller: string): Promise<IListProduct> => {
  try {
    const productSnapshot = await getDocs(
      query(productDB, where('seller', '==', seller)),
    );
    const productList = await Promise.all(
      productSnapshot.docs.map(async (data) => {
        return {
          id: data.id,
          seller: data.data().seller
            ? await sellerService.getSeller(data.data().seller)
            : null,
          provider: await providerService.getProvider(data.data().provider),
          ...data.data(),
        } as IProduct;
      }),
    );

    let totalSaleValue = 0;
    let totalProfitValue = 0;
    let totalQuantity = 0;
    let totalPurchaseValue = 0;

    productList.forEach((product) => {
      totalSaleValue += product.saleValue;
      totalProfitValue += product.profitValue;
      totalQuantity += Number(product.quantity);
      totalPurchaseValue += product.purchaseValue;
    });

    return {
      productList,
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

export const sellerService = {
  getSellers,
  getSeller,
  createSeller,
  createSellerByGoogle,
  updateSeller,
  deleteSeller,
  getSellerProducts,
};
