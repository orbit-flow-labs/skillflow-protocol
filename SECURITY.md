# Security Policy 🛡️

SkillFlow Protocol handles financial capital streams, milestone escrows, and Ed25519 cryptographic attestations on Stellar Soroban. Security, safety of funds, and smart contract resilience are our highest priorities.

---

## 🔒 Supported Versions

We provide security updates for the following versions of SkillFlow components:

| Component | Version | Supported |
|---|---|---|
| `contracts/skill_vault` | `v1.0.x` | ✅ Supported |
| `contracts/skill_token` | `v1.0.x` | ✅ Supported |
| `contracts/pog_verifier` | `v1.0.x` | ✅ Supported |
| Frontend Web Client | `v1.0.x` | ✅ Supported |

---

## 🚨 Reporting a Vulnerability

If you believe you have found a security vulnerability in any SkillFlow smart contract or client interface, please **DO NOT** create a public GitHub issue.

Instead, please report it privately via email:

📧 **Security Email**: `skillfloworg@gmail.com`

### What to Include in Your Report

1. **Title**: Concise summary of the vulnerability.
2. **Impact**: Description of potential attack vector (e.g., unauthorized funds withdrawal, unvested stream manipulation, signature replay).
3. **Target Component**: Contract name, line number, or API endpoint.
4. **Proof of Concept (PoC)**: Minimal reproducing code, command script, or Rust unit test case demonstrating the vulnerability.
5. **Mitigation Suggestion**: Recommended code patch if available.

---

## ⌛ Vulnerability Response Timeline

- **Initial Acknowledgment**: Within 24 hours of report receipt.
- **Triage & Risk Assessment**: Within 48 hours.
- **Fix & Patch Deployment**: Critical flaws patched within 5 business days.
- **Public Disclosure**: Coordinated disclosure after fix has been audited and deployed on-chain.

---

## 🛡️ Smart Contract Security & Safeguards

- **Soroban Instance Auth**: All administrative functions require explicit contract invocation signatures (`e.require_auth()`).
- **Ed25519 Attestation Verification**: Proof-of-Growth verifications perform cryptographic signature checks on hash payloads (`milestone_id + proof_hash`).
- **Bounded Math & Overflow Protection**: All mathematical operations utilize checked arithmetic (`checked_add`, `checked_mul`) with explicit integer bounds to prevent overflow/underflow vulnerabilities.
- **Reentrancy Protection**: State updates precede asset transfers following the Checks-Effects-Interactions pattern.

---

Thank you for helping keep SkillFlow Protocol and the Stellar Soroban ecosystem secure! 🚀
