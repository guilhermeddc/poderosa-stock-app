import {QueryClient} from 'react-query';

import {feedback} from '../alertService';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: any) => {
        feedback(error.message, 'error');
      },
      retry: false,
    },
  },
});
