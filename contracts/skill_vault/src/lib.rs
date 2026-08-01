#![no_std]

mod types;
#[cfg(test)]
mod test;

use soroban_sdk::{
    contract, contractimpl, token, Address, Bytes, BytesN, Env, Symbol,
};
use types::{DataKey, Milestone, SponsorPosition, StreamConfig, VaultStatus};

#[contract]
pub struct SkillVaultContract;

#[contractimpl]
impl SkillVaultContract {
    /// Initialize a new Skill Vault for a specific talent trajectory
    pub fn initialize(
        e: Env,
        admin: Address,
        learner: Address,
        asset_token: Address,
        skill_token: Address,
        pog_verifier: Address,
        base_rate_per_sec: i128,
        grace_period_secs: u64,
    ) {
        if e.storage().instance().has(&DataKey::VaultStatus) {
            panic!("Already initialized");
        }

        admin.require_auth();

        e.storage().instance().set(&DataKey::Admin, &admin);
        e.storage().instance().set(&DataKey::Learner, &learner);
        e.storage().instance().set(&DataKey::AssetToken, &asset_token);
        e.storage().instance().set(&DataKey::SkillToken, &skill_token);
        e.storage().instance().set(&DataKey::PoGVerifier, &pog_verifier);
        e.storage().instance().set(&DataKey::VaultStatus, &VaultStatus::Active);
        e.storage().instance().set(&DataKey::MilestoneCount, &0u32);
        e.storage().instance().set(&DataKey::GracePeriodSecs, &grace_period_secs);
        e.storage().instance().set(&DataKey::SlashRateBpsPerSec, &1u32); // 0.01% per sec delinquent default

        let config = StreamConfig {
            base_rate_per_sec,
            current_multiplier_bps: 10000, // 1.0x baseline
            last_claim_timestamp: e.ledger().timestamp(),
            total_staked: 0,
            total_claimed: 0,
            total_slashed: 0,
        };

        e.storage().instance().set(&DataKey::StreamConfig, &config);
    }

    /// Add a verifiable growth milestone to the Skill Vault
    pub fn add_milestone(
        e: Env,
        description: Symbol,
        deadline: u64,
        unlock_pct_bps: u32,
        accelerator_bps: u32,
        verifier: Address,
    ) -> u32 {
        let admin: Address = e.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut count: u32 = e.storage().instance().get(&DataKey::MilestoneCount).unwrap_or(0);
        count += 1;

        let milestone = Milestone {
            id: count,
            description,
            proof_hash: BytesN::from_array(&e, &[0u8; 32]),
            target_deadline: deadline,
            unlocked: false,
            unlock_pct_bps,
            accelerator_bps,
            verifier,
        };

        e.storage().instance().set(&DataKey::Milestone(count), &milestone);
        e.storage().instance().set(&DataKey::MilestoneCount, &count);

        count
    }

    /// Sponsor stakes capital into the Skill Vault, minting Skill Tokens
    pub fn deposit_stake(e: Env, sponsor: Address, amount: i128) {
        sponsor.require_auth();
        assert!(amount > 0, "Amount must be positive");

        let status: VaultStatus = e.storage().instance().get(&DataKey::VaultStatus).unwrap();
        assert!(status == VaultStatus::Active, "Vault is not active");

        let asset_token: Address = e.storage().instance().get(&DataKey::AssetToken).unwrap();
        let skill_token: Address = e.storage().instance().get(&DataKey::SkillToken).unwrap();

        // Transfer capital from sponsor into vault
        let client = token::Client::new(&e, &asset_token);
        client.transfer(&sponsor, &e.current_contract_address(), &amount);

        // Update stream config
        let mut config: StreamConfig = e.storage().instance().get(&DataKey::StreamConfig).unwrap();
        config.total_staked += amount;
        e.storage().instance().set(&DataKey::StreamConfig, &config);

        // Update sponsor position & mint Skill Tokens 1:1
        let mut position = e.storage().instance().get(&DataKey::Sponsor(sponsor.clone())).unwrap_or(
            SponsorPosition {
                staked_amount: 0,
                skill_tokens_held: 0,
                entry_timestamp: e.ledger().timestamp(),
            }
        );

        position.staked_amount += amount;
        position.skill_tokens_held += amount;
        e.storage().instance().set(&DataKey::Sponsor(sponsor.clone()), &position);

        let total_skill: i128 = e.storage().instance().get(&DataKey::TotalSkillTokens).unwrap_or(0);
        e.storage().instance().set(&DataKey::TotalSkillTokens, &(total_skill + amount));

        // Call mint on skill_token contract (or internal balance representation)
        let _skill_client = token::Client::new(&e, &skill_token);
        // If skill_token is a custom token contract or SAC:
        // _skill_client.mint(&sponsor, &amount);
    }

    /// Submit a cryptographic Proof-of-Growth (PoG) to unlock milestone & accelerate stream
    pub fn submit_growth_proof(
        e: Env,
        milestone_id: u32,
        proof_hash: BytesN<32>,
        _attestation_sig: Bytes,
    ) {
        let learner: Address = e.storage().instance().get(&DataKey::Learner).unwrap();
        learner.require_auth();

        let mut milestone: Milestone = e
            .storage()
            .instance()
            .get(&DataKey::Milestone(milestone_id))
            .expect("Milestone not found");

        assert!(!milestone.unlocked, "Milestone already unlocked");

        // Verify attestation with PoG verifier address
        // In full flow, call pog_verifier contract or check signature
        milestone.proof_hash = proof_hash;
        milestone.unlocked = true;

        e.storage().instance().set(&DataKey::Milestone(milestone_id), &milestone);

        // 1. Instantly release unlock_pct_bps of total staked capital to learner
        let mut config: StreamConfig = e.storage().instance().get(&DataKey::StreamConfig).unwrap();
        let instant_unlock = (config.total_staked * milestone.unlock_pct_bps as i128) / 10000;

        if instant_unlock > 0 {
            let asset_token: Address = e.storage().instance().get(&DataKey::AssetToken).unwrap();
            let client = token::Client::new(&e, &asset_token);
            client.transfer(&e.current_contract_address(), &learner, &instant_unlock);
            config.total_claimed += instant_unlock;
        }

        // 2. Accelerate continuous streaming rate multiplier
        config.current_multiplier_bps += milestone.accelerator_bps;
        e.storage().instance().set(&DataKey::StreamConfig, &config);
    }

    /// Learner claims continuously streamed unallocated funds
    pub fn claim_streamed_funds(e: Env) -> i128 {
        let learner: Address = e.storage().instance().get(&DataKey::Learner).unwrap();
        learner.require_auth();

        let mut config: StreamConfig = e.storage().instance().get(&DataKey::StreamConfig).unwrap();
        let current_time = e.ledger().timestamp();
        let elapsed = current_time.saturating_sub(config.last_claim_timestamp);

        if elapsed == 0 {
            return 0;
        }

        let vested = (elapsed as i128 * config.base_rate_per_sec * config.current_multiplier_bps as i128) / 10000;
        let available = (config.total_staked - config.total_claimed - config.total_slashed).max(0);
        let to_claim = vested.min(available);

        if to_claim > 0 {
            config.total_claimed += to_claim;
            config.last_claim_timestamp = current_time;
            e.storage().instance().set(&DataKey::StreamConfig, &config);

            let asset_token: Address = e.storage().instance().get(&DataKey::AssetToken).unwrap();
            let client = token::Client::new(&e, &asset_token);
            client.transfer(&e.current_contract_address(), &learner, &to_claim);
        }

        to_claim
    }

    /// Public trigger function: Slashing mechanism for missed deadlines & stagnancy
    pub fn trigger_slash_check(e: Env, milestone_id: u32) -> i128 {
        let milestone: Milestone = e
            .storage()
            .instance()
            .get(&DataKey::Milestone(milestone_id))
            .expect("Milestone not found");

        let current_time = e.ledger().timestamp();
        let grace_period: u64 = e.storage().instance().get(&DataKey::GracePeriodSecs).unwrap_or(86400);

        if milestone.unlocked || current_time <= milestone.target_deadline + grace_period {
            return 0; // Not delinquent
        }

        // Vault becomes Delinquent
        e.storage().instance().set(&DataKey::VaultStatus, &VaultStatus::Delinquent);

        let mut config: StreamConfig = e.storage().instance().get(&DataKey::StreamConfig).unwrap();
        let unvested = (config.total_staked - config.total_claimed - config.total_slashed).max(0);

        let overdue_secs = current_time - (milestone.target_deadline + grace_period);
        let slash_rate: u32 = e.storage().instance().get(&DataKey::SlashRateBpsPerSec).unwrap_or(1);

        // Calculate slashed amount
        let slashed = ((unvested * slash_rate as i128 * overdue_secs as i128) / 10000).min(unvested);

        if slashed > 0 {
            config.total_slashed += slashed;
            // Reduce multiplier to discourage delinquent farming
            config.current_multiplier_bps = config.current_multiplier_bps.saturating_sub(2500).max(1000);
            e.storage().instance().set(&DataKey::StreamConfig, &config);
        }

        slashed
    }

    /// Sponsor redeems Skill Tokens for remaining unvested staked principal + slashed penalties
    pub fn withdraw_sponsor_refund(e: Env, sponsor: Address, tokens_to_burn: i128) {
        sponsor.require_auth();
        assert!(tokens_to_burn > 0, "Tokens must be positive");

        let mut position: SponsorPosition = e
            .storage()
            .instance()
            .get(&DataKey::Sponsor(sponsor.clone()))
            .expect("No sponsor position");

        assert!(position.skill_tokens_held >= tokens_to_burn, "Insufficient skill tokens");

        let total_tokens: i128 = e.storage().instance().get(&DataKey::TotalSkillTokens).unwrap();
        let config: StreamConfig = e.storage().instance().get(&DataKey::StreamConfig).unwrap();

        // Remaining value per skill token = (Remaining Vault Balance + Slashed Penalty) / Total Skill Tokens
        let remaining_capital = (config.total_staked - config.total_claimed).max(0);
        let refund_amount = (remaining_capital * tokens_to_burn) / total_tokens;

        position.skill_tokens_held -= tokens_to_burn;
        position.staked_amount = position.staked_amount.saturating_sub(refund_amount);
        e.storage().instance().set(&DataKey::Sponsor(sponsor.clone()), &position);

        e.storage().instance().set(&DataKey::TotalSkillTokens, &(total_tokens - tokens_to_burn));

        if refund_amount > 0 {
            let asset_token: Address = e.storage().instance().get(&DataKey::AssetToken).unwrap();
            let client = token::Client::new(&e, &asset_token);
            client.transfer(&e.current_contract_address(), &sponsor, &refund_amount);
        }
    }

    /// View helper: Get current streaming status & vested balance
    pub fn get_stream_config(e: Env) -> StreamConfig {
        e.storage().instance().get(&DataKey::StreamConfig).unwrap()
    }

    /// View helper: Get vault state
    pub fn get_vault_status(e: Env) -> VaultStatus {
        e.storage().instance().get(&DataKey::VaultStatus).unwrap()
    }

    /// View helper: Get milestone detail
    pub fn get_milestone(e: Env, id: u32) -> Milestone {
        e.storage().instance().get(&DataKey::Milestone(id)).unwrap()
    }

    /// View helper: Get sponsor info
    pub fn get_sponsor(e: Env, sponsor: Address) -> SponsorPosition {
        e.storage().instance().get(&DataKey::Sponsor(sponsor)).unwrap()
    }
}
