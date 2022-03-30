import {
  GoogleAuthProvider,
  inMemoryPersistence,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut as FSignOut,
  User,
} from 'firebase/auth';
import {doc, getDoc, getDocs} from 'firebase/firestore';
import {auth, userDB, userTypeDB} from 'shared/services/firebase';

import {notificationService} from './notifications';
import {IUser, userService} from './user';

const provider = new GoogleAuthProvider();

const getUser = async (uid: string): Promise<IUser> => {
  try {
    const user = await getDoc(doc(userDB, uid));

    return user.data() as IUser;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

interface IUserType {
  id: string;
  name: string;
}

const getUserType = async (): Promise<IUserType[]> => {
  try {
    const userType = await getDocs(userTypeDB);

    return userType.docs.map((data) => ({
      id: data.id,
      name: data.data().name,
    })) as IUserType[];
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const signIn = async (): Promise<IUser> => {
  try {
    const resUser = await signInWithPopup(auth, provider);

    const authUser: User = resUser.user;

    const user = await getUser(resUser.user.uid);

    if (authUser && !user) {
      await userService.createUserByGoogle({
        id: authUser.uid,
        name: authUser.displayName || '',
        email: authUser.email || '',
        imageUrl: authUser.photoURL || '',
        phone: '',
        cpf: '',
        type: [],
      });

      await notificationService.createNotification({
        title: 'Novo usuário',
        body: `Usuário ${resUser.user.displayName} criado e esperando aprovação`,
        link: `/users/profile/${resUser.user.uid}`,
        icon: 'add_alert',
      });

      await signOut();
    }

    return user;
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

const signPersist = async () => {
  try {
    await setPersistence(auth, inMemoryPersistence);

    const provider = new GoogleAuthProvider();

    return signInWithRedirect(auth, provider);
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const authService = {
  signIn,
  signOut,
  signPersist,
  getUserType,
};
