import {ValidationError} from 'yup';

interface IErrors {
  [key: string]: string;
}

const getValidationErrors = (err: ValidationError): IErrors => {
  const validationError: IErrors = {};

  err.inner.forEach((error) => {
    if (error.path) validationError[error.path] = error.message;
  });

  return validationError;
};

export default getValidationErrors;
