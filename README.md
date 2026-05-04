# Warp Memory

Warp Memory is a fast-paced, sci-fi themed memory matching game with a unique "Warp" mechanic. This version features on-chain integration on Base Mainnet, ERC-8021 transaction attribution using "batchwizard" as its Builder Code, and Sign-In with Ethereum (SIWE) for high-score identity tying, leveraging the latest Wagmi v3 and Base Account functionality.

## Features
- Complete ERC-8021 standard compliance with TypeScript utilities in `src/lib/erc8021/`
- Automatic attribution injection using React hooks (`useERC8021Transaction`)
- "Say GM" simple on-chain transaction showing builder code integration in action
- Full SIWE signature authentication for leaderboards
- Coinbase Smart Wallet / injected providers compatibility via `@tanstack/react-query` & `wagmi`
- Mobile-first, neon-fueled Sci-Fi Cyberpunk UI with Tailwind CSS & Framer Motion

## ERC-8021 Specifications Implemented
The game integrates Schema 0 validation and payload composition natively.
Check `src/lib/erc8021` for utilities capable of:
- generating arbitrary attribution suffixes for normal and batched transactions.
- security validations ensuring the correct `8021` hexadecimal string formatting.

Enjoy warping your memory metrics to Base!
