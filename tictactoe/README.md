# Tic-Tac-Toe Smart Contract on Initia MoveVM

A fully on-chain tic-tac-toe game implementation using Move language on Initia blockchain.

## Features

- **Complete Game Logic**: Full tic-tac-toe implementation with win/draw detection
- **Two-Player Games**: Player X creates game and invites Player O
- **Move Validation**: Enforces turn order, position validity, and game rules
- **On-Chain Storage**: Game state stored in Move resources
- **View Functions**: Query game state without transactions

## Game State

The game stores:
- 3x3 board (9 cells: 0=empty, 1=X, 2=O)
- Player X and Player O addresses
- Current turn indicator
- Game status (active/X won/O won/draw)
- Move counter

## Functions

### Entry Functions (Transaction)

**`create_game(player_x: &signer, player_o_addr: address)`**
- Player X creates a new game and specifies Player O's address
- Initializes empty 3x3 board with X going first
- Game stored in Player X's account

**`make_move(player: &signer, game_owner: address, position: u8)`**
- Place X or O at position (0-8)
- Position mapping:
  ```
  0 | 1 | 2
  ---------
  3 | 4 | 5
  ---------
  6 | 7 | 8
  ```
- Validates: player's turn, position empty, game active
- Automatically checks for winner/draw after each move

### View Functions (Query)

**`view_game(game_owner: address): GameView`**
- Returns complete game state including board, players, status

**`game_exists(game_owner: address): bool`**
- Check if a game exists for the given address

**`get_status_string(game_owner: address): u8`**
- Returns game status: 0=active, 1=X won, 2=O won, 3=draw

## Deployment Instructions

### 1. Setup Environment

```bash
# Set environment variables
export RPC_URL=https://rpc.testnet.initia.xyz
export CHAIN_ID=initiation-2
export GAS_PRICES=0.015uinit
```

### 2. Create/Import Keys

```bash
# Create new key
initiad keys add mykey

# Or import existing
initiad keys add mykey --recover

# Get your hex address
initiad keys show mykey --address  # Get bech32 address
initiad keys parse $(initiad keys show mykey --address)  # Convert to hex
```

### 3. Fund Account

Visit https://v1.app.testnet.initia.xyz/faucet and request testnet tokens

### 4. Update Move.toml

Replace `tictactoe = "_"` in [Move.toml](Move.toml) with your hex address:

```toml
[addresses]
std = "0x1"
tictactoe = "0xYOUR_HEX_ADDRESS_HERE"
```

### 5. Build Module

```bash
cd tictactoe
initiad move build
```

### 6. Deploy Module

```bash
initiad move deploy \
  --path . \
  --upgrade-policy COMPATIBLE \
  --from mykey \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices $GAS_PRICES \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  -y
```

## Usage Examples

### Create a New Game

```bash
export PLAYER_X_ADDR=$(initiad keys show playerx --address)
export PLAYER_O_ADDR=$(initiad keys show playero --address)
export MODULE_ADDR=0xYOUR_HEX_ADDRESS

# Player X creates game
initiad tx move execute $MODULE_ADDR tictactoe create_game \
  --args "[\"address:$PLAYER_O_ADDR\"]" \
  --from playerx \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  --gas-prices $GAS_PRICES \
  -y
```

### Make a Move

```bash
# Player X moves to position 4 (center)
initiad tx move execute $MODULE_ADDR tictactoe make_move \
  --args "[\"address:$PLAYER_X_ADDR\", \"u8:4\"]" \
  --from playerx \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  --gas-prices $GAS_PRICES \
  -y

# Player O moves to position 0 (top-left)
initiad tx move execute $MODULE_ADDR tictactoe make_move \
  --args "[\"address:$PLAYER_X_ADDR\", \"u8:0\"]" \
  --from playero \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  --gas-prices $GAS_PRICES \
  -y
```

### Query Game State

```bash
# View current game
initiad query move view $MODULE_ADDR tictactoe view_game \
  --args "[\"address:$PLAYER_X_ADDR\"]" \
  --node $RPC_URL

# Check if game exists
initiad query move view $MODULE_ADDR tictactoe game_exists \
  --args "[\"address:$PLAYER_X_ADDR\"]" \
  --node $RPC_URL

# Get game status
initiad query move view $MODULE_ADDR tictactoe get_status_string \
  --args "[\"address:$PLAYER_X_ADDR\"]" \
  --node $RPC_URL
```

## Game Rules

1. **Turn Order**: X goes first, then alternates between X and O
2. **Valid Moves**: Can only place marker in empty cells (0-8)
3. **Win Conditions**: 3-in-a-row horizontally, vertically, or diagonally
4. **Draw**: All 9 cells filled with no winner
5. **Game Over**: No more moves allowed after win or draw

## Error Codes

- `E_GAME_ALREADY_EXISTS (1)`: Game already exists for this player
- `E_GAME_NOT_FOUND (2)`: No game found at specified address
- `E_NOT_YOUR_TURN (3)`: It's not your turn to move
- `E_POSITION_OCCUPIED (4)`: Cell already contains X or O
- `E_INVALID_POSITION (5)`: Position must be 0-8
- `E_GAME_OVER (6)`: Game has already ended
- `E_INVALID_PLAYER (7)`: Player not part of this game

## Frontend Integration

See [INITIA_MOVE_DEVELOPMENT_GUIDE.md](../developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md) for complete frontend integration guide using InterwovenKit.

Key integration points:
- Use `@initia/interwovenkit-react` for wallet connection
- Use `@initia/initia.js` RESTClient for queries
- Use `MsgExecute` with BCS encoding for transactions

## Project Structure

```
tictactoe/
├── Move.toml              # Package configuration
├── sources/
│   └── tictactoe.move    # Main game contract
└── README.md             # This file
```

## License

MIT
