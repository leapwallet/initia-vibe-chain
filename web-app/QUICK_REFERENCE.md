# Quick Reference Guide

## Environment Variables

```env
VITE_REST_URL=https://rest.testnet.initia.xyz
VITE_CHAIN_ID=initiation-2
VITE_MODULE_ADDRESS=0xa074bebd5af4f6d50750ad57d334bd980b23569d
VITE_GAS_PRICES=0.015uinit
```

## Contract Functions

### Query Functions
```typescript
// Check if game exists
const exists = await gameExists(address);

// Get game state
const game = await queryGame(address);
```

### Transaction Functions
```typescript
// Create a new game
const msg = createGameMessage(myAddress, opponentAddress);
await requestTxBlock({ messages: [msg] });

// Make a move
const msg = makeMoveMessage(myAddress, gameOwner, position);
await requestTxBlock({ messages: [msg] });
```

## Game State

```typescript
interface GameView {
  board: number[];        // [0,0,0,0,0,0,0,0,0]
  player_x: string;       // "init1..."
  player_o: string;       // "init1..."
  current_turn: number;   // 1=X, 2=O
  status: number;         // 0=active, 1=X won, 2=O won, 3=draw
  move_count: number;     // 0-9
}
```

## Constants

```typescript
// Game Status
STATUS_ACTIVE = 0
STATUS_X_WON = 1
STATUS_O_WON = 2
STATUS_DRAW = 3

// Cell Values
CELL_EMPTY = 0
CELL_X = 1
CELL_O = 2
```

## Board Positions

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

## Using InterwovenKit Hooks

```typescript
import { useInterwovenKit } from '@initia/interwovenkit-react';

function MyComponent() {
  const {
    address,              // Current wallet address
    isConnected,         // Connection status
    openConnect,         // Open connect modal
    openWallet,          // Open wallet modal
    requestTxBlock,      // Send transaction
    waitForTxConfirmation, // Wait for confirmation
  } = useInterwovenKit();
}
```

## Query with React Query

```typescript
import { useQuery } from '@tanstack/react-query';

const { data: game, refetch } = useQuery({
  queryKey: ['game', address],
  queryFn: () => queryGame(address),
  enabled: !!address,
  refetchInterval: 3000, // Auto-refresh every 3s
});
```

## Transaction with React Query

```typescript
import { useMutation } from '@tanstack/react-query';

const createGame = useMutation({
  mutationFn: async (playerO: string) => {
    const msg = createGameMessage(address, playerO);
    const result = await requestTxBlock({ messages: [msg] });
    await waitForTxConfirmation({ txHash: result.transactionHash });
    return result.transactionHash;
  },
  onSuccess: (txHash) => {
    toast.success('Game created!');
    refetch(); // Refresh game state
  },
});
```

## Toast Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('Game created!', {
  description: 'Transaction confirmed',
});

// Error
toast.error('Failed to create game', {
  description: error.message,
});

// Info
toast.info('Loading game...');
```

## Styling with Tailwind

```typescript
import { cn } from '@/lib/utils';

<Button
  className={cn(
    'base-classes',
    condition && 'conditional-classes',
    variant === 'primary' && 'primary-classes'
  )}
/>
```

## Component Structure

```typescript
interface MyComponentProps {
  game: GameView | null;
  onMove: (position: number) => void;
  disabled?: boolean;
}

export function MyComponent({ game, onMove, disabled }: MyComponentProps) {
  // Component logic
}
```

## Useful Utilities

```typescript
// Truncate address
const short = address.slice(0, 10) + '...' + address.slice(-6);

// Copy to clipboard
await navigator.clipboard.writeText(address);

// Check if address is valid
const isValid = address.startsWith('init1') || address.startsWith('0x');
```

## Common Patterns

### Loading State
```typescript
{isLoading ? (
  <Spinner />
) : (
  <Content />
)}
```

### Conditional Rendering
```typescript
{game && game.status === STATUS_ACTIVE && (
  <ActiveGameUI />
)}
```

### Error Boundaries
```typescript
try {
  await operation();
} catch (error) {
  console.error('Error:', error);
  toast.error('Operation failed');
}
```

## Keyboard Shortcuts

- `⌘K` - Open command palette (if implemented)
- `⌘/` - Toggle theme
- `Esc` - Close modals

## Debugging

```typescript
// Log game state
console.log('Game:', JSON.stringify(game, null, 2));

// Log transaction
console.log('TX Hash:', txHash);

// Check network
console.log('Chain:', CHAIN_ID);
console.log('Module:', MODULE_ADDRESS);
```

## Common Issues

### "Invalid address"
- Use Bech32 format: `init1...`
- Or hex format: `0x...`

### "Not your turn"
- Wait for opponent to move
- Check current_turn value

### "Position occupied"
- Cell already has X or O
- Choose empty cell (value 0)

### "Transaction failed"
- Check wallet balance
- Verify gas prices
- Check network connection

## File Locations

```
src/
├── lib/contract.ts           # Contract integration
├── components/game/
│   ├── GameBoard.tsx         # Game board UI
│   ├── GameStatus.tsx        # Status display
│   └── GameControls.tsx      # Controls UI
├── pages/index.tsx           # Main game page
└── providers/
    └── interwoven-provider.tsx # Wallet provider
```

## Testing

```bash
# Run dev server
pnpm dev

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint

# Format
pnpm format

# Build
pnpm build
```

## Network Explorer

- Testnet: https://scan.testnet.initia.xyz
- View TX: `https://scan.testnet.initia.xyz/tx/{TX_HASH}`
- View Address: `https://scan.testnet.initia.xyz/address/{ADDRESS}`

## Support

- Initia Discord: https://discord.gg/initia
- Docs: https://docs.initia.xyz
- Faucet: https://v1.app.testnet.initia.xyz/faucet

