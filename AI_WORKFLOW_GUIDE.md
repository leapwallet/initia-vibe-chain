# AI Workflow Guide - Building Your First Initia dApp

This guide demonstrates how to make best use of this template repository. Follow these steps to build a complete end-to-end application using AI coding assistants. Each step includes a ready-made prompt you can copy and paste into your AI assistant.

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
- [minitiad](https://docs.initia.xyz/developers/tools/clis/initiad-cli) CLI tool installed
- An Initia testnet account with testnet tokens (get from the [faucet](https://docs.initia.xyz/developers/introduction))

## Step 1: Build Your Smart Contract

Copy and paste this prompt into your AI coding assistant:

```
Build a fully on-chain tic-tac-toe game smart contract on Initia using MoveVM:

Core Requirements:

1. Game State: Store 3x3 board, player addresses (X/O), current turn, game status (active/won/draw)
2. Functions:
   - create_game: Initialize game between two players
   - make_move: Place X/O at position (0-8), validate turn & position
   - check_winner: Detect 3-in-a-row (rows/columns/diagonals) or draw
   - view_game: Query current board state
3. Storage Pattern: Use Move struct with key ability stored via move_to() in player accounts
4. Validation: Enforce alternating turns, prevent overwriting moves, check game-over states

Technical Details:
- Use #[view] for read-only functions
- Use public entry fun for transaction functions
- Include acquires clause when accessing resources
- Serialize arguments with BCS encoding for deployment

Development Steps:
1. Create the Move module file in sources/tictactoe.move
2. Configure Move.toml with your deployer address
3. Build: minitiad move build
4. Deploy: minitiad move deploy --upgrade-policy COMPATIBLE

Reference these guides for detailed patterns:
- developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md
- developer-guides/vm-specific-tutorials/movevm/building-move-modules.md
- developer-guides/vm-specific-tutorials/movevm/setting-up.md

Initia docs: https://docs.initia.xyz/developers/introduction
```

**After pasting the prompt:**

1. Your AI assistant will generate the Move smart contract code
2. Review the generated code and ensure it follows Initia Move patterns
3. Save the contract file (typically `sources/tictactoe.move`)
4. Configure `Move.toml` with your deployer address
5. Build the contract: `minitiad move build`
6. Deploy to testnet: `minitiad move deploy --upgrade-policy COMPATIBLE`
7. **Save your deployed module address** - you'll need it for the frontend integration

For detailed deployment instructions, see [INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md).

## Step 2: Build Your Frontend

Copy and paste this prompt into your AI coding assistant:

```
Build a React frontend interface for the tic-tac-toe game smart contract deployed on Initia.

Requirements:
1. Display a 3x3 game board grid
2. Show current game state (board, current player, game status)
3. Allow players to make moves by clicking on board positions
4. Display game status messages (waiting for player, game won, draw, etc.)
5. Show player addresses (X and O)
6. Handle wallet connection using InterwovenKit
7. Use the @initia/initia.js SDK to interact with the smart contract

Technical Details:
- Use the existing web-app template structure
- Create the UI in web-app/src/pages/index.tsx or a new page component
- Use shadcn/ui components from web-app/src/components/ui/
- Implement wallet connection using InterwovenKit (see developer-guides/interwovenkit/)
- Use TanStack Query for data fetching and state management
- Follow the existing code patterns in the web-app directory

The smart contract module address will be provided via environment variable VITE_MODULE_ADDRESS.

Reference:
- developer-guides/interwovenkit/ for wallet integration
- developer-guides/tools/sdks/initia-js/ for SDK usage
- Existing components in web-app/src/components/
```

**After pasting the prompt:**

1. Your AI assistant will generate the React frontend code
2. Review the generated components and ensure they match your smart contract interface
3. The code should use InterwovenKit for wallet connection
4. Ensure the frontend reads the module address from `VITE_MODULE_ADDRESS` environment variable
5. Test the UI components render correctly

For wallet integration details, see [developer-guides/interwovenkit/](./developer-guides/interwovenkit/).

## Step 3: Connect Everything Together

Copy and paste this prompt into your AI coding assistant:

```
Connect the React frontend to the deployed tic-tac-toe smart contract on Initia.

Requirements:
1. Read the module address from VITE_MODULE_ADDRESS environment variable
2. Use @initia/initia.js SDK to call smart contract functions:
   - view_game: Query current game state
   - create_game: Initialize a new game between two players
   - make_move: Submit a move to the smart contract
3. Handle transaction signing and submission
4. Update UI reactively when game state changes
5. Handle errors and loading states appropriately
6. Use TanStack Query for caching and state management

Technical Details:
- Initialize Initia client using VITE_REST_URL and VITE_CHAIN_ID from .env
- Use the wallet from InterwovenKit to sign transactions
- Parse BCS-encoded responses from view functions
- Handle transaction status and confirmations
- Update UI when transactions complete

The smart contract functions are:
- view_game(game_id: u64): Returns game state
- create_game(opponent: address): Creates new game
- make_move(game_id: u64, position: u8): Makes a move

Reference:
- developer-guides/tools/sdks/initia-js/transactions/ for transaction handling
- developer-guides/interwovenkit/ for wallet integration patterns
- Existing query utilities in web-app/src/utils/query/
```

**After pasting the prompt:**

1. Your AI assistant will generate the integration code
2. Ensure the code properly initializes the Initia client with environment variables
3. Verify transaction signing and submission work correctly
4. Test that the UI updates when game state changes
5. Update your `.env` file in `web-app/` directory:
   ```env
   VITE_REST_URL=https://rest.testnet.initia.xyz
   VITE_CHAIN_ID=initiation-2
   VITE_MODULE_ADDRESS=<your_deployed_module_address>
   VITE_GAS_PRICES=0.015uinit
   ```

For SDK usage details, see [developer-guides/tools/sdks/initia-js/](./developer-guides/tools/sdks/initia-js/).

## Testing Your Application

1. **Start the development server:**
   ```bash
   cd web-app
   pnpm dev
   ```

2. **Open your browser** to `http://localhost:5173`

3. **Connect your wallet** using InterwovenKit

4. **Test the game flow:**
   - Create a new game
   - Make moves on the board
   - Verify the game state updates correctly
   - Test win conditions and draw scenarios

5. **Check the browser console** for any errors or warnings

## Troubleshooting

**Smart contract not deploying:**
- Verify you have testnet tokens in your account
- Check that `Move.toml` has the correct deployer address
- Ensure the Move code compiles without errors

**Frontend not connecting:**
- Verify `.env` file has the correct module address
- Check that wallet is connected and on the correct network
- Ensure REST URL and chain ID match the testnet

**Transactions failing:**
- Verify you have sufficient gas (testnet tokens)
- Check that function signatures match your smart contract

## Next Steps

Now that you've built your first complete application, explore these resources:

- **[PROMPTING_GUIDE.md](./PROMPTING_GUIDE.md)** - Learn advanced prompting techniques for more complex applications
- **[prompt-example.md](./prompt-example.md)** - More example prompts for different use cases
- **[INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md)** - Deep dive into Move development
- **[INITIA_ROLLUP_DEPLOYMENT_GUIDE.md](./developer-guides/INITIA_ROLLUP_DEPLOYMENT_GUIDE.md)** - Deploy to your own custom rollup
- **[developer-guides/interwovenkit/](./developer-guides/interwovenkit/)** - Advanced wallet integration patterns

Customize your application by modifying the prompts to add new features or change the game logic. The AI assistant will help you extend the codebase based on your requirements.

