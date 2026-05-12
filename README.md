# Warp Memory & WarpMemo Orchestrator

Warp Memory is a fast-paced, sci-fi themed memory matching game with a unique "Warp" mechanic. This version features advanced on-chain integration on Base Mainnet, ERC-8021 transaction attribution using "batchwizard" as its Builder Code, and Sign-In with Ethereum (SIWE) for high-score identity tying, leveraging the latest Wagmi v3 and Base Account functionality.

Additionally, this project includes the **WarpMemo Orchestrator**, an ERC-8004 compliant AI agent with fully functional MCP (Model Context Protocol) support and agent APIs.

## Game Features
- **Cyberpunk UI**: Mobile-first, neon-fueled Sci-Fi interface using Tailwind CSS & Framer Motion
- **ERC-8021 Attribution**: Automatic attribution injection via React hooks (`useERC8021Transaction`) on Schema 0
- **On-Chain Transactions**: "Say GM" simple on-chain transaction showcasing builder code integration
- **Web3 Auth**: Full SIWE signature authentication for the leaderboard
- **Wallet Support**: Coinbase Smart Wallet and injected providers compatibility via `@tanstack/react-query` & `wagmi`

## AI Agent & Orchestrator (ERC-8004)
The WarpMemo Orchestrator handles memo management, content creation, multi-task automation, and daily operations.
- **Agent Card**: Served at `/.well-known/agent-card.json` complying with ERC-8004 identity registration specifications.
- **Agent Control API**: Interactive endpoint at `/api/agent` supplying agent metadata.
- **MCP Server**: Fully active Model Context Protocol endpoints at `/api/mcp` for agent-to-agent operations and command executions.

Enjoy warping your memory metrics to Base, commanded by your AI Orchestrator!
