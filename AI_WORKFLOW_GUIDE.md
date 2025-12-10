# AI Workflow Guide - Building Your First Initia dApp

This guide walks you through building a complete dApp on Initia using AI coding assistants. Each step includes a ready-made prompt that references the template's documentation, so your AI generates accurate, Initia-specific code.

> **Note:** See [README.md](./README.md) for an overview of what this template provides.

## What You'll Build

You'll build a fully functional tic-tac-toe game on Initia:
- A Move smart contract that handles game logic on-chain
- A React frontend interface for players to interact with the game
- Complete integration connecting the frontend to your deployed smart contract

This demo application showcases the complete workflow from smart contract development to frontend integration.

## Prerequisites

Before starting, ensure you have:
- An AI coding assistant installed (Cursor, Windsurf, or GitHub Copilot)
- [Node.js](https://nodejs.org/) (v22 or higher) and [pnpm](https://pnpm.io/)
- [initiad](https://docs.initia.xyz/developers/developer-guides/tools/clis/initiad-cli/introduction) CLI tool installed

**Installation Help:** For detailed instructions on installing initiad, see the [Quick Setup section in INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md#quick-setup).

Verify initiad is installed:
```bash
initiad version
```

## Step 0: Create and Fund Your Initia Account

Before building your dApp, you need an Initia testnet account to deploy your smart contract.

> **Docs:** See [initiad-cli.md](./developer-guides/tools/clis/initiad-cli.md) for detailed CLI command reference and account management.

Copy and paste this prompt into your AI coding assistant:

```
Create an Initia testnet account for me:

1. Run the command to create a new key named "mykey" using initiad
2. Display the full output including the mnemonic phrase so I can copy and save it securely
3. Get and display my wallet address (init1...)
4. Provide instructions to fund my account from the Initia testnet faucet
5. Verify that my account has been funded successfully

Important: Make sure to show me the complete mnemonic phrase output so I can copy it to a secure location.

Use these commands:
- initiad keys add mykey
- initiad keys show mykey --address
- initiad query bank balances $(initiad keys show mykey --address) --node https://rpc.testnet.initia.xyz

Faucet URL: https://faucet.testnet.initia.xyz/

Reference documentation:
- developer-guides/tools/clis/initiad-cli.md (detailed CLI command reference and account management)
```

**After pasting the prompt:**

1. Your AI assistant will run the account creation command
2. **IMPORTANT: Copy and save the 24-word mnemonic phrase** - store it securely, never share it
3. The AI will display your wallet address and help you fund it from the faucet

**Note:** If you already have an Initia account, you can skip this step and use your existing key name.

**Next Step:** Once your account is funded, proceed to Step 1 to build your smart contract.

### Verify Step 0

**Verify:** You have a saved mnemonic phrase, wallet address (starting with `init1...`), and testnet tokens (at least 1,000,000 uinit) in your account.

## Step 1: Build Your Smart Contract

Build your Move smart contract using the template's documentation. Your AI assistant will reference these guides to generate Initia-specific code.

> **Context from Step 0:** You should have an Initia testnet account with a key (e.g., "mykey") and sufficient testnet tokens (at least 1,000,000 uinit) from the faucet. You'll use this account to deploy the contract.

> **Docs:** See [INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md) for Move patterns, [building-move-modules.md](./developer-guides/vm-specific-tutorials/movevm/building-move-modules.md) for module structure, and [initiad-cli.md](./developer-guides/tools/clis/initiad-cli.md) for CLI commands.

### Copy This Prompt

Copy and paste this prompt into your AI coding assistant:

```
Build a fully on-chain tic-tac-toe game smart contract on Initia using MoveVM:

Context from Step 0: You should have an Initia testnet account with a key (e.g., "mykey") and sufficient testnet tokens (at least 1,000,000 uinit) from the faucet. You'll use this account to deploy the contract.

Core Requirements:

1. Game State: Store 3x3 board, player addresses (X/O), current turn, game status (pending/active/won/draw/rejected)
2. Functions:
   - create_game: Initialize game between two players (game stored in Player X's account with STATUS_PENDING)
   - accept_game: Player O accepts the invitation (changes status to STATUS_ACTIVE, creates GameO resource)
   - reject_game: Player O rejects the invitation (changes status to STATUS_REJECTED)
   - make_move: Place X/O at position (0-8), validate turn & position (only works when STATUS_ACTIVE)
   - check_winner: Detect 3-in-a-row (rows/columns/diagonals) or draw
   - view_game: Query current board state
   - get_game_as_player_o: Find Player X's address if user is Player O in a game
3. Storage Pattern: 
   - Game resource stored in Player X's account (full game state)
   - GameO resource stored in Player O's account (reference to Player X address for bidirectional lookup)
   - GameO is created when Player O accepts the game
4. Game Flow:
   - Player X creates game → STATUS_PENDING
   - Player O accepts → STATUS_ACTIVE (GameO resource created)
   - Player O rejects → STATUS_REJECTED
   - Game can only be played when STATUS_ACTIVE
5. Validation: 
   - Enforce alternating turns (check current_turn matches player symbol)
   - Prevent overwriting moves (check cell is empty)
   - Check game-over states (reject moves if status != active)
   - Validate position (0-8 only)
   - Ensure only game players can make moves

Important: The game must work with two DIFFERENT player addresses. Ensure the make_move function correctly identifies which player is making the move based on the signer's address.

Technical Details:
- Use #[view] for read-only functions (see developer-guides/vm-specific-tutorials/movevm/building-move-modules.md)
- Use public entry fun for transaction functions
- Include acquires clause when accessing resources
- Use proper error codes (E_GAME_NOT_FOUND, E_NOT_YOUR_TURN, E_POSITION_OCCUPIED, E_GAME_ALREADY_OVER, etc.)
- Board positions: 0-8 (0=top-left, 4=center, 8=bottom-right)

Development Steps:
1. Initialize Move project: initiad move init tictactoe
2. Create the Move module file in sources/tictactoe.move
3. Configure Move.toml with your deployer address (hex format: 0x...)
4. Build: initiad move build
5. Deploy: initiad move deploy --path . --upgrade-policy COMPATIBLE --from <your-key-name> --gas auto --gas-adjustment 1.5 --gas-prices 0.015uinit --node https://rpc.testnet.initia.xyz --chain-id initiation-2 -y

After deployment, create two test player accounts (required for proper testing):
1. Create player1 key: initiad keys add player1
2. Create player2 key: initiad keys add player2
3. Fund both accounts from faucet: https://faucet.testnet.initia.xyz/
4. Get hex addresses: initiad keys parse $(initiad keys show player1 --address) and same for player2

Then test the contract end-to-end by playing a complete game:
1. Create a game with player1 as X and player2 as O
2. Make moves alternating between players (player1 signs X moves, player2 signs O moves)
3. Play until someone wins (test winner detection)
4. After game ends, verify moves are rejected with E_GAME_ALREADY_OVER
5. Start a new game and test E_NOT_YOUR_TURN by having wrong player try to move
6. Test E_POSITION_OCCUPIED by trying to play on a taken cell

Reference these guides for detailed patterns:
- developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md (storage patterns, error handling)
- developer-guides/vm-specific-tutorials/movevm/building-move-modules.md (module structure)
- developer-guides/vm-specific-tutorials/movevm/setting-up.md (project setup)
- developer-guides/tools/clis/initiad-cli.md (CLI commands)

Initia docs: https://docs.initia.xyz/developers/introduction
```

**After pasting the prompt:**

1. Your AI assistant will generate the Move smart contract code
2. Review the generated code and ensure it follows Initia Move patterns
3. Save the contract file (typically `sources/tictactoe.move`)
4. Configure `Move.toml` with your deployer address (use hex format: `0x...`)
5. Build: `initiad move build` - **Verify:** Build succeeds and `build/` directory created
6. Deploy: `initiad move deploy --path . --upgrade-policy COMPATIBLE --from <your-key-name> --gas auto --gas-adjustment 1.5 --gas-prices 0.015uinit --node https://rpc.testnet.initia.xyz --chain-id initiation-2 -y`
7. **Save your deployed module address** (your deployer's hex address) - you'll need it for the frontend

### Verify Step 1

**Verify:** Contract builds successfully, deploys without errors, and you can query the module. Test with two different player accounts (the prompt includes instructions for creating test accounts).

> **Testing help:** See [INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md) for detailed testing patterns and [initiad-cli.md](./developer-guides/tools/clis/initiad-cli.md) for CLI command reference.

**Next Step:** Save your deployed module address - you'll need it for Step 2 when installing frontend dependencies.

## Step 2: Install Frontend Dependencies

Install the required frontend packages with exact versions to ensure compatibility with Initia's tooling.

> **Context from Step 1:** You should have a deployed Move smart contract with a module address (your deployer's hex address, e.g., `0x55037BEEC8E307FA9D48C2D7121E170BE9517C14`). You'll need this address later for the frontend environment variable `VITE_MODULE_ADDRESS`.

### Copy This Prompt

Copy and paste this prompt into your AI coding assistant:

```
Install the required frontend dependencies for building a React frontend that connects to an Initia Move smart contract.

Context from Step 1: You should have a deployed Move smart contract with a module address (your deployer's hex address). You'll need this address later for the VITE_MODULE_ADDRESS environment variable.

Task: Update package.json with the versions specified below and install the packages.

IMPORTANT: Use these specific versions to ensure compatibility. Update your package.json dependencies section with these versions:

``json
{
  "dependencies": {
    "@cosmjs/amino": "0.36.0",
    "@cosmjs/crypto": "0.36.0",
    "@cosmjs/encoding": "0.36.0",
    "@cosmjs/math": "0.36.0",
    "@cosmjs/proto-signing": "0.36.0",
    "@cosmjs/stargate": "0.36.0",
    "@cosmjs/tendermint-rpc": "0.36.0",
    "@initia/initia.js": "^1.0.18",
    "@initia/initia.proto": "^1.0.3",
    "@initia/interwovenkit-react": "^2.0.6",
    "@privy-io/cross-app-connect": "0.2.3",
    "viem": "^2.38.6",
    "wagmi": "^2.19.2"
  },
  "devDependencies": {
    "vite-plugin-node-polyfills": "0.24.0"
  }
}
``

Note: 
- @cosmjs packages use exact versions (no ^ prefix) to avoid compatibility issues with CosmJS imports
- @initia/interwovenkit-react, viem, and wagmi use ^ prefix for flexibility
- @privy-io/cross-app-connect is a peer dependency of @initia/interwovenkit-react

Steps:
1. Navigate to the web-app directory: cd web-app
2. Edit package.json and update the dependencies section with the versions above
3. Run: pnpm install (or npm install or yarn install)
4. Verify that the correct versions are installed (check package.json and node_modules)
```

**After pasting the prompt:**

1. Your AI assistant will update `package.json` with the specified versions
2. Run `pnpm install` (or `npm install` or `yarn install`)
3. **Verify:** Check that correct versions are installed (@cosmjs packages should have exact versions, @initia/interwovenkit-react, viem, and wagmi can have ^ prefix)

### Verify Step 2

**Verify:** 
- `package.json` has exact versions (no `^` prefix) for all @cosmjs packages (0.36.0)
- `@initia/interwovenkit-react` is set to `^2.0.6`
- `viem` is set to `^2.38.6` and `wagmi` is set to `^2.19.2`
- `@privy-io/cross-app-connect` is set to `0.2.3`
- `vite-plugin-node-polyfills` is set to `0.24.0` in devDependencies
- All packages installed successfully without errors
- `node_modules` directory contains the installed packages

**Next Step:** Once dependencies are installed, proceed to Step 3 to configure the frontend build tools.

## Step 3: Configure Frontend Build Tools

Configure Vite and environment variables to support Initia SDK and CosmJS imports.

> **Context from Step 1:** You should have a deployed Move smart contract with a module address (your deployer's hex address, e.g., `0x55037BEEC8E307FA9D48C2D7121E170BE9517C14`). You'll need this address for the `VITE_MODULE_ADDRESS` environment variable.
> **Context from Step 2:** You should have all frontend dependencies installed with exact versions.

### Copy This Prompt

Copy and paste this prompt into your AI coding assistant:

```
Configure the frontend build tools for an Initia dApp frontend.

Context from Step 1: You have a deployed Move smart contract with a module address (your deployer's hex address). You'll need this for VITE_MODULE_ADDRESS.
Context from Step 2: All frontend dependencies are installed with exact versions.

Tasks:
1. Update vite.config.ts with the complete configuration below to fix CosmJS imports and add Node polyfills
2. Create/update .env file in web-app/ directory with the required environment variables

Vite Configuration:
REQUIRED: Replace the entire contents of vite.config.ts with this configuration:

``typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import viteTsConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteTsConfigPaths(), nodePolyfills()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'fix-cosmjs-imports',
          setup(build) {
            build.onResolve({ filter: /@cosmjs\/amino\/build\/.+\.js$/ }, (args) => {
              const modulePath = args.path.replace(
                '@cosmjs/amino',
                path.join(process.cwd(), 'node_modules', '@cosmjs', 'amino')
              );
              return {
                path: modulePath,
              };
            });
          },
        },
      ],
    },
  },
});
``

Environment Variables:
Create or update .env file in web-app/ directory with:

``env
VITE_REST_URL=https://rest.testnet.initia.xyz
VITE_CHAIN_ID=initiation-2
VITE_MODULE_ADDRESS=<your_deployed_module_address>
VITE_GAS_PRICES=0.015uinit
``

Replace <your_deployed_module_address> with your actual deployed module address from Step 1.

Steps:
1. Update vite.config.ts with the configuration above
2. Create/update .env file in web-app/ directory with the environment variables
3. Verify the configuration by checking that vite.config.ts includes nodePolyfills() plugin and the fix-cosmjs-imports esbuild plugin
```

**After pasting the prompt:**

1. Your AI assistant will update `vite.config.ts` with the complete configuration
2. Your AI assistant will create/update the `.env` file with the required environment variables
3. **Verify:** 
   - `vite.config.ts` includes `nodePolyfills()` plugin and the `fix-cosmjs-imports` esbuild plugin
   - `.env` file exists in `web-app/` directory with all required variables
   - `VITE_MODULE_ADDRESS` is set to your deployed module address

### Verify Step 3

**Verify:** 
- `vite.config.ts` has the complete configuration with node polyfills and CosmJS import fixes
- `.env` file exists in `web-app/` directory with all required environment variables
- `VITE_MODULE_ADDRESS` matches your deployed contract address from Step 1

**Next Step:** Once build tools are configured, proceed to Step 4 to setup wallet integration.

## Step 4: Setup Wallet Integration

Setup InterwovenKit provider to enable wallet connection and transaction signing in your frontend.

> **Context from Step 1:** You should have a deployed Move smart contract with a module address. The contract should have functions: `create_game`, `accept_game`, `reject_game`, `cancel_game`, `make_move`, `view_game`, `game_exists`, and `get_game_as_player_o`.
> **Context from Step 3:** You should have `vite.config.ts` configured and `.env` file set up with your module address.

> **Docs:** See [INITIA_MOVE_DEVELOPMENT_GUIDE.md#3-setup-interwovenkit-provider](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md#3-setup-interwovenkit-provider) for step-by-step provider setup, [interwovenkit-provider.md](./developer-guides/interwovenkit/references/interwovenkit-provider.md) for provider configuration details, and [useinterwovenkit.md](./developer-guides/interwovenkit/references/useinterwovenkit.md) for hook usage and account information.

### Copy This Prompt

Copy and paste this prompt into your AI coding assistant:

```
Setup InterwovenKit wallet integration for an Initia dApp frontend.

Context from Step 1: You have a deployed Move smart contract with module address configured in VITE_MODULE_ADDRESS.
Context from Step 3: vite.config.ts and .env file are configured.

Task: Create the InterwovenKit provider wrapper, integrate it into the app, and add a wallet connection component.

Follow these steps:

1. Create src/providers/interwovenkit-provider.tsx:
   - Import QueryClientProvider from @tanstack/react-query
   - Import queryClient from your app's query utilities (e.g., @/utils/query)
   - Import InterwovenKitProvider and TESTNET from @initia/interwovenkit-react
   - Import InterwovenKitStyles and injectStyles
   - Create InterwovenKitProviderWrapper component that wraps children with QueryClientProvider, WagmiProvider, and InterwovenKitProvider using TESTNET config
   - **Important:** Wrap WagmiProvider with QueryClientProvider (WagmiProvider requires QueryClientProvider as a parent)
   - Inject InterwovenKit styles

2. Create src/config/wagmi.ts:
   - Configure wagmi with Initia testnet chain ID (0x2329 for initiation-2)
   - Set up proper chain configuration

3. Update main.tsx:
   - Import InterwovenKitProviderWrapper
   - Wrap the app with InterwovenKitProviderWrapper
   - Add Toaster component for notifications (if not already present)

4. Create src/components/wallet-connection.tsx:
   - Import useInterwovenKit hook from @initia/interwovenkit-react
   - Use the hook to get: address, username, isConnected, openConnect, openWallet
   - When not connected: Show a "Connect Wallet" button that calls openConnect()
   - When connected: Show the connected address (or username if available) with a button to open wallet drawer (openWallet())
   - Use existing UI components from src/components/ui/ (Button, Badge, Tooltip, etc.)
   - Add copy-to-clipboard functionality for the address
   - Format address display (truncate middle if needed, e.g., "init1...xyz" or "0x1234...5678")
   - Show username badge if available, otherwise show truncated address

5. Update src/pages/index.tsx:
   - Import and add the WalletConnection component at the top of the page
   - This allows users to connect their wallet before interacting with the game

Reference these docs for implementation:
- developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md#3-setup-interwovenkit-provider (step-by-step setup guide)
- developer-guides/interwovenkit/references/interwovenkit-provider.md (provider configuration)
- developer-guides/interwovenkit/references/useinterwovenkit.md (hook usage and account information)
- developer-guides/interwovenkit/native-integrations.md (wallet connection examples)

The provider should use TESTNET configuration for testnet development.
```

**After pasting the prompt:**

1. Your AI assistant will create `src/providers/interwovenkit-provider.tsx` with the provider wrapper
2. Your AI assistant will create `src/config/wagmi.ts` with Initia testnet configuration
3. Your AI assistant will update `main.tsx` to wrap the app with `InterwovenKitProviderWrapper`
4. Your AI assistant will create `src/components/wallet-connection.tsx` with wallet connection UI
5. Your AI assistant will update `src/pages/index.tsx` to include the wallet connection component
6. **Verify:** 
   - `main.tsx` wraps the app with `InterwovenKitProviderWrapper`
   - **QueryClientProvider wraps WagmiProvider** in the provider (required - prevents "No QueryClient set" error)
   - Provider uses TESTNET configuration
   - Toaster component is included for notifications
   - Component shows "Connect Wallet" button when not connected
   - Component shows connected address/username when connected
   - Clicking "Connect Wallet" opens the InterwovenKit connection drawer
   - Clicking the connected address opens the wallet drawer

### Verify Step 4

**Verify:** 
- `src/providers/interwovenkit-provider.tsx` exists and exports `InterwovenKitProviderWrapper`
- **QueryClientProvider wraps WagmiProvider** (required - WagmiProvider needs QueryClientProvider as parent)
- `src/config/wagmi.ts` exists with correct chain ID configuration
- `main.tsx` wraps the app with `InterwovenKitProviderWrapper`
- `src/components/wallet-connection.tsx` exists with connect/disconnect UI
- `src/pages/index.tsx` includes the wallet connection component
- "Connect Wallet" button appears when wallet is not connected
- Connected address/username displays when wallet is connected
- Clicking buttons opens the appropriate InterwovenKit drawers
- You can import and use `useInterwovenKit` hook in components (will test in next step)

**Next Step:** Once wallet connection flow is working, proceed to Step 5 to build the frontend UI and connect to your smart contract.

## Step 5: Build Frontend UI and Connect to Contract

Build the React frontend UI and integrate it with your deployed smart contract using InterwovenKit and the Initia SDK.

> **Context from Step 1:** You should have a deployed Move smart contract with a module address (your deployer's hex address, e.g., `0x55037BEEC8E307FA9D48C2D7121E170BE9517C14`). The contract should have functions: `create_game`, `accept_game`, `reject_game`, `cancel_game`, `make_move`, `view_game`, `game_exists`, and `get_game_as_player_o`.
> **Context from Step 4:** You should have InterwovenKit provider setup and wallet integration configured.

> **Docs:** See [useinterwovenkit.md](./developer-guides/interwovenkit/references/useinterwovenkit.md) for wallet hooks and transaction methods, [sending-transactions.md](./developer-guides/tools/sdks/initia-js/transactions/sending-transactions.md) for transaction sending patterns, [messages.md](./developer-guides/tools/sdks/initia-js/transactions/messages.md) for message creation (MsgExecute for Move contracts), and [native-integrations.md](./developer-guides/interwovenkit/native-integrations.md) for Initia-specific features.

### Copy This Prompt

Copy and paste this prompt into your AI coding assistant:

```
Build a React frontend interface for the tic-tac-toe game smart contract deployed on Initia.

Context from Step 1: You have a deployed Move smart contract with a module address (your deployer's hex address). The contract has functions: create_game, accept_game, reject_game, cancel_game, make_move, view_game, game_exists, and get_game_as_player_o. The module address is configured in VITE_MODULE_ADDRESS.
Context from Step 4: InterwovenKit provider is setup and wallet integration is configured.

Core Requirements:
1. Display a 3x3 game board grid
2. Show current game state (board, current player, game status)
3. Allow players to make moves by clicking on board positions
4. Display game status messages (waiting for player, game won, draw, etc.)
5. Show player addresses (X and O) with clear indicators showing which player is the current user
6. Handle wallet connection using InterwovenKit (already setup in Step 4)
7. Use the @initia/initia.js SDK to interact with the smart contract

Game Invitation Management:
1. Invitation Card (for Player O only):
   - Show a prominent invitation card when Player O receives a pending game invitation
   - Display Player X's address with copy-to-clipboard functionality
   - Provide "Accept Game" and "Reject Game" buttons
   - Only show for Player O (not Player X who created the game)
   - Must work even when viewing a different/completed game

2. Game State Handling:
   - PENDING: Show invitation card for Player O, "Waiting for Player O to accept" for Player X
   - ACTIVE: Show game board, allow moves, display current turn
   - WON/DRAW/REJECTED: Show final status, allow starting new game

3. Multiple Game Scenarios:
   - Viewing a completed game while having a pending invitation: Show invitation card above completed game
   - Viewing another player's game: Show "View My Games" button to return to own games
   - No active game: Show "Create New Game" form
   - Finished game: Show "Start New Game" button to reset and create new game

4. Bidirectional Game Lookup:
   - Use get_game_as_player_o to find games where current user is Player O
   - Auto-populate game view when user is Player O in a pending/active game
   - Query gameAsPlayerO separately from current game view to detect invitations even when viewing other games

5. Address Display:
   - Show full addresses (don't truncate)
   - Add copy-to-clipboard icon next to all displayed addresses
   - Use tooltips for copy functionality
   - Highlight current user's role (Player X or Player O) with badges

6. Game Actions:
   - Cancel Game: Available for both Player X and Player O (only for active/pending games)
   - Start New Game: Show when game is finished or no game exists
   - View My Games: Show when viewing another player's game
   - Create New Game: Show form when no game exists for current user as Player X

Technical Details:
- Use the existing web-app template structure (already set up with Vite + React + TypeScript)
- Create the UI in web-app/src/pages/index.tsx or a new page component
- Use shadcn/ui components from web-app/src/components/ui/ (Button, Card, Badge, Tooltip, etc.)
- Use InterwovenKit hooks (useInterwovenKit) for wallet connection and transactions
- Use TanStack Query for data fetching and state management with proper query keys
- Follow the existing code patterns in the web-app directory

Smart Contract Integration:
- The smart contract module address is available via environment variable VITE_MODULE_ADDRESS
- Contract functions to implement:
  - view_game(player_x_address): Query game state
  - game_exists(player_x_address): Check if game exists
  - get_game_as_player_o(player_o_address): Find Player X address if user is Player O
  - create_game(opponent_address): Create new game (signer becomes Player X, status = PENDING)
  - accept_game(player_x_address): Player O accepts invitation (status = ACTIVE)
  - reject_game(player_x_address): Player O rejects invitation (status = REJECTED)
  - cancel_game(player_x_address): Cancel game (available to both players)
  - make_move(player_x_address, position): Make a move (only when status = ACTIVE)

Address Handling:
- Contract returns hex addresses (0x...)
- Wallet may return bech32 addresses (init1...)
- Normalize addresses for comparison (convert bech32 to hex, extract last 40 hex chars)
- Use normalizeAddressForComparison helper for all address comparisons

Query Strategy:
- Always query gameAsPlayerO (even when viewing a game) to detect pending invitations
- Query pending invitation game separately to check its status
- Use refetchInterval (5 seconds) for real-time updates
- Properly handle loading and error states

UI State Management:
- Track viewGameAddress for viewing specific games
- Track playerXAddress for querying games
- Use forceShowCreateGame flag to show create form after game completion
- Reset state properly when accepting/rejecting/canceling games

Reference these docs for implementation patterns:
- developer-guides/interwovenkit/references/useinterwovenkit.md (wallet hooks, transaction methods)
- developer-guides/tools/sdks/initia-js/transactions/sending-transactions.md (transaction sending patterns)
- developer-guides/tools/sdks/initia-js/transactions/messages.md (message creation, especially MsgExecute for Move contracts)
- developer-guides/interwovenkit/native-integrations.md (Initia-specific features)
- Existing components in web-app/src/components/ui/ (shadcn components)
```

**After pasting the prompt:**

1. Your AI assistant will generate:
   - Complete React frontend with smart contract integration
   - Address normalization utilities in `src/utils/address.ts`
   - Smart contract hooks in `src/hooks/useTicTacToe.ts`
   - Game UI in `src/pages/index.tsx`
   - All components use InterwovenKit for wallet and @initia/initia.js for contract calls

2. **Verify:** 
   - Frontend builds (`cd web-app && pnpm dev`) and renders at http://localhost:5173
   - Game board UI and wallet connect button are visible
   - Connect wallet and test creating a game - wallet should prompt for signing and UI should update

### Verify Step 5

**Verify:** 
- Frontend builds and renders at http://localhost:5173
- Game board UI and wallet connect button are visible
- Connect wallet and test creating a game - wallet should prompt for signing and UI should update
- All game flows work: create game, accept/reject invitations, make moves, view completed games

> **Wallet setup:** See [interwovenkit-provider.md](./developer-guides/interwovenkit/references/interwovenkit-provider.md) for provider configuration.
> **SDK reference:** See [sending-transactions.md](./developer-guides/tools/sdks/initia-js/transactions/sending-transactions.md) and [messages.md](./developer-guides/tools/sdks/initia-js/transactions/messages.md) for transaction patterns.

**Next Step:** Once the frontend is built and connected, proceed to Step 6 to test your complete application.

## Step 6: Test Your Complete Application

Test your complete dApp end-to-end to ensure everything works correctly.

> **Context from Step 5:** You should have a fully functional React frontend that connects to your deployed smart contract. The frontend should include wallet connection, game board UI, invitation management (accept/reject), and all game actions (create, move, cancel). The `.env` file should be configured with your module address and network settings.

**Verify:** 
- Start dev server (`cd web-app && pnpm dev`)
- Connect wallet with two different accounts (or use two browser windows)
- Test complete game flow:
  1. Account 1 creates game inviting Account 2
  2. Account 2 sees invitation card and accepts
  3. Both players make moves
  4. Game completes (win or draw)
  5. Test starting a new game after completion
  6. Test viewing completed games while having pending invitations
- Check browser console for errors
- Verify all game states display correctly (PENDING, ACTIVE, WON, DRAW, REJECTED)

## Troubleshooting

### Common Frontend Issues

#### 1. CosmJS Import Errors
**Error:** `Missing "./build/signdoc.js" specifier in "@cosmjs/amino" package` or `Cannot read file: .../signdoc.js`

**Solution:**
- Ensure you're using exact versions (without `^`): `@cosmjs/amino: "0.36.0"` (see Step 2)
- Update `vite.config.ts` with the complete configuration shown in Step 3
- Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install`
- Make sure `vite-plugin-node-polyfills` is installed (Step 2)

#### 2. Package Version Conflicts
**Error:** Peer dependency warnings or version mismatches

**Solution:**
- Use **exact versions** (no `^` prefix) for these packages (see Step 2):
  - `@cosmjs/*` packages: `0.36.0` (amino, crypto, encoding, math, proto-signing, stargate, tendermint-rpc)
- Use **^ prefix** for these packages (see Step 2):
  - `@initia/interwovenkit-react`: `^2.0.6`
  - `viem`: `^2.38.6`
  - `wagmi`: `^2.19.2`
- Ensure `@privy-io/cross-app-connect` is set to `0.2.3`
- Clean install: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

#### 3. Dev Server Won't Start
**Symptoms:** Vite fails to start or crashes immediately

**Solution:**
- Check all package versions match the ones specified in Step 2
- Verify `vite.config.ts` has the complete configuration with node polyfills (Step 3)
- Clear Vite cache: `rm -rf node_modules/.vite`
- Try deleting and reinstalling: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

#### 4. Wallet Connection Issues
**Error:** Wallet doesn't connect or throws errors

**Solution:**
- Verify `InterwovenKitProviderWrapper` is properly set up in `main.tsx` (Step 4)
- Check `wagmi.ts` config has correct chain ID (`0x2329` for initiation-2) (Step 4)
- Ensure `.env` file has correct `VITE_CHAIN_ID` and `VITE_REST_URL` (Step 3)
- Check browser console for specific error messages
- See [interwovenkit-provider.md](./developer-guides/interwovenkit/references/interwovenkit-provider.md) for provider configuration

#### 5. Contract Call Failures
**Error:** Transactions fail or contract queries return errors

**Solution:**
- Verify `VITE_MODULE_ADDRESS` in `.env` matches your deployed contract address (Step 3)
- Ensure address normalization is working (check `utils/address.ts`) (Step 5)
- Check contract functions match your deployed contract (function names, parameter types)
- Verify gas prices are set correctly: `VITE_GAS_PRICES=0.015uinit` (Step 3)

### General Tips
- Always check browser console for detailed error messages
- Use `console.log()` to debug address normalization and contract calls
- Test with Initia testnet faucet tokens before troubleshooting
- Verify your `.env` file is in the correct location (`web-app/.env`)

> **More Help:** See [INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md) for Move contract issues, [README.md](./README.md#getting-help) for general help, or the relevant guides in [developer-guides/](./developer-guides/) for specific topics.

## Next Steps

Now that you've built your first complete application, explore these template resources to build more:

### Extend Your Skills

| Goal | Resource | What You'll Learn |
|------|----------|-------------------|
| Better prompts | [`PROMPTING_GUIDE.md`](./PROMPTING_GUIDE.md) | Advanced prompting techniques |
| More examples | [`prompt-example.md`](./prompt-example.md) | Different app types |
| Deep Move knowledge | [`INITIA_MOVE_DEVELOPMENT_GUIDE.md`](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md) | Advanced patterns |
| Deploy your own chain | [`INITIA_ROLLUP_DEPLOYMENT_GUIDE.md`](./developer-guides/INITIA_ROLLUP_DEPLOYMENT_GUIDE.md) | Custom rollup deployment |
| Advanced wallet features | [`developer-guides/interwovenkit/`](./developer-guides/interwovenkit/) | Multi-chain, IBC transfers |
| IBC Hooks | [`ibc-hooks.md`](./developer-guides/vm-specific-tutorials/movevm/ibc-hooks.md) | Cross-chain messaging |

### Customize Your App

The prompts in this guide are starting points. Modify them to:
- Add new game features (replay, leaderboards, betting)
- Change the game entirely (checkers, connect-four)
- Add multiplayer matchmaking
- Integrate with other Initia ecosystem features

Your AI assistant will use the template's documentation to generate accurate, Initia-specific code for whatever you build next.


