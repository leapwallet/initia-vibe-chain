# Initia Vibe Chain

A decentralized application built on Initia blockchain with MoveVM smart contracts and a React web application.

## Quick Start

### Prerequisites

- Node.js (v22 or higher)
- pnpm (package manager)

### Starting the Local Server

1. **Navigate to the web-app directory:**

   ```bash
   cd web-app
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `web-app` directory:

   ```env
   VITE_REST_URL=https://rest.testnet.initia.xyz
   VITE_CHAIN_ID=initiation-2
   VITE_MODULE_ADDRESS=0xa074bebd5af4f6d50750ad57d334bd980b23569d
   VITE_GAS_PRICES=0.015uinit
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

5. **Access the application:**

   Open your browser and navigate to `http://localhost:5173`

## Project Structure

```text
initia-vibe-chain/
├── web-app/          # React frontend application
├── tictactoe/        # Move smart contracts
└── developer-guides/ # Documentation and guides
```

## Tic-Tac-Toe Smart Contract

The `tictactoe/` directory contains a fully on-chain tic-tac-toe game implementation using Move language on Initia blockchain.

### Features

- **Complete Game Logic**: Full tic-tac-toe implementation with win/draw detection
- **Two-Player Games**: Player X creates game and invites Player O
- **Move Validation**: Enforces turn order, position validity, and game rules
- **On-Chain Storage**: Game state stored in Move resources
- **View Functions**: Query game state without transactions

### Game Functions

**Entry Functions (Transactions):**

- `create_game(player_x: &signer, player_o_addr: address)` - Player X creates a new game
- `make_move(player: &signer, game_owner: address, position: u8)` - Place X or O at position (0-8)

**View Functions (Queries):**

- `view_game(game_owner: address)` - Returns complete game state
- `game_exists(game_owner: address)` - Check if a game exists
- `get_status_string(game_owner: address)` - Returns game status (0=active, 1=X won, 2=O won, 3=draw)

### Board Position Mapping

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

### Building and Deploying

**Prerequisites:**

- `initiad` CLI installed
- Testnet account with funds

**Build the contract:**

```bash
cd tictactoe
initiad move build
```

**Deploy the contract:**

```bash
# Set environment variables
export RPC_URL=https://rpc.testnet.initia.xyz
export CHAIN_ID=initiation-2
export GAS_PRICES=0.015uinit

# Deploy
initiad move deploy \
  --path . \
  --upgrade-policy COMPATIBLE \
  --from your-key \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices $GAS_PRICES \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  -y
```

**Note:** Before building, update `Move.toml` with your hex address:

```toml
[addresses]
std = "0x1"
tictactoe = "0xYOUR_HEX_ADDRESS_HERE"
```

### Deployed Contract

- **Module Address**: `0xa074bebd5af4f6d50750ad57d334bd980b23569d`
- **Module Name**: `tictactoe`
- **Network**: Initia Testnet (initiation-2)
- **Transaction**: [View on Explorer](https://scan.testnet.initia.xyz/tx/DCE7116796349F8B967306559D9887E6468898B676925D641C841B51A2FBE03A)

### Usage Examples

**Create a game:**

```bash
export MODULE_ADDR=0xa074bebd5af4f6d50750ad57d334bd980b23569d
export PLAYER_O_ADDR=init1jeds7rrzf33k5e0dh0hcdkhh3cf29km5f0us4q

initiad tx move execute $MODULE_ADDR tictactoe create_game \
  --args "[\"address:$PLAYER_O_ADDR\"]" \
  --from playerx \
  --node https://rpc.testnet.initia.xyz \
  --gas-prices 0.015uinit \
  -y
```

**Make a move:**

```bash
# Player X moves to position 4 (center)
initiad tx move execute $MODULE_ADDR tictactoe make_move \
  --args "[\"address:$PLAYER_X_ADDR\", \"u8:4\"]" \
  --from playerx \
  --node https://rpc.testnet.initia.xyz \
  --gas-prices 0.015uinit \
  -y
```

**Query game state:**

```bash
initiad query move view $MODULE_ADDR tictactoe view_game \
  --args "[\"address:$PLAYER_X_ADDR\"]" \
  --node https://rpc.testnet.initia.xyz
```

For detailed smart contract documentation, see [tictactoe/README.md](./tictactoe/README.md) and [DEPLOYMENT_INFO.md](./tictactoe/DEPLOYMENT_INFO.md).

## Additional Commands

### Web App Development

```bash
cd web-app

# Run development server
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

## Documentation

- [Web App README](./web-app/README.md) - Detailed web app documentation
- [Tic-Tac-Toe Smart Contract](./tictactoe/README.md) - Smart contract documentation
- [Deployment Info](./tictactoe/DEPLOYMENT_INFO.md) - Contract deployment details
- [Game Setup Guide](./web-app/GAME_SETUP.md) - Game setup instructions
- [Move Development Guide](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md) - Smart contract development
- [InterwovenKit Docs](./developer-guides/interwovenkit/) - Wallet integration guide

## Resources

- [Initia Documentation](https://docs.initia.xyz)
- [Initia Testnet](https://rest.testnet.initia.xyz)
