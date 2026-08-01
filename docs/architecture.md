# SkillFlow Protocol — System Architecture & Soroban Design

"SkillFlow Protocol" is a Soroban-native smart contract framework on Stellar designed for decentralized human capital markets.

---

## 1. System Components Architecture

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

---

## 2. Soroban Storage Keys & Layout

The `skill_vault` contract uses key-value instance storage keys for deterministic state isolation:

| DataKey | Data Type | Description |
|---|---|---|
| `Admin` | `Address` | Protocol administrator address |
| `Learner` | `Address` | Talent receiving streamed capital |
| `AssetToken` | `Address` | SAC / Stellar Asset address for staking collateral |
| `SkillToken` | `Address` | SEP-41 Skill Token contract address |
| `PoGVerifier` | `Address` | Proof-of-Growth attestation verifier address |
| `VaultStatus` | `VaultStatus` | Enum (`Active`, `Delinquent`, `Graduated`, `Terminated`) |
| `StreamConfig` | `StreamConfig` | Base rate, current multiplier, claimed/slashed stats |
| `MilestoneCount` | `u32` | Total registered milestones count |
| `Milestone(u32)` | `Milestone` | Milestone struct by ID |
| `Sponsor(Address)` | `SponsorPosition` | Individual sponsor staked position |
| `TotalSkillTokens` | `i128` | Total outstanding skill equity shares |

---

## 3. Sequence Flow

### 3.1 Vault Initialization & Staking
1. **Learner / Admin** deploys `skill_vault` contract for a specific skill (e.g. "Soroban Smart Contract Engineering").
2. **Sponsor** calls `deposit_stake(sponsor, amount)`.
   - Transfers collateral asset (USDC/XLM) from sponsor to `skill_vault`.
   - Mints `SkillToken` shares to sponsor proportional to investment.

### 3.2 Proof-of-Growth Submission & Acceleration
1. **Learner** completes milestone (e.g. passes test suite, merges GitHub PR, earns certification).
2. **Learner** calls `submit_growth_proof(milestone_id, proof_hash, signature)`.
3. Contract validates attestation:
   - Unlocks percentage lump sum of total capital.
   - Boosts continuous streaming multiplier $\mu \leftarrow \mu + \alpha$.

### 3.3 Delinquency & Slashing Refund
1. If milestone deadline expires $+ T_{grace}$ without proof submission:
2. Any user/sponsor calls public function `trigger_slash_check(milestone_id)`.
3. Contract calculates overdue duration and slashes unvested principal $\Delta S$.
4. **Sponsor** calls `withdraw_sponsor_refund(sponsor, tokens_to_burn)` to burn Skill Tokens and redeem remaining principal + slashed penalties.
