#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
pub enum DataKey {
    Admin,
    Vault,
    Name,
    Symbol,
    Decimals,
    Balance(Address),
    TotalSupply,
}

#[contract]
pub struct SkillTokenContract;

#[contractimpl]
impl SkillTokenContract {
    pub fn initialize(e: Env, admin: Address, vault: Address, name: String, symbol: String) {
        if e.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }

        admin.require_auth();

        e.storage().instance().set(&DataKey::Admin, &admin);
        e.storage().instance().set(&DataKey::Vault, &vault);
        e.storage().instance().set(&DataKey::Name, &name);
        e.storage().instance().set(&DataKey::Symbol, &symbol);
        e.storage().instance().set(&DataKey::Decimals, &7u32);
        e.storage().instance().set(&DataKey::TotalSupply, &0i128);
    }

    pub fn mint(e: Env, to: Address, amount: i128) {
        let vault: Address = e.storage().instance().get(&DataKey::Vault).unwrap();
        vault.require_auth();

        assert!(amount > 0, "Amount must be positive");

        let current_balance: i128 = e.storage().instance().get(&DataKey::Balance(to.clone())).unwrap_or(0);
        let current_supply: i128 = e.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);

        e.storage().instance().set(&DataKey::Balance(to.clone()), &(current_balance + amount));
        e.storage().instance().set(&DataKey::TotalSupply, &(current_supply + amount));
    }

    pub fn burn(e: Env, from: Address, amount: i128) {
        let vault: Address = e.storage().instance().get(&DataKey::Vault).unwrap();
        vault.require_auth();

        let current_balance: i128 = e.storage().instance().get(&DataKey::Balance(from.clone())).unwrap_or(0);
        assert!(current_balance >= amount, "Insufficient balance to burn");

        let current_supply: i128 = e.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);

        e.storage().instance().set(&DataKey::Balance(from.clone()), &(current_balance - amount));
        e.storage().instance().set(&DataKey::TotalSupply, &(current_supply - amount));
    }

    pub fn balance(e: Env, id: Address) -> i128 {
        e.storage().instance().get(&DataKey::Balance(id)).unwrap_or(0)
    }

    pub fn total_supply(e: Env) -> i128 {
        e.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
    }

    pub fn name(e: Env) -> String {
        e.storage().instance().get(&DataKey::Name).unwrap()
    }

    pub fn symbol(e: Env) -> String {
        e.storage().instance().get(&DataKey::Symbol).unwrap()
    }

    pub fn decimals(e: Env) -> u32 {
        e.storage().instance().get(&DataKey::Decimals).unwrap()
    }
}
