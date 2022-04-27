import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {collection, getFirestore} from 'firebase/firestore';
import {getFunctions} from 'firebase/functions';
import {getStorage} from 'firebase/storage';

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export const notificationDB = collection(db, 'notifications');
export const userTypeDB = collection(db, 'userType');
export const userDB = collection(db, 'users');
export const productDB = collection(db, 'products');
export const productTypeDB = collection(db, 'productTypes');
export const providerDB = collection(db, 'providers');
export const adminDB = collection(db, 'admins');
export const purchaseDB = collection(db, 'purchases');
export const purchaseTypeDB = collection(db, 'purchaseType');
export const shoppingDB = collection(db, 'shoppings');
export const movementDB = collection(db, 'movements');
export const movementTypeDB = collection(db, 'movementTypes');

export default app;
