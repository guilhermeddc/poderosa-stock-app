import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {IRequestResult} from 'shared/interfaces';

import {db} from '../firebase';

const sizeDB = collection(db, 'products');

interface ISize {
  id: string;
  name: string;
}

const getSizes = async (): Promise<ISize[]> => {
  try {
    const productSnapshot = await getDocs(sizeDB);
    const productList = productSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
      };
    });

    return productList;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const createSize = async (
  payload: Omit<ISize, 'id'>,
): Promise<IRequestResult> => {
  try {
    const codExists = await getDocs(
      query(sizeDB, where('cod', '==', payload.name)),
    );

    if (codExists.docs.map((doc) => doc.data()).length > 0) {
      throw new Error('Tamanho já utilizado');
    }

    await addDoc(sizeDB, payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const updateSize = async (
  id: string,
  payload: Omit<ISize, 'id'>,
): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(sizeDB, id), payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const deleteSize = async (id: string): Promise<IRequestResult> => {
  try {
    await deleteDoc(doc(sizeDB, id));

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const sizeService = {
  createSize,
  getSizes,
  updateSize,
  deleteSize,
};
