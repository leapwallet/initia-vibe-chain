# Initia Vibe Chain - Development Template

A starter template for building decentralized applications on the Initia blockchain. This template provides everything you need to get started with MoveVM smart contracts and a modern React frontend.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://node.js.org/) (v22 or higher)
- [pnpm](https://pnpm.io/) package manager
- [minitiad](https://docs.initia.xyz/developers/tools/clis/initiad-cli) CLI tool for Move development
- An Initia testnet account (get testnet tokens from the [faucet](https://docs.initia.xyz/developers/introduction))

### 1. Clone and Install

```bash
# Navigate to the web-app directory
cd web-app

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

## 📚 Next Steps

### 1. Build Your Move Smart Contract

Follow the guides in `developer-guides/vm-specific-tutorials/movevm/` to:

- Set up your Move development environment
- Write your first Move module
- Deploy to Initia testnet

### 2. Integrate with Your Frontend

- Update `VITE_MODULE_ADDRESS` in your `.env` file with your deployed module address
- Use `@initia/initia.js` to interact with your smart contract
- Connect wallets using InterwovenKit (see `developer-guides/interwovenkit/`)

### 3. Customize Your Application

- Modify `web-app/src/pages/index.tsx` to build your UI
- Add new components in `web-app/src/components/`
- Configure routing in `web-app/src/router.tsx`

## 📖 Documentation

- **[Initia Documentation](https://docs.initia.xyz)** - Official Initia docs
- **[MoveVM Development Guide](./developer-guides/INITIA_MOVE_DEVELOPMENT_GUIDE.md)** - Complete Move development guide
- **[InterwovenKit Integration](./developer-guides/interwovenkit/)** - Wallet integration guides
- **[CLI Reference](./developer-guides/tools/clis/initiad-cli.md)** - Command-line tools

## 🎯 Example Use Cases

This template is perfect for building:

- Decentralized games (see `prompt-template.md` for a tic-tac-toe example)
- DeFi applications
- NFT marketplaces
- DAO governance tools
- Any on-chain application on Initia

## 🔧 Available Scripts

From the `web-app` directory:

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

## 💡 Tips

- Start with the MoveVM tutorials to understand smart contract development
- Use the testnet for development and testing
- Check the `prompt-template.md` for inspiration on building Move modules
- The web-app includes a complete UI component library - explore `src/components/ui/`

## 🤝 Getting Help

- [Initia Discord](https://discord.gg/initia)
- [Initia Documentation](https://docs.initia.xyz)
- Review the guides in `developer-guides/` for detailed tutorials

---

**Happy Building! 🚀**
