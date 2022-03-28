import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {IRequestResult} from 'shared/interfaces';
import {providerDB} from 'shared/services/firebase';

export interface IProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
}

const getProviders = async (): Promise<IProvider[]> => {
  try {
    const providerSnapshot = await getDocs(providerDB);
    const providerList = providerSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        phone: doc.data().phone,
        cnpj: doc.data().cnpj,
      };
    });

    return providerList;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getProvider = async (id: string): Promise<IProvider> => {
  try {
    const provider = await getDoc(doc(providerDB, id));

    return {id: provider.id, ...provider.data()} as IProvider;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const createProvider = async (
  payload: Omit<IProvider, 'id'>,
): Promise<IRequestResult> => {
  try {
    await addDoc(providerDB, payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const updateProvider = async (
  id: string,
  payload: Omit<IProvider, 'id'>,
): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(providerDB, id), payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const deleteProvider = async (id: string): Promise<IRequestResult> => {
  try {
    await deleteDoc(doc(providerDB, id));

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const providerService = {
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
};
