# Initia Rollup Deployment Guide

Complete guide for deploying Move contracts to custom Initia rollups using Weave CLI.

## Prerequisites

- **Weave CLI**: `brew install initia-labs/tap/weave` (macOS) or download from [releases](https://github.com/initia-labs/weave/releases)
- **initiad CLI**: Initia blockchain CLI ([installation guide](https://docs.initia.xyz))
- **Go**: v1.23+ for building tools
- **INIT tokens**: For L1 transactions (get from [faucet](https://v1.app.testnet.initia.xyz/faucet))
- **TIA tokens**: For Celestia DA (get from [faucet](https://faucet.celestia-mocha.com/))

## Quick Start

### 1. Initialize Weave

```bash
# Initialize and create gas station account
weave init

# Save the mnemonic shown - you'll need it for recovery
```

This creates:
- Gas station account on Initia L1
- Gas station account on Celestia
- Configuration at `~/.weave/config.json`

### 2. Fund Gas Station Accounts

The gas station needs both INIT and TIA tokens:

```bash
# Get your gas station addresses
cat ~/.weave/config.json | jq -r '.common.gas_station'
```

**Fund Initia L1 address** (needs ~10M uinit minimum):
- Visit: https://v1.app.testnet.initia.xyz/faucet
- Enter your `initia_address`
- Request tokens (repeat 3-4 times)

**Fund Celestia address** (needs ~3M utia minimum):
- Visit: https://faucet.celestia-mocha.com/
- Enter your `celestia_address`
- Request tokens (repeat 3-4 times)

**Verify balances:**
```bash
# Check INIT balance
INIT_ADDR=$(cat ~/.weave/config.json | jq -r '.common.gas_station.initia_address')
initiad query bank balances $INIT_ADDR --node https://rpc.testnet.initia.xyz

# Should show at least 10,000,000 uinit
```

### 3. Launch Rollup

```bash
weave rollup launch
```

**Configuration prompts:**

| Prompt | Recommended Value | Notes |
|--------|------------------|-------|
| Network | `Testnet (initiation-2)` | Use Initia testnet |
| VM | `Move` | For Move contracts |
| Chain ID | `myrollup-1` | Unique identifier (lowercase, hyphens) |
| Gas Denom | `umin` | Token for gas fees (prefix with 'u') |
| Moniker | `operator` | Node name |
| Submission Interval | `1m` | How often to submit outputs |
| Finalization Period | `168h` | 7 days (standard) |
| Price Oracle | `Enable` | Recommended |
| System Keys | `Generate new` | Creates operator keys |
| Funding | `Default preset` | Automatic funding |
| Fee Whitelist | `None` | No whitelist needed |
| Gas Station Genesis | `Yes` | Add with 100000000umin |
| Extra Genesis Accounts | `No` | Optional, add if needed |

**Save the output:**
- REST API: `http://localhost:1317`
- RPC: `http://localhost:26657`
- Chain ID: `myrollup-1`
- Bridge ID: `<number>`

### 4. Verify Rollup is Running

```bash
# Check rollup status
curl http://localhost:26657/status | jq

# Should show chain_id and increasing block height
```

## Deploy Move Contract

### 1. Create Deployment Key

```bash
# Create new key for deploying contracts
initiad keys add rollup-deployer --keyring-backend test

# Get addresses
initiad keys show rollup-deployer --address  # bech32
initiad keys parse $(initiad keys show rollup-deployer --address)  # hex
```

**Save the hex address** - you'll need it for Move.toml.

### 2. Fund Deployer Account

Your deployer needs tokens on the rollup:

**Option A: Already in genesis** (if you added gas station to genesis, use that)

**Option B: Send from another account:**
```bash
# The gas station was added to genesis with 100M tokens
# Send some to your deployer
DEPLOYER=$(initiad keys show rollup-deployer --address --keyring-backend test)
GAS_STATION=$(cat ~/.weave/config.json | jq -r '.common.gas_station.initia_address')

initiad tx bank send $GAS_STATION $DEPLOYER 10000000umin \
  --keyring-backend test \
  --node http://localhost:26657 \
  --chain-id myrollup-1 \
  --gas-prices 0.015umin \
  -y
```

**Verify balance:**
```bash
initiad query bank balances $DEPLOYER --node http://localhost:26657
```

### 3. Update Move.toml

Edit your Move contract's `Move.toml`:

```toml
[package]
name = "mycontract"
version = "0.0.0"

[dependencies]
InitiaStdlib = { git = "https://github.com/initia-labs/move-natives.git", subdir = "initia_stdlib", rev = "v1.0.0" }

[addresses]
std = "0x1"
mycontract = "0xYOUR_DEPLOYER_HEX_ADDRESS"  # From step 1
```

Replace `0xYOUR_DEPLOYER_HEX_ADDRESS` with your deployer's hex address.

### 4. Build Contract

```bash
cd your-contract-directory
initiad move build
```

Verify bytecode is generated:
```bash
ls build/*/bytecode_modules/*.mv
```

### 5. Deploy to Rollup

```bash
initiad move deploy \
  --path . \
  --upgrade-policy COMPATIBLE \
  --from rollup-deployer \
  --keyring-backend test \
  --gas auto \
  --gas-adjustment 1.5 \
  --gas-prices 0.015umin \
  --node http://localhost:26657 \
  --chain-id myrollup-1 \
  -y
```

**Save the transaction hash** from output.

### 6. Verify Deployment

```bash
# Query module
initiad query move module $MODULE_ADDR mycontract --node http://localhost:26657

# Should show module details
```

## Start OPinit Bots

For full rollup functionality, start the OPinit bots:

### 1. Initialize & Start Executor

```bash
# Initialize executor
weave opinit init
# Select: Executor
# Follow prompts, use detected keys

# Start executor
weave opinit start executor
```

Keep this terminal running.

### 2. Initialize & Start Challenger

```bash
# In a new terminal
weave opinit init
# Select: Challenger
# Use different port (e.g., 3001)

# Start challenger
weave opinit start challenger
```

Keep this terminal running.

### 3. Initialize & Start IBC Relayer

```bash
# In a new terminal
weave relayer init
# Select: Local Rollup (your chain-id)
# Subscribe to transfer and nft-transfer channels

# Start relayer
weave relayer start
```

Keep this terminal running.

## Test Your Deployment

### Set Environment Variables

```bash
export RPC_URL=http://localhost:26657
export REST_URL=http://localhost:1317
export CHAIN_ID=myrollup-1
export MODULE_ADDR=0xYOUR_DEPLOYER_HEX_ADDRESS
export GAS_PRICES=0.015umin
```

### Query Module

```bash
# Check module exists
initiad query move module $MODULE_ADDR mycontract --node $RPC_URL
```

### Execute Function

```bash
# Example: Execute a function
initiad tx move execute $MODULE_ADDR mycontract my_function \
  --args '["address:init1..."]' \
  --from rollup-deployer \
  --keyring-backend test \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  --gas-prices $GAS_PRICES \
  --gas auto \
  --gas-adjustment 1.5 \
  -y
```

### Query View Function

```bash
# Example: Query a view function
initiad query move view $MODULE_ADDR mycontract my_view_function \
  --args '["address:init1..."]' \
  --node $RPC_URL
```

## Frontend Integration

Update your frontend configuration to use rollup endpoints:

```typescript
// src/lib/contract.ts
export const REST_URL = 'http://localhost:1317';
export const CHAIN_ID = 'myrollup-1';
export const MODULE_ADDRESS = '0xYOUR_DEPLOYER_HEX_ADDRESS';

export const restClient = new RESTClient(REST_URL, {
  gasPrices: '0.015umin',  // Your rollup gas denom
});
```

```typescript
// src/providers/interwoven-provider.tsx
<InterwovenKitProvider {...TESTNET} defaultChainId="myrollup-1">
  {children}
</InterwovenKitProvider>
```

## Management Commands

### Rollup Operations

```bash
# Check status
weave rollup status

# View logs
weave rollup log

# Stop rollup
weave rollup stop

# Start rollup
weave rollup start

# Restart rollup
weave rollup restart
```

### Bot Operations

```bash
# Check status
weave opinit status executor
weave opinit status challenger
weave relayer status

# View logs
weave opinit logs executor
weave opinit logs challenger
weave relayer logs

# Stop/Start
weave opinit stop executor
weave opinit start executor
```

### Query Rollup State

```bash
# Get latest block
curl $RPC_URL/block | jq '.result.block.header.height'

# Get node info
curl $RPC_URL/status | jq

# Check account balance
initiad query bank balances <address> --node $RPC_URL
```

## Troubleshooting

### Rollup Won't Start

**Issue**: `failed to run launcher step: identifier cannot be blank`

**Solution**: Clean state and relaunch
```bash
rm -rf ~/.minitia/data/*
rm ~/.weave/data/minitia.config.json
weave rollup launch
```

### Insufficient INIT Balance

**Issue**: `insufficient initia balance: have X uinit, want Y uinit`

**Solution**: Fund gas station
```bash
# Send from funded account
initiad tx bank send <your-funded-key> <gas-station-address> 10000000uinit \
  --node https://rpc.testnet.initia.xyz \
  --chain-id initiation-2 \
  --gas-prices 0.015uinit \
  -y
```

### Insufficient TIA Balance

**Issue**: `insufficient DA balance. Required: X utia, Available: Y utia`

**Solution**: Request more from faucet
- Visit: https://faucet.celestia-mocha.com/
- Enter Celestia address from `~/.weave/config.json`
- Request multiple times (3-4x)

### Module Not Found

**Issue**: `module not found at address`

**Solution**: Verify address format
```bash
# Use lowercase hex address
initiad query move module 0xabcd... mycontract --node $RPC_URL

# NOT: 0xABCD... (uppercase won't work)
```

### Transaction Fails

**Issue**: `signature verification failed`

**Solution**: Check chain-id matches
```bash
# Verify chain-id
curl $RPC_URL/status | jq -r '.result.node_info.network'

# Should match your exported CHAIN_ID
```

### Bot Not Starting

**Issue**: Executor/Challenger fails to start

**Solution**: Check configuration
```bash
# Verify config exists
cat ~/.opinit/executor.json
cat ~/.opinit/challenger.json

# Reinitialize if needed
weave opinit init
```

## Key Differences: L1 vs Rollup

| Aspect | L1 (initiation-2) | Rollup |
|--------|------------------|--------|
| **RPC** | `https://rpc.testnet.initia.xyz` | `http://localhost:26657` |
| **REST** | `https://rest.testnet.initia.xyz` | `http://localhost:1317` |
| **Chain ID** | `initiation-2` | Custom (e.g., `myrollup-1`) |
| **Gas Token** | `uinit` | Custom (e.g., `umin`) |
| **Infrastructure** | None needed | Executor, Challenger, Relayer required |
| **Move Code** | Identical | Identical |
| **Deployment** | Single `initiad` command | Launch + Deploy + Bots |
| **Funding** | L1 faucet only | Genesis allocation or transfer |

## Production Considerations

### Security

- **Separate Machines**: Run Challenger on different infrastructure than Executor
- **Key Management**: Store mnemonics securely (hardware wallet recommended)
- **Monitoring**: Set up alerts for bot failures
- **Backups**: Regular backups of `~/.weave/` and `~/.minitia/`

### Performance

- **Resources**: Minimum 8GB RAM, 50GB disk, 2 CPUs
- **Network**: Stable connection with low latency to L1
- **DA Costs**: Monitor TIA consumption, refill proactively

### Monitoring

```bash
# Watch logs in real-time
weave rollup log | grep -i error
weave opinit logs executor | grep -i error

# Check bot health
while true; do
  echo "Executor: $(weave opinit status executor)"
  echo "Challenger: $(weave opinit status challenger)"
  echo "Relayer: $(weave relayer status)"
  sleep 60
done
```

## Resources

- **Weave CLI Docs**: https://docs.initia.xyz/developers/tools/clis/weave-cli
- **Initia Docs**: https://docs.initia.xyz
- **Move Book**: https://move-book.com/
- **Initia Discord**: https://discord.gg/initia
- **Example Apps**: https://github.com/initia-labs/

## Quick Reference

### Essential Commands

```bash
# Launch rollup
weave rollup launch

# Deploy contract
initiad move deploy --path . --node http://localhost:26657 --chain-id myrollup-1

# Start bots
weave opinit start executor
weave opinit start challenger
weave relayer start

# Query module
initiad query move module <addr> <name> --node http://localhost:26657

# Execute function
initiad tx move execute <addr> <module> <func> --from <key> --node http://localhost:26657

# View function
initiad query move view <addr> <module> <func> --node http://localhost:26657
```

### File Locations

- Weave config: `~/.weave/config.json`
- Rollup data: `~/.minitia/data/`
- Rollup config: `~/.minitia/config/`
- OPinit configs: `~/.opinit/executor.json`, `~/.opinit/challenger.json`
- Relayer config: `~/.hermes/config.toml`

### Default Ports

- RPC: `26657`
- REST: `1317`
- gRPC: `9090`
- Executor: `3000`
- Challenger: `3001`
- Relayer: `7010`

## Next Steps

1. **Test Contract**: Verify all functions work on rollup
2. **Configure Frontend**: Update to use rollup endpoints
3. **Monitor Bots**: Ensure Executor, Challenger, Relayer stay healthy
4. **Set Up Monitoring**: Implement alerting for production
5. **Document Deployment**: Save all addresses, chain-id, configs

For L1 deployment instead, see [INITIA_MOVE_DEVELOPMENT_GUIDE.md](./INITIA_MOVE_DEVELOPMENT_GUIDE.md).
