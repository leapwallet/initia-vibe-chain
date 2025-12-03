# Initia Vibe Chain - Development Template

A starter template for building decentralized applications on the Initia blockchain. This template provides everything you need to get started with MoveVM smart contracts and a modern React frontend. It's designed to work seamlessly with AI coding assistants, but can also be used for traditional development workflows.

## 📑 Contents

- [📖 Documentation Overview](#documentation-overview)
  - [How to Use the Documentation](#how-to-use-the-documentation)
- [🚀 Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [1. Clone and Install](#1-clone-and-install)
  - [2. Set Up Environment Variables](#2-set-up-environment-variables)
  - [3. Start Development Server](#3-start-development-server)
- [📁 Project Structure](#project-structure)
- [🛠️ What's Included](#whats-included)
  - [Frontend (web-app)](#frontend-web-app)
  - [Developer Guides](#developer-guides)
- [🤖 Build a Demo App with AI](#-build-a-demo-app-with-ai)
- [📚 Next Steps](#next-steps)
  - [1. Set Up Your Initia Rollup (Optional)](#1-set-up-your-initia-rollup-optional)
  - [2. Build Your Move Smart Contract](#2-build-your-move-smart-contract)
  - [3. Integrate with Your Frontend](#3-integrate-with-your-frontend)
  - [4. Customize Your Application](#4-customize-your-application)
- [📖 Additional Resources](#additional-resources)
- [🎯 Example Use Cases](#example-use-cases)
- [🔧 Available Scripts](#available-scripts)
- [💡 Tips](#tips)
- [🤝 Getting Help](#getting-help)

<a id="documentation-overview"></a>
## 📖 Documentation Overview

This repository includes comprehensive documentation to help you build on Initia:

- **[PROMPTING_GUIDE.md](./PROMPTING_GUIDE.md)** - Learn how to effectively use this template with AI coding assistants
- **[prompt-example.md](./prompt-example.md)** - Example prompts for building on-chain applications
- **[developer-guides/](./developer-guides/)** - Complete technical documentation:
  - **[INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md)** - Complete Move development guide
  - **[INITIA_ROLLUP_DEPLOYMENT_GUIDE.md](./developer-guides/INITIA_ROLLUP_DEPLOYMENT_GUIDE.md)** - Deploy to custom rollups
  - **[interwovenkit/](./developer-guides/interwovenkit/)** - Wallet integration guides
  - **[tools/](./developer-guides/tools/)** - CLI and SDK documentation
  - **[vm-specific-tutorials/](./developer-guides/vm-specific-tutorials/)** - MoveVM tutorials
- **[AI_WORKFLOW_GUIDE.md](./AI_WORKFLOW_GUIDE.md)** - Complete walkthrough with ready-made prompts for building your first dApp

### How to Use the Documentation

**For AI-Assisted Development:**
1. Read [PROMPTING_GUIDE.md](./PROMPTING_GUIDE.md) to understand how to structure requests
2. Reference [prompt-example.md](./prompt-example.md) for sample prompts
3. Point your AI assistant to relevant files in `developer-guides/` for technical context

**For Manual Development:**
1. Start with [INITIA_MOVE_DEVELOPMENT_GUIDE.md](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md) for Move contracts
2. Follow [INITIA_ROLLUP_DEPLOYMENT_GUIDE.md](./developer-guides/INITIA_ROLLUP_DEPLOYMENT_GUIDE.md) for rollup deployment
3. Use [interwovenkit/](./developer-guides/interwovenkit/) guides for wallet integration

<a id="quick-start"></a>
## 🚀 Quick Start

### Prerequisites

- [Node.js](https://node.js.org/) (v22 or higher)
- [pnpm](https://pnpm.io/) package manager
- [minitiad](https://docs.initia.xyz/developers/developer-guides/tools/clis/initiad-cli) CLI tool for Move development
- An Initia testnet account (get testnet tokens from the [faucet](https://docs.initia.xyz/developers/introduction))

### 1. Clone and Install

```bash
git clone <repository-url>
cd initia-vibe-chain/web-app

# Install dependencies
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `web-app` directory:

```env
VITE_REST_URL=https://rest.testnet.initia.xyz
VITE_CHAIN_ID=initiation-2
VITE_MODULE_ADDRESS=your_module_address_here
VITE_GAS_PRICES=0.015uinit
```

### 3. Start Development Server

```bash
# From the web-app directory
pnpm dev
```

Visit `http://localhost:5173` to see your application running.

<a id="project-structure"></a>
## 📁 Project Structure

```
initia-vibe-chain/
├── developer-guides/          # Comprehensive development documentation
│   ├── INITIA_MOVE_DEVELOPMENT_GUIDE.md
│   ├── interwovenkit/         # Wallet integration guides
│   ├── tools/                 # CLI and SDK documentation
│   └── vm-specific-tutorials/ # MoveVM tutorials
├── web-app/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── lib/              # Utilities and helpers
│   │   └── providers/        # React context providers
│   └── package.json
└── prompt-template.md        # Example prompt for building Move modules
```


<a id="whats-included"></a>
## 🛠️ What's Included

### Frontend (web-app)

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + **shadcn/ui** components for beautiful UI
- **InterwovenKit** integration for wallet connectivity
- **@initia/initia.js** SDK for blockchain interactions
- **TanStack Query** for data fetching and caching
- Pre-configured routing, theming, and form handling

### Developer Guides

- MoveVM development tutorials
- Smart contract deployment guides
- Wallet integration documentation
- CLI and SDK references

<a id="-build-a-demo-app-with-ai"></a>
## 🤖 Build a Demo App with AI

This section provides a smooth onboarding path to help you understand how everything fits together by building a complete demo application using AI.

The **[AI Workflow Guide](./AI_WORKFLOW_GUIDE.md)** walks you through building a tic-tac-toe game from scratch, demonstrating how smart contracts, frontends, and blockchain integration work together on Initia. Each step includes copy-paste ready prompts you can use with your AI coding assistant.

**Getting Started:**

1. **Open this repository in an AI coding tool** — Use [Cursor](https://cursor.sh/), [Windsurf](https://codeium.com/windsurf), or [GitHub Copilot](https://github.com/features/copilot)

2. **Follow the AI Workflow Guide** — The guide provides step-by-step instructions with ready-made prompts for:
   - Building your Move smart contract
   - Creating your React frontend interface
   - Connecting the frontend to your deployed contract

3. **Deploy and test** — Deploy to Initia testnet and see your complete application running

The workflow guide references the technical documentation throughout, helping your AI assistant generate code that follows Initia's best practices while you learn.

**Need help?** See [PROMPTING_GUIDE.md](./PROMPTING_GUIDE.md) for tips on writing effective AI prompts.

<a id="next-steps"></a>
## 📚 Next Steps

### 1. Set Up Your Initia Rollup (Optional)

If you want to deploy to your own custom rollup:

- Follow [INITIA_ROLLUP_DEPLOYMENT_GUIDE.md](./developer-guides/INITIA_ROLLUP_DEPLOYMENT_GUIDE.md) to:
  - Launch your own Initia rollup using Weave CLI
  - Configure and fund your rollup infrastructure
  - Deploy Move contracts to your custom chain
  - Register your rollup in the Initia registry

Or deploy directly to Initia testnet (L1) following the next steps.

### 2. Build Your Move Smart Contract

Follow the guides in `developer-guides/vm-specific-tutorials/movevm/` to:

- Set up your Move development environment
- Write your first Move module
- Deploy to Initia testnet or your custom rollup

### 3. Integrate with Your Frontend

- Update `VITE_MODULE_ADDRESS` in your `.env` file with your deployed module address
- Use `@initia/initia.js` to interact with your smart contract
- Connect wallets using InterwovenKit (see `developer-guides/interwovenkit/`)

### 4. Customize Your Application

- Modify `web-app/src/pages/index.tsx` to build your UI
- Add new components in `web-app/src/components/`
- Configure routing in `web-app/src/router.tsx`

<a id="additional-resources"></a>
## 📖 Additional Resources

- **[Initia Documentation](https://docs.initia.xyz)** - Official Initia docs
- **[CLI Reference](./developer-guides/tools/clis/initiad-cli.md)** - Command-line tools
- **[Initia Registry](https://docs.initia.xyz/developers/developer-guides/integrating-initia-apps/registry/introduction)** - Register your rollup for discoverability

<a id="example-use-cases"></a>
## 🎯 Example Use Cases

This template is perfect for building:

- Decentralized games (see `prompt-template.md` for a tic-tac-toe example)
- DeFi applications
- NFT marketplaces
- DAO governance tools
- Any on-chain application on Initia

<a id="available-scripts"></a>
## 🔧 Available Scripts

From the `web-app` directory:

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

<a id="tips"></a>
## 💡 Tips

- Start with the MoveVM tutorials to understand smart contract development
- Use the testnet for development and testing
- Check the `prompt-template.md` for inspiration on building Move modules
- The web-app includes a complete UI component library - explore `src/components/ui/`

<a id="getting-help"></a>
## 🤝 Getting Help

- [Initia Discord](https://discord.gg/initia)
- [Initia Documentation](https://docs.initia.xyz)
- Review the guides in `developer-guides/` for detailed tutorials

---

**Happy Building! 🚀**
