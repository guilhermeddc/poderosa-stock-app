import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {IRequestResult} from 'shared/interfaces';
import {shoppingDB} from 'shared/services/firebase';

export interface IShopping {
  id: string;
  name: string;
  city: string;
  uf: string;
}

const getShoppings = async (): Promise<IShopping[]> => {
  try {
    const shoppingSnapshot = await getDocs(shoppingDB);
    const shoppingList = shoppingSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        city: doc.data().city,
        uf: doc.data().uf,
      };
    });

    return shoppingList;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getShopping = async (id: string): Promise<IShopping> => {
  try {
    const shopping = await getDoc(doc(shoppingDB, id));

    return {id: shopping.id, ...shopping.data()} as IShopping;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const createShopping = async (
  payload: Omit<IShopping, 'id'>,
): Promise<IRequestResult> => {
  try {
    await addDoc(shoppingDB, payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const updateShopping = async (
  id: string,
  payload: Omit<IShopping, 'id'>,
): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(shoppingDB, id), payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const deleteShopping = async (id: string): Promise<IRequestResult> => {
  try {
    await deleteDoc(doc(shoppingDB, id));

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const shoppingService = {
  getShoppings,
  getShopping,
  createShopping,
  updateShopping,
  deleteShopping,
};
