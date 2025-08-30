# NEAR Badge - Smart Contract

A simple and powerful Proof of Attendance Protocol (POAP) for the NEAR ecosystem. This repository contains the core smart contract logic for the NEAR Badge project.

## The Problem
Rewarding community participation is vital for ecosystem growth. However, current methods for airdropping assets like POAPs are often cumbersome for event organizers. The process of manually collecting and verifying hundreds of wallet addresses is a significant point of friction.

## Our Solution: The "Magic Link" Flow
NEAR Badge is designed with simplicity as its core principle. We solve the problem using a "Magic Link" flow, where organizers can whitelist attendees using an off-chain mechanism, removing the need for them to handle wallet IDs directly.

## Current Status & Live Demo (Testnet)
- ✅ **Deployed to Testnet:** The contract is live with core functionality.
- **Contract Address:** `badge-master.testnet`
- **Latest Deployment TX:** [View on Explorer](https://explorer.testnet.near.org/transactions/HeF9rWP8gPZ1FWoLxN9dFe4QqonSjKMGYjusuAsaEbeD)
- **Available Functions:** `init`, `add_organizer`, `create_event`, `add_to_whitelist`, `claim_badge`, and various view methods.

You can test the full workflow directly via the NEAR CLI.

**1. Create an Event (as the owner):**
```bash
near call badge-master.testnet create_event '{"name": "My Test Event", "description": "A cool event"}' --accountId badge-master.testnet

near call badge-master.testnet add_to_whitelist '{"event_name": "My Test Event", "account_ids": ["YOUR_FRIEND.testnet"]}' --accountId badge-master.testnet