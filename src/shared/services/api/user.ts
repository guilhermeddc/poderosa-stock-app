import {deleteDoc, doc, getDocs, setDoc} from 'firebase/firestore';
import {IRequestResult} from 'shared/interfaces';

import {userDB} from '../firebase';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  imageUrl?: string;
  admin?: boolean;
  seller?: boolean;
  type: string[];
  updated?: boolean;
}

const createUserByLogin = async (payload: IUser): Promise<IRequestResult> => {
  try {
    await setDoc(doc(userDB, payload.id), payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getUsers = async (): Promise<IUser[]> => {
  try {
    const users = await getDocs(userDB);

    return users.docs.map((data) => {
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

const updateUser = async (
  id: string,
  payload: IUser,
): Promise<IRequestResult> => {
  try {
    await setDoc(doc(userDB, id), payload);

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const deleteUser = async (id: string): Promise<IRequestResult> => {
  try {
    await deleteDoc(doc(userDB, id));

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const userService = {
  createUserByLogin,
  getUsers,
  deleteUser,
  updateUser,
};
