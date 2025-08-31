# NEAR Badge - Smart Contract

![Status: Active](https://img.shields.io/badge/status-active-success.svg) ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

The core smart contract logic for the NEAR Badge project, a simple and powerful Proof of Attendance Protocol (POAP) for the NEAR ecosystem.

## Project Architecture

This project consists of two main parts:
1.  **Smart Contract (This Repository):** Handles all on-chain logic, including roles, event management, and NFT minting.
2.  **Frontend Application:** A user-friendly React interface for interacting with this contract. [Link to Frontend Repo](https://github.com/Psianturi/near-badge-app)

## The Problem
Rewarding community participation is vital for ecosystem growth. However, current methods for airdropping assets like POAPs are often cumbersome for event organizers. The process of manually collecting and verifying hundreds of wallet addresses is a significant point of friction.

## Our Solution
NEAR Badge is designed with simplicity as its core principle. The contract implements a robust role-based system (`Owner` / `Organizer`) that allows for decentralized event management, while the frontend provides a seamless experience for both organizers and attendees.

## Live on Testnet
-   ✅ **Status:** Deployed and fully functional on NEAR Testnet.
-   **Latest Deployment TX:** [View on Explorer](https://explorer.testnet.near.org/transactions/DiKApzgxagEcf8MUfUKBBotNGQXtWLsMHs1fES2j1t6W)

## Key Features
-   **Role-Based Access Control:** A contract `owner` can assign `organizer` roles to other accounts, allowing them to manage events.
-   **Complete Event Lifecycle:** Organizers can create events, add attendees to a `whitelist`, and view event details.
-   **NFT Badge Claiming:** Whitelisted attendees can call the `claim_badge` function to mint their unique POAP (NFT) directly to their wallet.
-   **NEP-171 Compliant Views:** Includes standard view methods (`nft_token`, `nft_tokens_for_owner`) to ensure badges are visible in compatible NEAR wallets.

## CLI Usage Examples
You can test the full workflow directly via the NEAR CLI.

**1. Add an Organizer (as the Owner `near-badge.testnet`):**
```bash
near call near-badge.testnet add_organizer '{"account_id": "ORGANIZER_ACCOUNT.testnet"}' --accountId near-badge.testnet

**2. **
```bash
near call near-badge.testnet create_event '{"name": "My Test Event", "description": "A cool event"}' --accountId ORGANIZER_ACCOUNT.testnet

near call near-badge.testnet add_to_whitelist '{"event_name": "My Test Event", "account_ids": ["ATTENDEE_1.testnet", "ATTENDEE_2.testnet"]}' --accountId ORGANIZER_ACCOUNT.testnet

near call near-badge.testnet claim_badge '{"event_name": "My Test Event"}' --accountId ATTENDEE_1.testnet --deposit 0.1

