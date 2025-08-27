# NEAR Badge - Smart Contract

A simple and powerful Proof of Attendance Protocol (POAP) for the NEAR ecosystem. This repository contains the core smart contract logic for the NEAR Badge project.

## The Problem
Rewarding community participation is vital for ecosystem growth. However, current methods for airdropping assets like POAPs are often cumbersome for event organizers. The process of manually collecting and verifying hundreds of wallet addresses is a significant point of friction and a barrier to adoption for non-technical community managers.

## Our Solution: The "Magic Link" Flow
NEAR Badge is designed with simplicity as its core principle. We solve the problem using a "Magic Link" flow, where organizers can whitelist attendees using email addresses instead of collecting wallet IDs.

This process removes the need for organizers to ever handle wallet addresses directly, making it incredibly easy to adopt.

## Current Status & Live Demo (Testnet)
- ✅ **Deployed to Testnet:** The contract is live and functional.
- **Contract Address:** `nearbadge-contract.testnet`
- **Latest Deployment TX:** [View on Explorer](https://explorer.testnet.near.org/transactions/6nu5QYTZtkooGVKqC7j32GLQmKfgfT2WnAWxrFiP9gKZ)
- **Available Functions:** `create_event`, `get_event`

You can interact with the deployed contract directly via the NEAR CLI.

**1. Create a New Event:**
*(Use your account ID that has login access, for example `posmproject.testnet` or any other you have logged in with)*
```bash
near call nearbadge-contract.testnet create_event '{"name": "My First Build Buddies", "description": "A test event on the new contract!"}' --accountId YOUR_ACCOUNT.testnet