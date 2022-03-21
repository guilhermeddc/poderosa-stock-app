import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from '@firebase/firestore/lite';
import {IRequestResult} from 'shared/interfaces';
import {db} from 'shared/services/firebase';

export interface ISeller {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

const sellerDB = collection(db, 'sellers');

const getSellers = async (): Promise<ISeller[]> => {
  try {
    const sellerSnapshot = await getDocs(sellerDB);
    const sellerList = sellerSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        phone: doc.data().phone,
        cpf: doc.data().cpf,
      };
    });

    return sellerList;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getSeller = async (id: string): Promise<ISeller> => {
  try {
    const seller = await getDoc(doc(sellerDB, id));

    return {id: seller.id, ...seller.data()} as ISeller;
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

export const sellerService = {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller,
};
