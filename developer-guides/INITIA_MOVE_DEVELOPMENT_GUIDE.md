# Initia MoveVM Development Guide

A concise guide for building and deploying Move smart contracts on Initia L1 blockchain.

## Prerequisites

- **Go**: v1.23+ (`go version`)
- **Git**: For cloning repositories
- **Make**: For building binaries
- **initiad CLI**: For Initia L1 development

## Quick Setup

### 1. Install initiad CLI

```bash
git clone https://github.com/initia-labs/initia.git
cd initia
export VERSION=$(curl -s https://rest.testnet.initia.xyz/cosmos/base/tendermint/v1beta1/node_info | jq -r '.application_version.version' | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+')
git checkout $VERSION
make install

# Verify installation
which initiad  # Should show /Users/$USER/go/bin/initiad
```

**Add to PATH** (add to `~/.zshrc` or `~/.bashrc`):
```bash
export PATH=$PATH:$HOME/go/bin
```

For more installation options, see the [initiad CLI documentation](https://docs.initia.xyz/developers/developer-guides/tools/clis/initiad-cli/introduction).

### 2. Create Development Account

IMPORTANT: Always create new keys for each project.

```bash
# Create new key
initiad keys add mykey

# Or import existing
initiad keys add mykey --recover  # Enter mnemonic when prompted

# List existing keys
initiad keys list

# Get addresses
initiad keys show mykey --address                    # Bech32 address (init1...)
initiad keys parse $(initiad keys show mykey --address)  # Hex address (0x...)
```

### 3. Fund Account

1. Visit: https://v1.app.testnet.initia.xyz/faucet
2. Enter your bech32 address
3. Request testnet tokens

## Project Setup

### 1. Initialize Move Project

```bash
mkdir my_project
cd my_project
initiad move new my_project  # Creates Move.toml and sources/
```

### 2. Configure Move.toml

Do not change InitiaStdlib version.

```toml
[package]
name = "my_project"
version = "0.0.0"

[dependencies]
InitiaStdlib = { git = "https://github.com/initia-labs/move-natives.git", subdir = "initia_stdlib", rev = "v1.0.0" }

[addresses]
std = "0x1"
my_project = "0xYOUR_HEX_ADDRESS_HERE"  # Get from: initiad keys parse <bech32>
```

**Critical**: Replace `0xYOUR_HEX_ADDRESS_HERE` with your deployer's hex address.

### 3. Write Move Module

Create `sources/my_module.move`:

```move
module my_project::my_module {
    use std::error;
    use std::signer;

    // Error codes
    const E_INVALID: u64 = 1;

    // Resource with key ability for storage
    struct MyResource has key {
        data: u64,
    }

    // Entry function (callable via transaction)
    public entry fun initialize(account: &signer) {
        let resource = MyResource { data: 0 };
        move_to(account, resource);
    }

    // View function (read-only query)
    #[view]
    public fun get_data(account: address): u64 acquires MyResource {
        borrow_global<MyResource>(account).data
    }
}
```

**Key Patterns:**
- Use `has key` for resources stored in accounts
- Use `has store, copy, drop` for structs returned from view functions
- Use `#[view]` for read-only queries
- Use `public entry fun` for transaction-callable functions
- Include `acquires ResourceName` when accessing resources

### 4. Compile Module

```bash
initiad move build

# Verify build artifacts
ls -la build/*/bytecode_modules/*.mv
```

**Expected Output**: `BUILDING my_project` without errors.

## Deployment

### Environment Setup

```bash
export RPC_URL=https://rpc.testnet.initia.xyz
export CHAIN_ID=initiation-2  # Move rollup testnet (or initiation-1 for Initia L1)
export GAS_PRICES=0.015uinit
export PATH=$PATH:$HOME/go/bin
```

### Deploy Module

```bash
cd my_project

initiad move deploy \
  --path . \
  --upgrade-policy COMPATIBLE \
  --from mykey \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices $GAS_PRICES \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  -y  # Skip confirmation prompt
```

**Upgrade Policies:**
- `COMPATIBLE`: Allows backward-compatible upgrades
- `IMMUTABLE`: No future modifications allowed

### Interact with Deployed Module

```bash
export MODULE_ADDRESS=0xYOUR_HEX_ADDRESS

# Execute function
initiad tx move execute $MODULE_ADDRESS my_module initialize \
  --from mykey \
  --node $RPC_URL \
  --chain-id $CHAIN_ID \
  --gas-prices $GAS_PRICES \
  -y

# Query view function
initiad query move view $MODULE_ADDRESS my_module get_data \
  --args '["address:0xYOUR_ADDRESS"]' \
  --node $RPC_URL
```

## Move Language Patterns

### Resource Storage

```move
// Store resource in account
struct MyResource has key {
    value: u64,
}

public entry fun create(account: &signer) {
    move_to(account, MyResource { value: 0 });
}

// Access resource
public entry fun update(account: address, new_value: u64) acquires MyResource {
    let resource = borrow_global_mut<MyResource>(account);
    resource.value = new_value;
}

// Check if resource exists
if (exists<MyResource>(account)) {
    // resource exists
}
```

### View Functions

```move
// View struct needs store, copy, drop abilities
struct MyData has store, copy, drop {
    value: u64,
    name: vector<u8>,
}

#[view]
public fun get_data(account: address): MyData acquires MyResource {
    let resource = borrow_global<MyResource>(account);
    MyData {
        value: resource.value,
        name: *&resource.name,
    }
}
```

### Error Handling

```move
const E_NOT_FOUND: u64 = 1;
const E_INVALID_ARGUMENT: u64 = 2;
const E_PERMISSION_DENIED: u64 = 3;

public entry fun require_resource(account: address) acquires MyResource {
    assert!(exists<MyResource>(account), error::not_found(E_NOT_FOUND));
    let resource = borrow_global<MyResource>(account);
    // use resource
}
```

### Entry Function Patterns

```move
// Basic entry function
public entry fun simple_action(account: &signer, param: u64) {
    // action logic
}

// Entry function accessing resources
public entry fun update_resource(account: address, value: u64) acquires MyResource {
    let resource = borrow_global_mut<MyResource>(account);
    resource.value = value;
}

// Entry function with signer for authorization
public entry fun authorized_action(admin: &signer, target: address) {
    let admin_addr = signer::address_of(admin);
    // verify admin and perform action
}
```

## Common Commands

```bash
# Build
initiad move build

# Deploy
initiad move deploy --path . --upgrade-policy COMPATIBLE --from keyname \
  --gas auto --gas-adjustment 1.5 --gas-prices $GAS_PRICES \
  --node $RPC_URL --chain-id $CHAIN_ID -y

# Execute
initiad tx move execute <module_addr> <module_name> <function> \
  --args '[...]' --from keyname --node $RPC_URL --chain-id $CHAIN_ID \
  --gas-prices $GAS_PRICES -y

# Query
initiad query move view <module_addr> <module_name> <function> \
  --args '["address:0x..."]' --node $RPC_URL

# Keys
initiad keys add <name>                    # Create
initiad keys add <name> --recover          # Import
initiad keys list                          # List all keys
initiad keys show <name> --address         # Show address
initiad keys parse <bech32_address>        # Convert to hex

# Check balance
initiad query bank balances $(initiad keys show mykey --address) --node $RPC_URL
```

## Argument Formatting

### Execute Function Arguments

```bash
# String
--args '["string:Hello World"]'

# Address (Bech32)
--args '["address:init1..."]'

# Address (Hex)
--args '["address:0x1234..."]'

# Numbers
--args '["u8:42"]'
--args '["u64:1000000"]'
--args '["u128:999999999"]'

# Boolean
--args '["bool:true"]'

# Vector (as array)
--args '["vector<u8>:0x1234"]'

# Multiple arguments
--args '["address:0x1234", "u64:100", "bool:true"]'
```

### Query Function Arguments

Same format as execute arguments.

## Network Configuration

**Testnet:**
- RPC: `https://rpc.testnet.initia.xyz`
- Chain ID: `initiation-2` (Move rollup testnet, used by InterwovenKit TESTNET config)
- Chain ID: `initiation-1` (Initia L1 testnet, alternative)
- Gas Prices: `0.015uinit`
- Faucet: https://v1.app.testnet.initia.xyz/faucet

**Note**: Use `initiation-2` for Move rollup deployments. Use `initiation-1` for Initia L1 deployments.

## Common Errors & Solutions

### 1. Command Not Found
```bash
export PATH=$PATH:$HOME/go/bin
# Add to ~/.zshrc for persistence
echo 'export PATH=$PATH:$HOME/go/bin' >> ~/.zshrc
```

### 2. Unresolved Address
**Error**: `Unresolved addresses found: [Named address 'my_project' in package 'my_project']`

**Solution**: Update `Move.toml` `[addresses]` section with hex address (include `0x` prefix), then rebuild.

### 3. Key Not Found
**Error**: `key not found: mykey`

**Solution**: Keys are stored in `~/.initia`. Create key or import with same mnemonic:
```bash
initiad keys add mykey --recover
```

### 4. Signature Verification Failed
**Error**: `signature verification failed; please verify account number and chain-id`

**Solution**: Ensure `--chain-id` matches the chain your key was created for. Default testnet is `initiation-1`.

### 5. Insufficient Funds
**Error**: `insufficient funds`

**Solution**: Check balance and fund via faucet:
```bash
initiad query bank balances $(initiad keys show mykey --address) --node $RPC_URL
```

### 6. Module Compilation Errors

**Missing Abilities:**
```move
// Error: value of type `MyStruct` does not have the `copy` ability
// Solution: Add abilities to struct
struct MyStruct has store, copy, drop {
    // fields
}
```

**Resource Not Acquired:**
```move
// Error: missing 'acquires ResourceName' in function signature
// Solution: Add acquires clause
public fun get_data(account: address): u64 acquires MyResource {
    borrow_global<MyResource>(account).value
}
```

## Best Practices

1. **Always verify addresses** match between Move.toml and actual deployer
2. **Use specific version tags** for dependencies in production (`rev = "v1.0.0"`)
3. **Test compilation** before deployment
4. **Keep Move.toml address updated** when changing deployer accounts
5. **Use descriptive error codes** with meaningful names
6. **Validate inputs** in entry functions
7. **Use view functions** for read-only operations (marked with `#[view]`)
8. **Include `acquires` clauses** when accessing resources

## Project Checklist

- [ ] initiad CLI installed and in PATH
- [ ] Account created/imported and funded
- [ ] Move.toml configured with correct deployer hex address
- [ ] Module compiles without errors
- [ ] Account has sufficient balance
- [ ] Environment variables set (RPC_URL, CHAIN_ID, GAS_PRICES)
- [ ] Key exists in keyring (`~/.initia`)

## Frontend Integration

### 1. Install Dependencies

```bash
# In your web-app directory
bun add @initia/interwovenkit-react wagmi viem @initia/initia.js cosmjs-types
bun add -d vite-plugin-node-polyfills
```

### 2. Configure Vite

Add Node.js polyfills to `vite.config.ts`:

```ts
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // ... other plugins
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  define: {
    global: 'globalThis',
  },
});
```

### 3. Setup InterwovenKit Provider

Create `src/providers/interwovenkit-provider.tsx`:

```tsx
import { useEffect } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from '@initia/interwovenkit-react';
import InterwovenKitStyles from '@initia/interwovenkit-react/styles.js';

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});

export function InterwovenKitProviderWrapper({ children }) {
  useEffect(() => {
    injectStyles(InterwovenKitStyles);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <InterwovenKitProvider {...TESTNET}>{children}</InterwovenKitProvider>
    </WagmiProvider>
  );
}
```

Wrap your app in `main.tsx`:

```tsx
import { InterwovenKitProviderWrapper } from './providers/interwovenkit-provider';

// Wrap app with InterwovenKitProviderWrapper
```

### 4. Create Contract Service

Create `src/lib/initia.ts`:

```ts
import { RESTClient } from '@initia/initia.js';

// REST URL for queries (LCD endpoint)
export const REST_URL = import.meta.env.VITE_REST_URL || 'https://rest.testnet.initia.xyz';
// RPC URL for transactions is handled by InterwovenKit via chain registry
export const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS || '0x...';

export const restClient = new RESTClient(REST_URL, {
  gasPrices: '0.015uinit',
});
```

Create `src/lib/move-contract.ts`:

```ts
import { bcs, MsgExecute } from '@initia/initia.js';
import { restClient, MODULE_ADDRESS } from './initia';

// Query Move view function
export async function queryGame(playerXAddr: string) {
  const address = playerXAddr.startsWith('0x') ? playerXAddr : `0x${playerXAddr}`;
  return await restClient.move.view(
    address,
    'tictactoe',
    'view_game',
    [],
    [bcs.address().serialize(address).toBase64()],
  );
}

// Create MsgExecute for transactions
export function createGameMessage(sender: string, playerO: string): MsgExecute {
  return new MsgExecute(
    sender,
    MODULE_ADDRESS,
    'tictactoe',
    'create_game',
    [],
    [bcs.address().serialize(playerO).toBase64()],
  );
}
```

### 5. Use in Components

```tsx
import { useInterwovenKit } from '@initia/interwovenkit-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createGameMessage, queryGame } from '@/lib/move-contract';
import type { EncodeObject } from '@cosmjs/proto-signing';

function MyComponent() {
  const { address, requestTxBlock, waitForTxConfirmation } = useInterwovenKit();

  // Query
  const { data: game } = useQuery({
    queryKey: ['game', address],
    queryFn: () => queryGame(address),
  });

  // Execute transaction
  const createGame = useMutation({
    mutationFn: async (playerO: string) => {
      const msg = createGameMessage(address, playerO);
      const encodeMsg: EncodeObject = {
        typeUrl: '/initia.move.v1.MsgExecute',
        value: msg.toProto(), // IMPORTANT: Must call toProto()!
      };
      const result = await requestTxBlock({ messages: [encodeMsg] });
      await waitForTxConfirmation({ txHash: result.transactionHash, timeoutMs: 30000 });
      return result.transactionHash;
    },
  });
}
```

**Common Issues:**

1. **"invalid uint32: undefined" error**: Ensure arguments are BCS-encoded as base64 strings, not raw values:
   ```ts
   // ✅ Correct
   args: [bcs.address().serialize(address).toBase64()]
   
   // ❌ Wrong
   args: [address] // Will fail!
   ```

2. **Transaction fails silently**: Always convert `MsgExecute` to proto format:
   ```ts
   // ✅ Correct
   value: msg.toProto()
   
   // ❌ Wrong
   value: msg // Will fail!
   ```

3. **Bech32 address encoding**: Convert bech32 addresses to hex before BCS encoding:
   ```ts
   import { fromBech32 } from '@cosmjs/encoding';
   
   function encodeAddress(address: string): string {
     let hexAddress: string;
     if (address.startsWith('0x')) {
       hexAddress = address;
     } else {
       const decoded = fromBech32(address);
       const hexBytes = Array.from(decoded.data)
         .map((b) => b.toString(16).padStart(2, '0'))
         .join('');
       hexAddress = '0x' + hexBytes.padStart(64, '0');
     }
     return bcs.address().serialize(hexAddress).toBase64();
   }
   ```

### 6. Environment Variables

Create `.env`:

```env
# REST URL for queries (LCD endpoint)
VITE_REST_URL=https://rest.testnet.initia.xyz
# RPC URL is handled automatically by InterwovenKit via chain registry
# initiation-2 = Move rollup testnet (default for TESTNET config)
VITE_CHAIN_ID=initiation-2
VITE_MODULE_ADDRESS=0xYOUR_MODULE_ADDRESS
VITE_GAS_PRICES=0.015uinit
```

**Note**: InterwovenKit handles RPC URLs automatically through the chain registry. Transactions use the RPC endpoint configured in the registry for the chain ID. For queries, use the REST/LCD endpoint.

### Key Patterns

- **Wallet Connection**: Use `useInterwovenKit()` hook for `address`, `openConnect()`, `openWallet()`
- **Queries**: Use `restClient.move.view()` with BCS-encoded arguments
- **Transactions**: Create `MsgExecute`, convert to `EncodeObject` with `msg.toProto()`, use `requestTxBlock()`
- **BCS Encoding**: Always use `.toBase64()` on serialized values: `bcs.address().serialize(addr).toBase64()`
- **Type URLs**: Move messages use `/initia.move.v1.MsgExecute`
- **Address Encoding**: Convert bech32 addresses to hex (32 bytes, zero-padded) before BCS encoding

## Quick Reference

**Module Address Format:**
- Bech32: `init1...` (for transactions/queries)
- Hex: `0x...` (for Move.toml and module code)

**Storage:**
- Resources stored with `move_to(account, resource)`
- Access with `borrow_global<Resource>(addr)` or `borrow_global_mut<Resource>(addr)`
- Check existence with `exists<Resource>(addr)`

**Function Types:**
- `public entry fun`: Callable via transactions
- `#[view] public fun`: Read-only queries
- `fun`: Internal/private functions

**Frontend:**
- Wallet: `useInterwovenKit()` hook
- Queries: `restClient.move.view()`
- Transactions: `MsgExecute` → `msg.toProto()` → `EncodeObject` → `requestTxBlock()`
- Arguments: Always BCS-encode and convert to base64 strings
