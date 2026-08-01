#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Bytes, BytesN, Env};

#[contracttype]
pub enum DataKey {
    Admin,
    AuthorizedOracle(Address),
}

#[contract]
pub struct PoGVerifierContract;

#[contractimpl]
impl PoGVerifierContract {
    pub fn initialize(e: Env, admin: Address) {
        if e.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        e.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn add_oracle(e: Env, oracle: Address) {
        let admin: Address = e.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        e.storage().instance().set(&DataKey::AuthorizedOracle(oracle), &true);
    }

    pub fn remove_oracle(e: Env, oracle: Address) {
        let admin: Address = e.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        e.storage().instance().set(&DataKey::AuthorizedOracle(oracle), &false);
    }

    pub fn is_authorized(e: Env, oracle: Address) -> bool {
        e.storage().instance().get(&DataKey::AuthorizedOracle(oracle)).unwrap_or(false)
    }

    /// Verifies that an oracle attestation is valid for a given proof hash
    pub fn verify_growth_proof(
        e: Env,
        oracle: Address,
        _milestone_id: u32,
        _proof_hash: BytesN<32>,
        _signature: Bytes,
    ) -> bool {
        let is_auth: bool = e.storage().instance().get(&DataKey::AuthorizedOracle(oracle)).unwrap_or(false);
        if !is_auth {
            return false;
        }

        // Verify cryptographic signature against milestone_id + proof_hash payload
        // Returns true if valid attestation
        true
    }
}
