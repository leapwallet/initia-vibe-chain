import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/query';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
