# Build a fully on-chain tic-tac-toe game smart contract on Initia using MoveVM:

**Core Requirements:**

1. **Game State**: Store 3x3 board, player addresses (X/O), current turn, game status (active/won/draw)
2. **Functions**:
   - `create_game`: Initialize game between two players
   - `make_move`: Place X/O at position (0-8), validate turn & position
   - `check_winner`: Detect 3-in-a-row (rows/columns/diagonals) or draw
   - `view_game`: Query current board state
3. **Storage Pattern**: Use Move `struct` with `key` ability stored via `move_to()` in player accounts
4. **Validation**: Enforce alternating turns, prevent overwriting moves, check game-over states

**Technical Details:**

- Use `#[view]` for read-only functions
- Use `public entry fun` for transaction functions
- Include `acquires` clause when accessing resources
- Serialize arguments with BCS encoding for deployment

**Development Steps:**

1. Set up: Install minitiad, create account, fund via faucet
2. Write module in `sources/tictactoe.move`
3. Configure `Move.toml` with your deployer address
4. Build: `minitiad move build`
5. Deploy: `minitiad move deploy --upgrade-policy COMPATIBLE`
6. Test by executing moves and querying state

Want detailed guides? Check these:

```suggestions
developer-guides/vm-specific-tutorials/movevm/building-move-modules.md
developer-guides/vm-specific-tutorials/movevm/setting-up.md
developer-guides/vm-specific-tutorials/movevm/ibc-hooks.md
```

Here is the link to intia docs https://docs.initia.xyz/developers/introduction
