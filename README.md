# NEAR Badge - Smart Contract

![Status: Active](https://img.shields.io/badge/status-active-success.svg) ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

The core smart contract logic for the **NEAR Badge project**, a simple and powerful **Proof of Attendance Protocol (POAP)** for the NEAR ecosystem.

---

## 📌 Project Architecture

This project consists of two main parts:

1. **Smart Contract (This Repository):**  
   Handles all on-chain logic, including roles, event management, and NFT minting.

2. **Frontend Application:**  
   A user-friendly React interface for interacting with this contract.  
   👉 [Frontend Repo](https://github.com/Psianturi/near-badge-app)

---

## 🚨 The Problem
Rewarding community participation is vital for ecosystem growth. However, current methods for airdropping assets like POAPs are often cumbersome for event organizers.  
The process of manually collecting and verifying hundreds of wallet addresses is a **significant point of friction**.

---

## 💡 Our Solution
**NEAR Badge** is designed with simplicity as its core principle:  

- Implements a **role-based system** (`Owner` / `Organizer`) for decentralized event management.  
- Provides an intuitive frontend for organizers and attendees.  
- Fully on-chain POAP issuance without manual wallet collection.

---

## 🌐 Live on Testnet
- ✅ **Status:** Deployed and fully functional on NEAR Testnet.  
- **Latest Deployment TX:** [View on Explorer](https://explorer.testnet.near.org/transactions/9nNsSeysRHcmdB2dUG4iRfobkaKT5dyfm2wZuPNrYFcB)  
- **Contract Account:** [`near-badge.testnet`](https://explorer.testnet.near.org/accounts/near-badge.testnet)

---

## 🔑 Key Features
- **Role-Based Access Control:**  
  Contract `owner` can assign `organizer` roles to other accounts.

- **Complete Event Lifecycle:**  
  Organizers can create events, whitelist attendees, and view details.

- **NFT Badge Claiming:**  
  Whitelisted attendees can mint their unique POAP (NFT) using `claim_badge`.

- **NEP-171 Compliant Views:**  
  Supports standard NFT methods (`nft_metadata`, `nft_token`, `nft_tokens_for_owner`)  
  → ensures badges are visible in compatible NEAR wallets.

---

## 🛠️ CLI Usage Examples

You can test the full workflow directly via the **NEAR CLI**.

### Full Command Script (Step-by-Step)

1. **Build the contract**
   ```bash
   npm run build

2. **Add an organizer**
  ```bash
near call near-badge.testnet add_organizer \
  '{"account_id": "ORGANIZER_ACCOUNT.testnet"}' \
  --accountId near-badge.testnet

3. **Create an event**
  ```bash
  near call near-badge.testnet create_event \
  '{"name": "My Test Event", "description": "A cool event"}' \
  --accountId ORGANIZER_ACCOUNT.testnet

4. **Add attendees to whitelist**
  ```bash
  near call near-badge.testnet add_to_whitelist \
  '{"event_name": "My Test Event", "account_ids": ["ATTENDEE_1.testnet", "ATTENDEE_2.testnet"]}' \
  --accountId ORGANIZER_ACCOUNT.testnet

5. **Claim a badge (as attendee)**
  ```bash
  near call near-badge.testnet claim_badge \
  '{"event_name": "My Test Event"}' \
  --accountId ATTENDEE_1.testnet \
  --deposit 0.1


