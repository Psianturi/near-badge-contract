# NEAR Badge - Smart Contract

A simple and powerful Proof of Attendance Protocol (POAP) for the NEAR ecosystem. This repository contains the core smart contract logic for the NEAR Badge project.

## The Problem
Rewarding community participation is vital for ecosystem growth. However, current methods for airdropping assets like POAPs are often cumbersome for event organizers. The process of manually collecting and verifying hundreds of wallet addresses is a significant point of friction and a barrier to adoption for non-technical community managers.

## Our Solution: The "Magic Link" Flow
NEAR Badge is designed with simplicity as its core principle. We solve the problem using a "Magic Link" flow:

1.  **Create Event:** An organizer calls the `create_event` function on the contract.
2.  **Upload Emails:** A simple script allows the organizer to upload a CSV of attendee emails (data they already have from platforms like Luma, Zoom, etc.).
3.  **Claim Badge:** Attendees receive a unique link. They simply click it, connect their wallet, verify ownership of their email, and claim their NFT badge.

This process removes the need for organizers to ever handle wallet addresses directly, making it incredibly easy to adopt.

## Current Status & Live Demo (Testnet)
- ✅ **Deployed to Testnet:** The initial version of the contract is live.
- **Contract Address:** `nearbadge-contract.testnet`

You can interact with the deployed contract directly via the NEAR CLI.

**1. Create a New Event:**
```bash
near call badge-dev.testnet create_event '{"name": "My First Community Call", "description": "A test event for our new badge system!"}' --accountId YOUR_ACCOUNT.testnet