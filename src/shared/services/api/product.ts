import {GridSelectionModel} from '@mui/x-data-grid';
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
import {productDB} from 'shared/services/firebase';

import {notificationService} from './notifications';
import {IProvider, providerService} from './provider';
import {ISeller, sellerService} from './seller';

export interface IProduct {
  id: string;
  code: string;
  description: string;
  quantity: number;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
  size: string;
  seller?: ISeller | null;
  provider: IProvider;
  sold: boolean;
  travel?: string;
  purchase: string;
}

export interface ICreateProduct {
  code: string;
  description: string;
  quantity: number;
  purchaseValue: number;
  saleValue: number;
  profitValue: number;
  size: string;
  seller?: string;
  provider: string;
  sold: boolean;
  travel?: string;
}

export interface IListProduct {
  products: IProduct[];
  totalSaleValue: number;
  totalSaleValueSold: number;
  totalSaleValueInStock: number;
  totalProfitValue: number;
  totalPurchaseValue: number;
  totalQuantity: number;
  totalQuantitySold: number;
  totalQuantityInStock: number;
}

const getProducts = async (): Promise<IListProduct> => {
  try {
    const productSnapshot = await getDocs(productDB);
    const products = await Promise.all(
      productSnapshot.docs.map(async (data) => {
        return {
          ...data.data(),
          id: data.id,
          seller: data.data().seller
            ? await sellerService.getSeller(data.data().seller)
            : {id: ''},
          provider: await providerService.getProvider(data.data().provider),
        };
      }) as Promise<IProduct>[],
    );

    let totalSaleValue = 0;
    let totalSaleValueSold = 0;
    let totalProfitValue = 0;
    let totalQuantity = 0;
    let totalPurchaseValue = 0;
    let totalQuantitySold = 0;

    products.forEach((product) => {
      totalSaleValue += product.saleValue;
      totalProfitValue += product.profitValue;
      totalQuantity += Number(product.quantity);
      totalPurchaseValue += product.purchaseValue;
      if (product.sold) {
        totalQuantitySold += Number(product.quantity);
        totalSaleValueSold += product.saleValue;
      }
    });

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

    if (payload.seller) {
      const seller = await sellerService.getSeller(payload.seller);

      if (!seller) {
        throw new Error('Vendedor não encontrado');
      }
    }

    if (payload.provider) {
      const provider = await providerService.getProvider(payload.provider);

      if (!provider) {
        throw new Error('Fornecedor não encontrado');
      }
    }

    if (payload.quantity < 1) {
      throw new Error('Quantidade inválida');
    }

    if (payload.quantity > 1) {
      for (let i = 0; i < payload.quantity; i++) {
        await addDoc(productDB, {
          ...payload,
          sold: false,
          quantity: 1,
          purchaseValue: Number(payload.purchaseValue),
          saleValue: Number(payload.saleValue),
        });
      }
      return {success: true};
    }

    await addDoc(productDB, {
      ...payload,
      sold: false,
      quantity: 1,
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
    await updateDoc(doc(productDB, id), {
      ...payload,
      purchaseValue: Number(payload.purchaseValue),
      saleValue: Number(payload.saleValue),
    });

    await notificationService.createNotification({
      title: `Produto atualizado`,
      body: `O produto ${payload.description} foi atualizado`,
      link: `/produtos?filter=${payload.code}`,
      icon: 'add_alert',
      isAdmin: false,
    });

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const changeSoldProduct = async (
  id: string,
  sold: boolean,
): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(productDB, id), {sold});

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const transferProducts = async (
  ids: GridSelectionModel,
  seller: string,
): Promise<IRequestResult> => {
  try {
    await Promise.all(
      ids.map(async (id) => {
        await updateDoc(doc(productDB, String(id)), {seller});
      }),
    );

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
  transferProducts,
  changeSoldProduct,
};
