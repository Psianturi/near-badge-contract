# NEAR Badge - Smart Contract

A simple and powerful Proof of Attendance Protocol (POAP) for the NEAR ecosystem. This repository contains the core smart contract logic for the NEAR Badge project.

## The Problem
Rewarding community participation is vital for ecosystem growth. However, current methods for airdropping assets like POAPs are often cumbersome for event organizers. The process of manually collecting and verifying hundreds of wallet addresses is a significant point of friction and a barrier to adoption for non-technical community managers.

## Our Solution: The "Magic Link" Flow
NEAR Badge is designed with simplicity as its core principle. We solve the problem using a "Magic Link" flow, where organizers can whitelist attendees using an off-chain mechanism, removing the need for them to handle wallet IDs directly.

## Current Status & Live Demo (Testnet)
- ✅ **Deployed to Testnet:** The contract is live and functional.
- **Contract Address:** `poap-badge.testnet`
- **Latest Deployment TX:** [View on Explorer](https://explorer.testnet.near.org/transactions/FuDyBdrV9QRXYuoJ17JjgoVvEnhA7gzUyTtpmPM8cNqP)
- **Available Functions:** `init`, `add_organizer`, `create_event`, `get_event`, `is_organizer`

You can interact with the deployed contract directly via the NEAR CLI.

**1. Add a New Organizer:**
*(This can only be called by the owner: `poap-badge.testnet`)*
```bash
near call poap-badge.testnet add_organizer '{"account_id": "YOUR_ORGANIZER.testnet"}' --accountId poap-badge.testnet