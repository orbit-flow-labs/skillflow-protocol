import React, { useState } from 'react';
import { PlusCircle, ShieldAlert, CheckSquare, Zap, Cpu } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/contracts';

export default function AdminConsole({ onAddMilestone, account, isLoading }) {
  const [description, setDescription] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('30');
  const [unlockPct, setUnlockPct] = useState('25');
  const [acceleratorPct, setAcceleratorPct] = useState('50');

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!description || !account) return;
    const deadlineUnix = Math.floor(Date.now() / 1000) + (parseInt(deadlineDays) * 86400);
    try {
      await onAddMilestone(description, deadlineUnix, unlockPct, acceleratorPct);
      setDescription('');
    } catch (err) {
      alert(`Add Milestone Error: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', margin: '20px' }}>
      {/* Add Milestone Form (Spans 7 cols) */}
      <div className="glass-panel" style={{ gridColumn: 'span 7', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <PlusCircle size={22} color="#00f0ff" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
            Vault Milestone Creator
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Add a new verifiable growth milestone to the Skill Vault contract on Stellar Testnet.
        </p>

        <form onSubmit={handleAddSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
              Milestone Symbol / Title
            </label>
            <input 
              type="text"
              placeholder="e.g. Advanced_Soroban_ZK_Proof"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Deadline (Days)
              </label>
              <input 
                type="number"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Unlock Instant %
              </label>
              <input 
                type="number"
                value={unlockPct}
                onChange={(e) => setUnlockPct(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Accelerator Boost %
              </label>
              <input 
                type="number"
                value={acceleratorPct}
                onChange={(e) => setAcceleratorPct(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading || !account}>
            Register Milestone on Testnet
          </button>
        </form>
      </div>

      {/* Slashing & Oracle Management (Spans 5 cols) */}
      <div className="glass-panel" style={{ gridColumn: 'span 5', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ShieldAlert size={22} color="#ef4444" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
              Delinquency & Slash Engine
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Public trigger function: evaluates missed deadlines beyond grace periods and executes on-chain penalty slashing.
          </p>

          <div className="glass-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block' }}>Grace Period</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>86,400 seconds (24 Hours)</span>
              </div>
              <span className="badge badge-active">Enforced</span>
            </div>
          </div>
        </div>

        <button 
          className="btn btn-warning" 
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => alert("Slash Evaluation: Evaluates milestone deadlines against Soroban ledger timestamp.")}
        >
          <Zap size={16} /> Run On-Chain Slash Check
        </button>
      </div>
    </div>
  );
}
