import {getDocs, Timestamp, addDoc} from 'firebase/firestore';

import {movementDB, movementTypeDB} from '../firebase';

export interface IMovementTypes {
  id: string;
  name: string;
}

const getMovementTypes = async (): Promise<IMovementTypes[]> => {
  try {
    const movementTypes = await getDocs(movementTypeDB);

    return movementTypes.docs.map((data) => {
      return {
        ...data.data(),
        id: data.id,
      };
    }) as IMovementTypes[];
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export interface IInstallments {
  number: number;
  amount: number;
  date: Timestamp;
}

export interface IMovement {
  id?: string;
  movement: 'purchase' | 'sale';
  provider: string;
  amount: number;
  dividedIn: number;
  date: string;
  type: string;
  installments: IInstallments[];
}

const getMovements = async (): Promise<IMovement[]> => {
  try {
    const movements = await getDocs(movementDB);

    return movements.docs.map((data) => {
      return {
        ...data.data(),
        id: data.id,
      };
    }) as IMovement[];
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

const createMovement = async (payload: IMovement): Promise<void> => {
  try {
    await addDoc(movementDB, payload);
  } catch (error: any) {
    // eslint-disable-next-line
    console.log('*** error', error);
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(`${errorCode} ${errorMessage}`);
  }
};

export const movementsService = {
  getMovements,
  getMovementTypes,
  createMovement,
};
