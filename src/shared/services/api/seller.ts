import {doc, getDoc, getDocs, query, where} from 'firebase/firestore';
import {userId} from 'shared/constants';
import {productDB, userDB} from 'shared/services/firebase';

import {IListProduct, IProduct} from './product';
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
    const seller = await getDocs(
      query(userDB, where('type', 'array-contains', userId.seller)),
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

const getSellerProducts = async (
  seller: string | undefined,
): Promise<IListProduct> => {
  try {
    const productSnapshot = await getDocs(
      query(productDB, where('seller', '==', seller)),
    );

    let totalSaleValue = 0;
    let totalSaleValueSold = 0;
    let totalProfitValue = 0;
    let totalQuantity = 0;
    let totalPurchaseValue = 0;
    let totalQuantitySold = 0;

    const products = await Promise.all(
      productSnapshot.docs.map(async (data) => {
        totalSaleValue += data.data().saleValue;
        totalProfitValue += data.data().profitValue;
        totalQuantity += Number(data.data().quantity);
        totalPurchaseValue += data.data().purchaseValue;
        if (data.data().sold) {
          totalQuantitySold += Number(data.data().quantity);
          totalSaleValueSold += data.data().saleValue;
        }

        return {
          ...data.data(),
          id: data.id,
          seller: data.data().seller
            ? await sellerService.getSeller(data.data().seller)
            : null,
          provider: await providerService.getProvider(data.data().provider),
        } as IProduct;
      }),
    );

    return {
      products,
      totalSaleValue,
      totalSaleValueSold,
      totalSaleValueInStock: totalSaleValue - totalSaleValueSold,
      totalProfitValue,
      totalQuantity,
      totalQuantitySold,
      totalQuantityInStock: totalQuantity - totalQuantitySold,
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
  getSellerProducts,
};
