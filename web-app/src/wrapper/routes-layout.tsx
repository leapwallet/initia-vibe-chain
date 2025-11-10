import { Navbar } from '@/components/navbar';
import { Outlet } from 'react-router';

export function RoutesLayout() {
  return (
    <>
      <Navbar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </>
  );
}
