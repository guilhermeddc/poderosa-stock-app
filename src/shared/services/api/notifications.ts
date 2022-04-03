import {
  addDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {IRequestResult} from 'shared/interfaces';

import {db, notificationDB} from '../firebase';

export interface INotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  link: string;
  visualized: boolean;
  createdAt: Date;
}

export interface ICreateNotification {
  title: string;
  body: string;
  icon?: string;
  link: string;
}

const createNotification = async (
  payload: ICreateNotification,
): Promise<IRequestResult> => {
  try {
    await addDoc(notificationDB, {
      ...payload,
      createdAt: new Date(),
      visualized: false,
    });

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const getNotifications = async (): Promise<INotification[]> => {
  try {
    const notifications = await getDocs(
      query(
        notificationDB,
        where('visualized', '==', false),
        orderBy('createdAt', 'desc'),
      ),
    );

    return notifications.docs.map((data) => {
      return {
        ...data.data(),
        id: data.id,
      };
    }) as INotification[];
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const markAsRead = async (notificationId: string): Promise<IRequestResult> => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      visualized: true,
    });

    return {success: true};
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const notificationService = {
  createNotification,
  getNotifications,
  markAsRead,
};
