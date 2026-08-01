#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, Symbol};

#[test]
fn test_vault_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let learner = Address::generate(&env);
    let sponsor = Address::generate(&env);
    let pog_verifier = Address::generate(&env);

    // Register token contracts in test environment
    let asset_token_id = env.register_stellar_asset_contract_v2(admin.clone()).address();
    let skill_token_id = env.register_stellar_asset_contract_v2(admin.clone()).address();

    let vault_id = env.register_contract(None, SkillVaultContract);
    let client = SkillVaultContractClient::new(&env, &vault_id);

    // 1. Initialize vault
    client.initialize(
        &admin,
        &learner,
        &asset_token_id,
        &skill_token_id,
        &pog_verifier,
        &10i128, // 10 stroops base release per sec
        &86400u64,
    );

    assert_eq!(client.get_vault_status(), VaultStatus::Active);

    // 2. Add milestone
    let milestone_id = client.add_milestone(
        &Symbol::new(&env, "AI_LEVEL1"),
        &10000u64,
        &2500u32, // 25% instant unlock
        &5000u32, // +50% acceleration rate boost
        &pog_verifier,
    );

    assert_eq!(milestone_id, 1);
    let m = client.get_milestone(&1);
    assert_eq!(m.unlocked, false);

    // 3. Check initial stream config
    let config = client.get_stream_config();
    assert_eq!(config.current_multiplier_bps, 10000);
}
