import React, { useState, useEffect } from 'react';
import { PiggyBank, Coins, ShieldCheck, ArrowRight, CornerUpLeft, AlertTriangle, UserCheck } from 'lucide-react';

export default function SponsorPortal({ 
  onDeposit, 
  account, 
  userRole, 
  sponsorStaked = 500, 
  skillTokensHeld = 500, 
  isLoading,
  talentVaults = [],
  selectedVault = null
}) {
  const [depositAmount, setDepositAmount] = useState('100');
  const [targetVaultId, setTargetVaultId] = useState(selectedVault?.id || talentVaults[0]?.id || 1);

  useEffect(() => {
    if (selectedVault) {
      setTargetVaultId(selectedVault.id);
    } else if (talentVaults.length > 0 && !targetVaultId) {
      setTargetVaultId(talentVaults[0].id);
    }
  }, [selectedVault, talentVaults]);

  const currentTalent = talentVaults.find(v => v.id === parseInt(targetVaultId)) || talentVaults[0] || { name: 'Alex Vance', track: 'Soroban' };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    try {
      await onDeposit(depositAmount, targetVaultId);
    } catch (err) {
      alert(`Deposit Error: ${err.message}`);
    }
  };

  const isLearnerRole = userRole === 'LEARNER';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', margin: '20px' }}>
      {/* Sponsor Staking Deposit Form (Spans 6 cols) */}
      <div className="glass-panel" style={{ gridColumn: 'span 6', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <PiggyBank size={24} color="#00f0ff" />
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
            Sponsor Capital Deposit
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Stake XLM capital into the Soroban Skill Vault to back high-growth talent. Staking transfers XLM directly from your wallet into the Soroban smart contract on Stellar Testnet, instantly minting <strong>Skill Tokens (SKILL)</strong>.
        </p>

        {isLearnerRole && (
          <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '20px', color: '#f59e0b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} />
            <span>Role Notice: You are connected as a <strong>Learner</strong>. A learner cannot act as a sponsor for their own vault. Switch role to <strong>Sponsor</strong> in top bar.</span>
          </div>
        )}

        <form onSubmit={handleDepositSubmit}>
          {/* Target Talent Trajectory Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Select Talent Trajectory to Sponsor
            </label>
            <select
              value={targetVaultId}
              onChange={(e) => setTargetVaultId(parseInt(e.target.value))}
              disabled={isLearnerRole}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#0a0d20',
                border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: '600',
                outline: 'none'
              }}
            >
              {talentVaults.map(v => (
                <option key={v.id} value={v.id}>
                  Vault #{v.id}: {v.name} ({v.track}) — Staked: {v.stakedXLM} / {v.targetXLM} XLM
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Capital Deposit Amount (XLM)
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number"
                min="1"
                step="10"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isLearnerRole}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#00f0ff' }}>
                XLM
              </span>
            </div>
          </div>

          {/* Minting Ratio Card */}
          <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid var(--border-violet)', borderRadius: 'var(--radius-md)', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Recipient Talent</span>
                <strong style={{ fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} color="#00f0ff" /> {currentTalent?.name}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-violet)', display: 'block', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  +{depositAmount || 0} SKILL Minted
                </span>
              </div>
              <Coins size={28} color="var(--accent-violet)" />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            disabled={isLoading || !account || isLearnerRole}
          >
            {isLoading ? 'Executing Smart Contract Stake...' : `Deposit ${depositAmount || 0} XLM to Soroban Contract`} <ArrowRight size={18} />
          </button>
        </form>
      </div>

      {/* Sponsor Position & Protection Info (Spans 6 cols) */}
      <div className="glass-panel" style={{ gridColumn: 'span 6', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <ShieldCheck size={24} color="#10b981" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Sponsor Position & Guarantee
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Your capital is protected by Soroban smart contract slashing rules. If milestones are missed beyond grace periods, unvested principal and slashed penalties are redeemable.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staked Principal</span>
              <h4 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {account && !isLearnerRole ? `${parseFloat(sponsorStaked).toFixed(2)} XLM` : '0.00 XLM'}
              </h4>
            </div>

            <div className="glass-card">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKILL Tokens Held</span>
              <h4 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#00f0ff', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {account && !isLearnerRole ? `${parseFloat(skillTokensHeld).toFixed(2)} SKILL` : '0.00 SKILL'}
              </h4>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block' }}>Emergency Refund Vault Protection</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Burn SKILL tokens to reclaim unvested vault reserves</span>
          </div>
          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={() => alert("Sponsor Refund: Contract allows burning SKILL tokens to claim remaining vault reserves.")} disabled={isLearnerRole}>
            <CornerUpLeft size={14} /> Refund
          </button>
        </div>
      </div>
    </div>
  );
}

