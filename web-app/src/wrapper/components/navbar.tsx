import { ThemeToggle } from '@/components/theme/toggle';
import { Button } from '@/components/ui/button';
import { useInterwovenKit } from '@initia/interwovenkit-react';

export const Navbar = () => {
  const { isConnected, address, openWallet, openConnect } = useInterwovenKit();

  return (
    <nav className="mb-8 flex w-full items-center justify-between gap-2 p-4">
      <h1 className="mr-auto text-xl font-medium">App</h1>

      <ThemeToggle />

      {isConnected ? (
        <Button onClick={openWallet} variant="outline">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      ) : (
        <Button onClick={openConnect} variant="outline">
          Connect Wallet
        </Button>
      )}
    </nav>
  );
};
