import {Subject} from 'rxjs';

export type ConfirmationDialogTypes =
  | 'warning'
  | 'delete'
  | 'confirmation'
  | undefined;

interface IConfirmationDialog {
  type: ConfirmationDialogTypes;
  onConfirm?(): void;
  onCancel?(): void;
  message: string;
}

const confirmationDialogSubject = new Subject<IConfirmationDialog>();

export const ConfirmationDialogService =
  confirmationDialogSubject.asObservable();

export const confirm = ({
  message,
  type,
  onConfirm,
  onCancel,
}: IConfirmationDialog): void => {
  confirmationDialogSubject.next({
    onConfirm,
    onCancel,
    message,
    type,
  });
};
