import React, {useState, createContext, useCallback} from 'react';

export interface IContextTitle {
  setTitle(value: string): void;
  title: string;
}

export const TitleContext = createContext<IContextTitle>({} as IContextTitle);

export const TitleProvider: React.FC = ({children}) => {
  const [title, setTitle] = useState('');

  const handleSetTitle = useCallback((value: string) => {
    setTitle(value);
    document.title = `Poderosa Stock${
      value !== '' ? ' - ' + value : ''
    }`.trim();
  }, []);

  return (
    <TitleContext.Provider value={{title, setTitle: handleSetTitle}}>
      {children}
    </TitleContext.Provider>
  );
};
