# Vibe Coding Guide for Initia

This template helps you build blockchain applications on Initia by describing what you want in plain language. An AI coding assistant will handle the technical implementation.

## What's Inside

- **developer-guides/** - Complete documentation and context about Initia blockchain development
- **web-app/** - Ready-to-use starter template for your application

## How to Get Started

1. **Describe your goal clearly** - What do you want to build?
2. **The AI reads the docs** - It understands Initia's patterns from developer-guides
3. **You get working code** - Smart contract + web interface

## Crafting Effective Prompts

### Structure Your Request

Break down what you want into:
- **What it does** - The core functionality
- **How users interact** - Key actions/features
- **What data it stores** - Information to track

### Example: Good vs Vague

❌ **Vague**: "Make a game"

✅ **Clear**: "Build a tic-tac-toe game where two players take turns placing X and O on a 3x3 board. Store the game state, validate moves, and detect when someone wins or the game ends in a draw."

### Real Example

Here's how to request a blockchain game (from [prompt-template.md](prompt-template.md)):

```
Build a fully on-chain tic-tac-toe game smart contract on Initia:

Core Requirements:
1. Game State: Store 3x3 board, player addresses, current turn, game status
2. Functions:
   - create_game: Start game between two players
   - make_move: Place marker at position, validate turn
   - check_winner: Detect 3-in-a-row or draw
   - view_game: Show current board state
3. Validation: Enforce turns, prevent invalid moves

Want detailed guides? Check: developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md
```

**Why this works:**
- States the goal (tic-tac-toe game)
- Lists specific features (game state, functions)
- Mentions validation needs
- Points to relevant documentation

### Tips for Better Results

**Be specific about features**
- List the actions users should be able to do
- Mention any rules or restrictions
- Describe what information to display

**Reference the docs**
- Point to relevant files in developer-guides/
- The AI will use official patterns and best practices

**Start simple, iterate**
- Get basic functionality working first
- Add features one at a time
- Test as you go

**Describe user experience**
- "Users should be able to..."
- "When someone clicks X, show Y"
- "Display a list of..."

## Common Scenarios

### Building a Smart Contract
"Create a smart contract that [purpose]. Users can [action 1], [action 2]. It should store [data]. Check developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md for patterns."

### Adding Frontend
"Build a web interface where users can [interact]. Show [information] and let them [action]. Use the web-app template."

### Connecting Both
"Connect the web app to my smart contract. Users should see [data] and click buttons to [actions]. Handle wallet connection."

## What Happens Next

The AI will:
1. Read the relevant documentation from developer-guides/
2. Generate your smart contract code
3. Create the web interface in web-app/
4. Set up all necessary connections
5. Provide instructions for testing

## Getting Help

All technical details are in developer-guides/:
- Setting up development environment
- Smart contract patterns
- Frontend integration
- Common solutions

Just describe what you want to build - the AI handles the technical details.
