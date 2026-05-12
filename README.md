# WarpSnaket Orchestrator

WarpSnaket is a modern cyberpunk reimagination of the classic Snake game featuring teleportation, vibrant neo-colors, and built-in Base Mainnet capabilities. It serves as an on-chain playground and testbed for ERC-8004 Agent orchestration and ERC-8021 Transaction Attribution.

## Features

- **Mobile First**: Built with responsive design and touch controls for seamless mobile play.
- **Warp Portals**: Game twist that allows players to teleport across the game board.
- **PWA Ready**: Manifest and Service Workers included so game can be installed.
- **Onchain Score Board**: Integration with Base chain utilizing **ERC-8021 Transaction Attribution**. Save your scores directly on the ledger.
- **Wallet Connection**: Connect via regular Ethereum wallet or seamlessly through Base's Smart Wallet.
- **Say GM**: On-chain interaction to broadcast "GM" over Base Mainnet with embedded attribution!
- **ERC-8004 AI Agent Integration**: Intelligent agent capability configured via MCP (Model Context Protocol).

## ERC-8004 Agent & MCP Config

The application is configured to run as an intelligent agent endpoint under the `WarpSnaket Orchestrator` identity. The configuration files ensure Agent-to-Agent (A2A) and MCP compatibility:

1. **Agent Metadata Card**: Available at `/.well-known/agent-card.json` mapping out the supported `eip155:8453` chain and tool capabilities like `task-automation` and `fren-farming`. 
2. **MCP Endpoint**: The application exposes `/api/mcp` to process and respond to Model Context Protocol tasks.
3. **Agent API**: The `/api/agent` route provides real-time status and identity checking.

## ERC-8021 Implementation Structure

The `Warp Snake` implementation provides a fully compliant and modular approach for **ERC-8021 Transaction Attribution**:

```text
src/lib/erc8021/
├── constants.ts                      // Core markers and constants (e.g. Code registry, Delimiter, Base schema keys)
├── types.ts                          // Interfaces for Multi-Attribution Schemas (0, 1, 2)
├── utils.ts                          // Functions and builders logic for Suffixing Hex calldata
├── validation.ts                     // Security validation and compliance checking
├── parser.ts                         // Code for breaking down standard attributions manually
├── registry.ts                       // Setup referencing Code Registry canonical references
├── components/                       // Drop-in React components (Demo/TestRunner if used)
└── hooks/
    ├── useERC8021Transaction.ts      // React hook wrapper over standard EOA usage via typical Wagmi transactions
    └── useERC8021BatchTransaction.ts // Advanced usage using ERC-5792 sendCall capabilities
```

### How to Hook into Wagmi

Simply import the custom hook available:
```tsx
import { useERC8021Transaction } from './lib/erc8021';
import { toHex } from 'viem';

// ...
const { sendTransaction } = useERC8021Transaction();

// Later in a callback
const action = () => {
    sendTransaction({
        to: address, 
        value: 0n,
        // The ERC-8021 hook automatically applies `appendAttribution(data)` to data implicitly!
        data: toHex('My onchain Data'),
    });
};
```

## Running the app locally

### Prerequisites
- Node.js environment
- Vite installed globally or via npx (`npm run dev`)

```bash
npm install
npm run dev
```

The game is ready. Connect a wallet and test building a transaction!
