import { MutationCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (data, _variables, _context, mutation) => {
      if (mutation.meta?.skipErrorToast) return;

      const { title: errTitle, description: errDescription } =
        (mutation.meta?.error as {
          title?: string;
          description?: string;
        }) || {};

      const responseError = 'error' in data ? (data.error as Error).message : null;

      const errorTitle = errTitle || 'Something went wrong';
      const errorDescription =
        errDescription ||
        responseError ||
        'Please try again later. If the problem persists, please contact support.';

      console.error(errorTitle, errorDescription);
      // TODO: Add toast notification when UI library is set up
      // toast.error(errorTitle, { description: errorDescription });
    },
  }),
});
