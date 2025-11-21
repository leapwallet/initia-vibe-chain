import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router';

import { Navbar } from './components/navbar';

export function RoutesLayout() {
  return (
    <>
      <Navbar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>

      <Toaster />
    </>
  );
}
