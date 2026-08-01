use soroban_sdk::{contracttype, Address, BytesN, Symbol};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum VaultStatus {
    Uninitialized,
    Active,
    Graduated,
    Delinquent,
    Terminated,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Milestone {
    pub id: u32,
    pub description: Symbol,
    pub proof_hash: BytesN<32>,
    pub target_deadline: u64,
    pub unlocked: bool,
    pub unlock_pct_bps: u32,       // Basis points (e.g. 2500 = 25%)
    pub accelerator_bps: u32,      // Streaming rate boost (e.g. 5000 = +50%)
    pub verifier: Address,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StreamConfig {
    pub base_rate_per_sec: i128,   // Base release amount per second (stroops or smallest unit)
    pub current_multiplier_bps: u32, // Current multiplier in BPS (10000 = 1.0x)
    pub last_claim_timestamp: u64,
    pub total_staked: i128,
    pub total_claimed: i128,
    pub total_slashed: i128,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SponsorPosition {
    pub staked_amount: i128,
    pub skill_tokens_held: i128,
    pub entry_timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum DataKey {
    Admin,
    Learner,
    AssetToken,
    SkillToken,
    PoGVerifier,
    VaultStatus,
    StreamConfig,
    MilestoneCount,
    Milestone(u32),
    Sponsor(Address),
    TotalSkillTokens,
    GracePeriodSecs,
    SlashRateBpsPerSec,
}
