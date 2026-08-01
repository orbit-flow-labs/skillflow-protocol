# SkillFlow Protocol — Economic & Mathematical Model

"SkillFlow Protocol" constructs a decentralized market for human capital on Stellar (Soroban). By transforming skill acquisition into a continuous-streaming Real World Asset (RWA), SkillFlow aligns incentives between early talent (Learners) and financial backers (Sponsors).

---

## 1. Core Financial Mechanics

### 1.1 The Skill Vault Primitive
A `SkillVault` represents a single, verifiable human capital trajectory $V$.
- **Staked Principal ($P$)**: Total capital deposited by sponsors into the vault.
- **Vested Principal ($F_{vested}$)**: Capital unlocked to the learner over time or upon milestone completion.
- **Unvested Principal ($F_{unvested}$)**: Capital remaining in escrow subject to release or slashing.

$$\text{Vault Balance } B(t) = P - F_{claimed}(t)$$

---

## 2. Dynamic Streaming Release Model

Capital does not unlock in single lump sums. Instead, it streams continuously according to a differential rate equation:

$$\frac{dF}{dt} = R_{base} \times \left(1 + \mu(t)\right)$$

Where:
- $R_{base}$: The baseline streaming rate configured at vault initialization (in XLM or USDC stroops/sec).
- $\mu(t)$: The **Proof-of-Growth Accelerator Multiplier** (in Basis Points, where $10000 = 1.0\times$).

### 2.1 Multiplier Boost Function
When a learner successfully submits a verifiable Proof-of-Growth (PoG) for milestone $m_i$, the multiplier $\mu$ accelerates permanently:

$$\mu(t^+) = \mu(t^-) + \alpha_{i}$$

Where $\alpha_{i}$ is the milestone accelerator boost (e.g., $+2500$ bps = $+0.25\times$).

---

## 3. Proof-of-Growth (PoG) Unlock Mechanics

Each milestone $m_i$ specifies two payout components upon cryptographic attestation:
1. **Instant Lump-Sum Unlock ($\gamma_i$)**: A percentage of total staked capital unlocked immediately.
2. **Streaming Acceleration ($\alpha_i$)**: A permanent increase to the rate multiplier.

$$\Delta F_{instant} = P \times \gamma_i$$

---

## 4. Slashing & Anti-Delinquency Decay Mechanics

To prevent passive farming and capital lockup, SkillVaults enforce a time-decay slashing function if deadlines pass without PoG submissions.

### 4.1 Grace Period & Delinquency State
If a milestone target deadline $T_{deadline}$ passes without a verified PoG submission, a Grace Period $T_{grace}$ begins. Once $t > T_{deadline} + T_{grace}$, the vault enters the **Delinquent** state.

### 4.2 Exponential Decay Slashing Formula
During delinquency, unvested funds decay according to a rate penalty $\lambda$:

$$S_{slashed}(t) = F_{unvested}(t) \times \left[ 1 - e^{-\lambda (t - T_{deadline} - T_{grace})} \right]$$

In discrete Soroban execution, the slashed penalty per second is computed as:

$$\Delta S = F_{unvested} \times \text{slash\_rate\_bps\_per\_sec} \times \Delta t_{delinquent}$$

### 4.3 Capital Redistribution & Sponsor Protection
Slashed funds are removed from the learner's unlockable ceiling and allocated directly into the **Sponsor Refund Pool**.
Sponsors can burn their Skill Tokens $ST$ to withdraw their proportional share of remaining unvested principal plus slashed penalties:

$$\text{Refund Amount} = ST_{burned} \times \frac{F_{unvested} + S_{slashed}}{ST_{total}}$$

---

## 5. Skill Token (ST) Valuation & Bonding Curve

Skill Tokens represent liquid shares of the vault's future yield and capital pool.

- **Initial Issuance**: 1 ST per 1 XLM/USDC staked at vault creation ($P_0 = 1.0$).
- **Valuation Growth**: As growth proofs are validated, the vault health score $H \in [0, 100]$ increases. Sponsors who hold ST gain exposure to talent performance and future revenue-sharing dividends.
