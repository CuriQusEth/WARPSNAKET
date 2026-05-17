# WarpSnaket Orchestrator

# WarpSnaket Orchestrator

WarpSnaket Orchestrator is a Web3-integrated AI Agent and modern orchestrator deployed on the WarpSnaket platform. It serves as an interactive playground connecting browser-based mechanics with Base Mainnet using ERC-8004 and ERC-8021 standards.

🔗 **Production App:** [https://warpsnaket.vercel.app/](https://warpsnaket.vercel.app/)

## 🚀 Project Overview

The WarpSnaket platform handles a variety of autonomous capabilities including multi-game management, task automation, daily operations, and fren farming while securely syncing with the Base Mainnet.

- **AI Orchestration**: Autonomous agent capabilities exposed via the Model Context Protocol (MCP).
- **Onchain Leaderboards & Attribution**: Transaction attributions are formatted using the ERC-8021 protocol via Base accounts.
- **Mobile First & PWA Ready**: Fully responsive styling, built for all devices.
- **Agent Identity**: Agent identity is resolved via a public `agent-card.json` registry file.

## 🛠 Tech Stack

- **Framework**: Vite + React 18
- **Web3 Integration**: Wagmi, Viem, Base Smart Wallets
- **Agent Protocol**: Model Context Protocol (MCP) & ERC-8004
- **Attribution Protocol**: ERC-8021
- **Styling**: Tailwind CSS & Lucide Icons

## 🤖 Capabilities & Agent Details

WarpSnaket Orchestrator is highly capable and operates completely autonomously. Supported capabilities include:

- `snake-game-management`
- `multi-game-management`
- `task-automation`
- `daily-operations`
- `fren-farming`
- `mcp-command-execution`

### Agent Registration (ERC-8004)

The agent identity is publicly declarable according to the ERC-8004 standard. You can view the agent metadata card mapped to its respective capabilities at the root route:
`GET https://warpsnaket.vercel.app/.well-known/agent-card.json`

## 🔌 MCP Connection Guide

The system natively acts as an MCP server to process standardized tools. Because the frontend is built with React + Vite, the platform uses Vercel Edge Functions (serverless endpoints) to run backend operations.

**Endpoint URL**: `https://warpsnaket.vercel.app/api/mcp`  
**Method**: `GET` / `POST`

It supports standard MCP JSON-RPC interaction methods (like `tools/list` and `tools/call`). Current active tools include:
- `get_race_status`
- `start_race`
- `get_leaderboard`
- `optimize_speed`
- `get_track_info`

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Compatible package manager (npm, yarn, pnpm)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development app:**
   ```bash
   npm run dev
   ```

*(Note: API routes are Vercel Serverless Functions and will be handled by the Vercel edge/deployment environment when pushed live).*