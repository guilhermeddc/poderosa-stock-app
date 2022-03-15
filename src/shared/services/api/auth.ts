import {collection, getDocs} from '@firebase/firestore/lite';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as FSignOut,
  User,
} from 'firebase/auth';
import {auth, db} from 'shared/services/firebase';

export interface IUser {
  user: User;
  admin: boolean;
}

const provider = new GoogleAuthProvider();

const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminStorage = collection(db, 'admins');

    const adminSnapshot = await getDocs(adminStorage);
    const adminList = adminSnapshot.docs.map((doc) => doc.data());

    return adminList.filter((item) => item.id === uid).length > 0;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const signIn = async (): Promise<IUser> => {
  try {
    const resUser = await signInWithPopup(auth, provider);

    const user = resUser.user;

    const admin = await isAdmin(resUser.user.uid);

    return {user, admin};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const signOut = async () => {
  try {
    const response = await FSignOut(auth);

    return response;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const authService = {
  signIn,
  signOut,
};
