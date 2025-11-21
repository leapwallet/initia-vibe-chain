# Tic-Tac-Toe Module Deployment Information

## Deployment Details

- **Transaction Hash**: `DCE7116796349F8B967306559D9887E6468898B676925D641C841B51A2FBE03A`
- **Block Height**: 15727642
- **Timestamp**: 2025-11-03T12:03:42Z
- **Gas Used**: 237,258
- **Gas Wanted**: 360,169
- **Fee**: 5,403 uinit

## Module Information

- **Module Address**: `0xa074bebd5af4f6d50750ad57d334bd980b23569d`
- **Module Name**: `tictactoe`
- **Module ID**: `0xa074bebd5af4f6d50750ad57d334bd980b23569d::tictactoe`
- **Upgrade Policy**: COMPATIBLE (1)

## Account Information

### Deployer Account
- **Name**: deployer
- **Address (Bech32)**: `init15p6ta0267nmd2p6s44taxd9anq9jx45ayvuy3n`
- **Address (Hex)**: `0xA074BEBD5AF4F6D50750AD57D334BD980B23569D`
- **Mnemonic**: `rotate stay little grab whisper teach among leave improve pluck patch unusual rose hundred cable moon fiction spend crisp chuckle matrix rocket afraid dice`

### Player X Account
- **Name**: playerx
- **Address**: `init19rphstw5qwsl7kpnj49z6u48qfq58ks5d03a0k`
- **Mnemonic**: `armor shrimp author wedding car blush dilemma sock soap lucky maximum sausage buddy correct amazing poem volcano quit stick useless love biology poverty void`

### Player O Account
- **Name**: playero
- **Address**: `init1jeds7rrzf33k5e0dh0hcdkhh3cf29km5f0us4q`
- **Mnemonic**: `warfare horse outer correct innocent name sentence budget sun tip spice destroy spatial addict beach aerobic input stick vendor begin oil author order witness`

## Network Configuration

- **RPC URL**: https://rpc.testnet.initia.xyz
- **Chain ID**: initiation-2
- **Gas Prices**: 0.015uinit

## Usage Examples

### Create a Game

```bash
export MODULE_ADDR=0xa074bebd5af4f6d50750ad57d334bd980b23569d
export PLAYER_X_ADDR=init19rphstw5qwsl7kpnj49z6u48qfq58ks5d03a0k
export PLAYER_O_ADDR=init1jeds7rrzf33k5e0dh0hcdkhh3cf29km5f0us4q

initiad tx move execute $MODULE_ADDR tictactoe create_game \
  --args "[\"address:$PLAYER_O_ADDR\"]" \
  --from playerx \
  --keyring-backend test \
  --node https://rpc.testnet.initia.xyz \
  --gas-prices 0.015uinit \
  -y
```

### Make a Move

```bash
# Player X moves to position 4 (center)
initiad tx move execute $MODULE_ADDR tictactoe make_move \
  --args "[\"address:$PLAYER_X_ADDR\", \"u8:4\"]" \
  --from playerx \
  --keyring-backend test \
  --node https://rpc.testnet.initia.xyz \
  --gas-prices 0.015uinit \
  -y
```

### View Game State

```bash
initiad query move view $MODULE_ADDR tictactoe view_game \
  --args "[\"address:$PLAYER_X_ADDR\"]" \
  --node https://rpc.testnet.initia.xyz
```

### Check Game Status

```bash
initiad query move view $MODULE_ADDR tictactoe get_status_string \
  --args "[\"address:$PLAYER_X_ADDR\"]" \
  --node https://rpc.testnet.initia.xyz
```

## Status Values

- `0` = Active (game in progress)
- `1` = X Won
- `2` = O Won
- `3` = Draw

## Board Position Mapping

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

## Explorer Links

- **Transaction**: https://scan.testnet.initia.xyz/tx/DCE7116796349F8B967306559D9887E6468898B676925D641C841B51A2FBE03A
- **Module Address**: https://scan.testnet.initia.xyz/address/init15p6ta0267nmd2p6s44taxd9anq9jx45ayvuy3n

## Next Steps

1. Fund Player X and Player O accounts from the faucet: https://v1.app.testnet.initia.xyz/faucet
2. Create a game using Player X account
3. Make moves alternating between Player X and Player O
4. Query game state to see the board and game status
