import {useContext} from 'react';

import {TitleContext, TitleProvider, IContextTitle} from 'shared/context/Title';

function useTitle(): IContextTitle {
  const context = useContext(TitleContext);

  if (!context) {
    throw new Error('useTitle must be used within an TitleProvider');
  }

  return context;
}

export {TitleProvider, useTitle};
