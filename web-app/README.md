# Tic-Tac-Toe on Initia - Web App

A decentralized tic-tac-toe game built on Initia blockchain using MoveVM smart contracts.

## Quick Start

```bash
# Install dependencies
pnpm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env and add your module address

# Start development server
pnpm dev
```

Visit `http://localhost:5173` and connect your Initia wallet to start playing!

## Features

🎮 **Play On-Chain Tic-Tac-Toe**
- Create new games with any opponent
- Join and play existing games
- Real-time game state updates

🔗 **Blockchain Integration**
- Fully decentralized game logic on Initia
- Secure move validation via smart contracts
- Transaction confirmations and notifications

💳 **Wallet Integration**
- Connect with InterwovenKit
- Support for Initia testnet
- Easy transaction signing

🎨 **Modern UI**
- Responsive design for all devices
- Dark/light mode support
- Beautiful game board with animations
- Real-time status updates

## Environment Setup

Create a `.env` file:

```env
VITE_REST_URL=https://rest.testnet.initia.xyz
VITE_CHAIN_ID=initiation-2
VITE_MODULE_ADDRESS=0xa074bebd5af4f6d50750ad57d334bd980b23569d
VITE_GAS_PRICES=0.015uinit
```

## How to Play

1. **Connect Wallet**: Click "Connect Wallet" and authorize
2. **Create Game**: Enter opponent's address and create a new game
3. **Make Moves**: Click on empty cells when it's your turn
4. **Win**: Get three in a row - horizontally, vertically, or diagonally!

Or join an existing game by loading it with the game owner's address.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- InterwovenKit (Initia wallet integration)
- @initia/initia.js (Initia SDK)
- TanStack Query (data fetching)
- Sonner (notifications)

## Project Structure

```
src/
├── components/
│   └── game/              # Game components
│       ├── GameBoard.tsx  # 3x3 game grid
│       ├── GameStatus.tsx # Game info display
│       └── GameControls.tsx # Create/load game
├── lib/
│   └── contract.ts        # Smart contract integration
├── pages/
│   └── index.tsx          # Main game page
└── providers/             # React providers
```

## Documentation

For detailed setup and usage instructions, see [GAME_SETUP.md](./GAME_SETUP.md)

## Smart Contract

The game logic is powered by a Move smart contract deployed on Initia testnet.

- **Module**: `0xa074bebd5af4f6d50750ad57d334bd980b23569d::tictactoe`
- **Network**: Initia Testnet (initiation-2)
- **Source**: `../tictactoe/sources/tictactoe.move`

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format
```

## Resources

- [Smart Contract Details](../tictactoe/DEPLOYMENT_INFO.md)
- [Initia MoveVM Guide](../developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md)
- [InterwovenKit Docs](../developer-guides/interwovenkit/)
- [Initia Documentation](https://docs.initia.xyz)

## License

See LICENSE file in the root directory.
