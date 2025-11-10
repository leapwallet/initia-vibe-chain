import { ThemeToggle } from '../theme/toggle';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-2">
      <h1 className="text-lg font-medium">My App</h1>
      <ThemeToggle />
    </nav>
  );
};
