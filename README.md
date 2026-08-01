# 🌊 SkillFlow Protocol

> **Continuous Streaming Human Capital Escrows & Proof-of-Growth Attestations on Stellar Soroban**


[![Stellar Soroban](https://img.shields.io/badge/Stellar-Soroban%20Smart%20Contracts-14B8A6?style=for-the-badge&logo=stellar)](https://soroban.stellar.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blueviolet?style=for-the-badge)](CONTRIBUTING.md)

---

## 💡 Overview

**SkillFlow Protocol** is a decentralized financial primitive on Stellar Soroban designed for **human capital markets**. It transforms talent acquisition, educational sponsorship, and developer grant funding into a **continuous-streaming Real-World Asset (RWA)**.

Traditional grants and talent investments suffer from binary lump-sum risk (where capital is disbursed upfront with no milestone enforcement) or tedious manual invoice processing. SkillFlow solves this by combining:

1. **Continuous Linear Capital Streaming**: Funds stream second-by-second to learners or developers based on active verification.
2. **Proof-of-Growth (PoG) Acceleration**: Cryptographic attestations unlock milestone lump sums and permanently boost continuous streaming rates.
3. **Anti-Delinquency Decay Slashing**: Automated time-decay penalties protect backers if project deadlines are missed without verified milestones.
4. **Skill Token (ST) Equity Shares**: Backers receive liquid shares (SEP-41 tokens) representing fractional claims in talent productivity and revenue vaults.

---

## 🏛️ System Architecture

SkillFlow consists of three core Soroban smart contracts coupled with a high-performance React + Vite front-end client interface:

```
                                +---------------------------+
                                |      Sponsor / Investor   |
                                +-------------+-------------+
                                              |
                                      Stakes Capital (XLM/USDC)
                                              v
+------------------------+      +---------------------------+      +--------------------------+
|  Proof-of-Growth Oracle|----->|     SkillVault Contract   |<---->|  Skill Token (SEP-41)    |
| (PoG Verifier Engine)  |      |   (Soroban Smart Escrow)  |      |  Human Capital Asset     |
+------------------------+      +-------------+-------------+      +--------------------------+
                                              |
                                     Streams Vested Capital
                                              v
                                +---------------------------+
                                |      Learner / Talent     |
                                +---------------------------+
```

### Core Contracts (`/contracts`)

| Contract | Path | Description |
|---|---|---|
| **`skill_vault`** | [`contracts/skill_vault`](file:///Users/japheth/Documents/DRIPS/skill-flow/contracts/skill_vault) | Manages linear capital streaming, milestone unlocking, delinquency decay slashing, and sponsor refunds. |
| **`skill_token`** | [`contracts/skill_token`](file:///Users/japheth/Documents/DRIPS/skill-flow/contracts/skill_token) | Soroban SEP-41 compliant token contract representing fractional governance & yield shares. |
| **`pog_verifier`** | [`contracts/pog_verifier`](file:///Users/japheth/Documents/DRIPS/skill-flow/contracts/pog_verifier) | Cryptographic oracle verifier validating Ed25519 milestone signatures from trusted verifiers. |

---

## 📐 Economic & Mathematical Model

### 1. Dynamic Continuous Streaming Equation
Capital is streamed to the target wallet according to the rate differential:

$$\frac{dF}{dt} = R_{\text{base}} \times \left(1 + \mu(t)\right)$$

- $R_{\text{base}}$: Base streaming rate in stroops/second.
- $\mu(t)$: Proof-of-Growth multiplier (in Basis Points, where $10000 = 1.0\times$).

### 2. Proof-of-Growth Boost Function
When milestone $m_i$ is cryptographically verified, the multiplier accelerates:

$$\mu(t^+) = \mu(t^-) + \alpha_i$$

### 3. Anti-Delinquency Time-Decay Slashing
If a milestone deadline passes $+ T_{\text{grace}}$ without proof submission, unvested capital decays continuously:

$$\Delta S = F_{\text{unvested}} \times \text{slash\_rate\_bps\_per\_sec} \times \Delta t_{\text{delinquent}}$$

Slashed funds are automatically transferred into the **Sponsor Refund Pool**, allowing sponsors to redeem principal by burning Skill Tokens ($ST$):

$$\text{Refund Amount} = ST_{\text{burned}} \times \frac{F_{\text{unvested}} + S_{\text{slashed}}}{ST_{\text{total}}}$$

> For full formal derivations, see [`docs/economic_model.md`](docs/economic_model.md) and [`docs/architecture.md`](docs/architecture.md).


## 🚀 Quickstart & Local Development

### Prerequisites

- **Rust & Cargo**: `rustup target add wasm32-unknown-unknown`
- **Soroban CLI**: `cargo install --locked soroban-cli`
- **Node.js**: `v18.0.0+`
- **Freighter Wallet**: Extension installed in Chrome/Brave/Firefox for Soroban Testnet.

### 1. Repository Setup

```bash
git clone https://github.com/skill-flow/skill-flow-protocol.git
cd skill-flow
```

### 2. Build & Test Soroban Smart Contracts

```bash
# Build WASM binaries for all contracts
cargo build --target wasm32-unknown-unknown --release

# Run comprehensive Rust unit & integration test suites
cargo test
```

### 3. Run Frontend Web App

```bash
# Install NPM dependencies
npm install

# Start Vite live dev server
npm run dev
```

Visit `http://localhost:5173` in your browser to interact with the dashboard, Freighter wallet connect, talent trajectory registration, and PoG milestone simulator.

## 🤝 Contributing

We welcome contributions from developers, designers, and Web3 researchers! Please review our [`CONTRIBUTING.md`] for detailed instructions on how to propose changes, pick up Drips Wave issues, and submit pull requests.

---

## 🛡️ Security

Security is paramount. If you discover a security vulnerability in SkillFlow Protocol smart contracts or frontend client, please read our [`SECURITY.md`] policy for responsible disclosure guidelines.

---

## 📄 License

SkillFlow Protocol is open-source software licensed under the [MIT License](LICENSE).
