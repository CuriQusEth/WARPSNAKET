# WarpSnaket Orchestrator

**WarpSnaket Orchestrator** is an ERC-8004 compliant intelligent AI Agent and modern orchestrator deployed on the WarpSnaket platform. Designed as a Web3 integration testbed, it handles snake game management, multi-task automation, daily operations, and fren farming, while seamlessly connecting onto the Base Mainnet.

🔗 **Live Production App:** [https://warpsnaket.vercel.app/](https://warpsnaket.vercel.app/)

## 🚀 Project Overview

The WarpSnaket platform combines engaging UI with on-chain mechanics (ERC-8021 Transaction Attribution) and AI orchestration (ERC-8004). Key features include:

- **AI Orchestration**: Autonomous agent capabilities for game logic, scheduling, and multi-game management via Model Context Protocol (MCP).
- **Onchain Interaction**: Uses Base network for secure, verifiable transactions and leaderboard actions via Wagmi & viem.
- **Mobile First & PWA Ready**: Fully responsive design with touch controls.
- **Agent Identity**: Fully verifiable Agent-to-Agent (A2A) endpoints.

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router) & React 18
- **Web3 Integration**: Wagmi, Viem, Base Account/Smart Wallets 
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

The agent identity is publicly declarable according to the ERC-8004 standard. You can view the agent metadata card mapping out the supported `eip155:8453` chain and tool capabilities at the root route:
`GET https://warpsnaket.vercel.app/.well-known/agent-card.json`

## 🔌 MCP Connection Guide

The system natively acts as an MCP server with an active endpoint to process standardized Model Context Protocol tools.

**Endpoint URL**: `https://warpsnaket.vercel.app/api/mcp`
**Method**: `POST`  
**Description**: Active MCP server for WarpSnaket Orchestrator Agent.

It supports standard MCP interaction methods (like `tools/list` and `tools/call`). Current active tools exposed include:
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

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd warpsnaket
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Verify Endpoint Health:**
   Once running on `localhost:3000`, test the active agent responses:
   - Metadata validation: `http://localhost:3000/.well-known/agent-card.json`
   - Active identity API: `http://localhost:3000/api/agent`
   - MCP interactions: `http://localhost:3000/api/mcp`