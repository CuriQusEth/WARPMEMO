# Warp Memory & WarpMemo Orchestrator

Warp Memory is a fast-paced, high-stakes "Warp Racing" memory matching game built for the Base blockchain ecosystem. Set in a sci-fi cyberpunk universe, it combines cognitive speed challenges with seamless on-chain Web3 integration.

This project also houses the **WarpMemo Orchestrator**, an advanced, ERC-8004 compliant AI Agent equipped with Model Context Protocol (MCP) capabilities to automate, optimize, and orchestrate warp races and ecosystem mechanics.

## 🏁 Warp Racing Overview
In Warp Memory, players test their recall against the clock using the "Warp" mechanic to lock in sequences. Every interaction is tied to your identity on the Base chain via cutting-edge wallet infrastructure.
- **Mobile-First Cyberpunk UI:** Built with React, Tailwind CSS, and Framer Motion for neon-fueled aesthetics.
- **On-Chain Identity & Leaderboards:** Uses Sign-In with Ethereum (SIWE) to securely authenticate players.
- **Seamless Wallet Connections:** Built with `wagmi` v3 and `@tanstack/react-query` with out-of-the-box support for Coinbase Smart Wallet and injected providers.
- **ERC-8021 Transaction Attribution:** Uses Schema 0 transaction attribution under the `batchwizard` Builder Code.

## 🤖 EIP-8004 AI Agent Registration
The **WarpMemo Orchestrator** is built as a canonical AI Agent, fully registered using the `EIP-8004: Agent Identity` standard to allow autonomous multi-track orchestration and agent-to-agent operations.
- **Agent Card:** The public identity manifest is hosted at `/.well-known/agent-card.json`. It defines the agent's smart wallet, platform endpoints, supported on-chain interactions (EIP-155:8453), and competitive orchestration skills.
- **Agent Metadata Endpoint:** Accessible at `/api/agent` representing live status and capability metadata.

## 🔗 MCP (Model Context Protocol) Connection Guide
To allow programmatic interaction and complex racing strategies, the WarpMemo Orchestrator exposes a fully compliant JSON-RPC 2.0 MCP server.

**Endpoint:** `/api/mcp`

The server handles standard MCP actions:
- **`initialize`**: Shakes hands and verifies protocol versions (2024-11-05).
- **`tools/list`**: Exposes the Agent's capabilities:
  - `get_race_status`: Query the current open warp races.
  - `start_race`: Initialize a new racing session.
  - `get_leaderboard`: Fetch competitive player rankings.
  - `optimize_speed`: Trigger the Orchestrator's performance optimization routines.
  - `get_track_info`: (Requires `trackId`) Returns exact metadata about the hazards and length of a track.
- **`tools/call`**: Executes the above operations securely returning structured responses. 

## 🌐 Built on Base
Deployed on Base Mainnet, this project utilizes fast block times and low transaction fees to offer a completely frictionless Web3 gaming experience. By integrating Coinbase Smart Wallet functionality, onboarding new racers occurs in seconds—no extensions needed.

## Contributing & Setup
1. Clone the repository
2. Install dependencies via `npm install`
3. Run the development server via `npm run dev` (Starts Vite SPA + Express API layer on port 3000)
4. Or build and serve for production using `npm run build` & `npm run start`.

Enjoy warping your capabilities to Base, commanded by your AI Orchestrator!
