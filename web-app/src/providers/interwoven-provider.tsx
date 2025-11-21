'use client';

import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from '@initia/interwovenkit-react';
import InterwovenKitStyles from '@initia/interwovenkit-react/styles.js';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { type PropsWithChildren, useEffect } from 'react';

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});

export default function InterwovenProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(InterwovenKitStyles);
  }, []);

  console.log('TESTNET', TESTNET);

  return (
    <WagmiProvider config={wagmiConfig}>
      <InterwovenKitProvider {...TESTNET} defaultChainId="initiation-2">
        {children}
      </InterwovenKitProvider>
    </WagmiProvider>
  );
}
