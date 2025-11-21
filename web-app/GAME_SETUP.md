# Tic-Tac-Toe Web App Setup

This is a web application for playing Tic-Tac-Toe on the Initia blockchain using MoveVM smart contracts.

## Prerequisites

- Node.js 22+ installed
- Access to Initia testnet wallet
- Testnet tokens (from [Initia Faucet](https://v1.app.testnet.initia.xyz/faucet))

## Installation

1. Install dependencies:

```bash
cd web-app
pnpm install
```

2. Create a `.env` file in the `web-app` directory:

```env
# REST URL for queries (LCD endpoint)
VITE_REST_URL=https://rest.testnet.initia.xyz

# Chain ID (initiation-2 = Move rollup testnet)
VITE_CHAIN_ID=initiation-2

# Your deployed Tic-Tac-Toe module address
VITE_MODULE_ADDRESS=0xa074bebd5af4f6d50750ad57d334bd980b23569d

# Gas prices
VITE_GAS_PRICES=0.015uinit
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser to `http://localhost:5173`

## How to Play

### Step 1: Connect Your Wallet

1. Click the "Connect Wallet" button
2. Choose your wallet provider
3. Authorize the connection

### Step 2: Create or Join a Game

#### Creating a New Game

1. In the "Game Controls" card, go to the "Create Game" tab
2. Enter the address of your opponent (Player O)
   - Must be a valid Initia address (starts with `init1...`) or hex address (`0x...`)
3. Click "Create New Game"
4. Approve the transaction in your wallet
5. Wait for confirmation

You will be **Player X** and make the first move.

#### Joining an Existing Game

1. In the "Game Controls" card, go to the "Load Game" tab
2. Enter the address of the player who created the game (Player X)
3. Click "Load Game"
4. The game board will load with the current state

You can be either Player X or Player O, depending on which address you use.

### Step 3: Make Moves

1. Wait for your turn (shown in the "Game Status" card)
2. Click on an empty cell in the game board
3. Approve the transaction in your wallet
4. Wait for the move to be confirmed on-chain
5. The game will automatically refresh to show the updated state

### Game Status

The **Game Status** card shows:

- **Game Status**: Active, X Won, O Won, or Draw
- **Players**: Addresses of Player X and Player O (with "You" badge for your address)
- **Moves Made**: Total number of moves played
- **Your Symbol**: X or O
- **Your Turn**: Whether it's your turn to move
- **Turn Indicator**: Visual indicator of whose turn it is

### Board Layout

The game board follows this position mapping:

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

- **X** is displayed in blue
- **O** is displayed in red
- Empty cells are clickable when it's your turn
- Disabled cells show when it's not your turn or the game is over

## Features

✅ **Wallet Integration**: Connect with Initia wallet using InterwovenKit
✅ **Create Games**: Start a new game with any opponent
✅ **Join Games**: Load and play existing games
✅ **Real-time Updates**: Game state refreshes automatically every 3 seconds during active games
✅ **Move Validation**: Smart contract ensures valid moves and turn order
✅ **Win Detection**: Automatic detection of winning combinations and draws
✅ **Transaction Feedback**: Toast notifications for all blockchain interactions
✅ **Responsive Design**: Works on desktop and mobile devices
✅ **Copy Addresses**: Easy copying of player addresses to share with friends

## Smart Contract Details

- **Module Address**: `0xa074bebd5af4f6d50750ad57d334bd980b23569d`
- **Network**: Initia Testnet (initiation-2)
- **View Functions**:
  - `view_game`: Get current game state
  - `game_exists`: Check if a game exists for an address
  - `get_status_string`: Get game status as a string
- **Entry Functions**:
  - `create_game`: Create a new game
  - `make_move`: Make a move in an existing game

## Architecture

### Components

- **GameBoard**: Displays the 3x3 tic-tac-toe grid
- **GameStatus**: Shows game information, player details, and turn status
- **GameControls**: Provides UI for creating and loading games

### Contract Service (`src/lib/contract.ts`)

- Handles all interactions with the Move smart contract
- Provides query functions for reading game state
- Creates message objects for transactions
- Manages address encoding and format conversion

### Providers

- **InterwovenProvider**: Wallet connection and transaction management
- **QueryProvider**: React Query for data fetching and caching
- **ThemeProvider**: Dark/light mode support

## Troubleshooting

### "Failed to create game"

- Ensure you have sufficient testnet tokens
- Check that the opponent address is valid and different from yours
- Verify the module address is correct in `.env`

### "Failed to make move"

- Make sure it's your turn
- Check that the cell is empty
- Ensure the game is still active (not won or drawn)
- Verify you have enough tokens for gas fees

### "No active game found"

- The game owner address might be incorrect
- The game might not have been created yet
- Check the transaction was confirmed on-chain

### Game not updating

- Refresh the page
- Check your network connection
- The game auto-refreshes every 3 seconds during active games

## Development

### Tech Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **InterwovenKit**: Initia wallet integration
- **@initia/initia.js**: Initia SDK
- **@tanstack/react-query**: Data fetching
- **sonner**: Toast notifications

### Project Structure

```
web-app/
├── src/
│   ├── components/
│   │   ├── game/              # Game-specific components
│   │   │   ├── GameBoard.tsx
│   │   │   ├── GameStatus.tsx
│   │   │   └── GameControls.tsx
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── contract.ts        # Smart contract interaction
│   │   └── utils.ts
│   ├── pages/
│   │   └── index.tsx          # Main game page
│   ├── providers/             # React context providers
│   └── main.tsx
├── .env                       # Environment variables
└── package.json
```

## Next Steps

- Deploy your own version of the smart contract
- Customize the UI theme and styling
- Add game history and statistics
- Implement multiplayer matchmaking
- Add spectator mode for watching games

## Resources

- [Initia Documentation](https://docs.initia.xyz)
- [MoveVM Guide](https://move-language.github.io/move/)
- [InterwovenKit Docs](https://docs.initia.xyz/interwovenkit)
- [Smart Contract Source](../tictactoe/sources/tictactoe.move)
- [Deployment Info](../tictactoe/DEPLOYMENT_INFO.md)

## Support

For issues or questions:
- Check the [Initia Discord](https://discord.gg/initia)
- Review the deployment logs in `../tictactoe/DEPLOYMENT_INFO.md`
- Verify your setup follows the guide in `../developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md`

