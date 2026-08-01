import React, { useState } from 'react';
import { Award, CheckCircle2, Clock, Upload, Lock, ShieldAlert, Layers, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MilestoneBoard({ milestones, onSubmitProof, isLoading, account, totalStaked = "5000.00" }) {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [proofInput, setProofInput] = useState('');

  const numericStaked = parseFloat(totalStaked) || 5000;

  const handleOpenModal = (m) => {
    setSelectedMilestone(m);
    setProofInput(`0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.padEnd(66, '0'));
  };

  const handleConfirmSubmit = async () => {
    if (!selectedMilestone || !account) return;
    try {
      await onSubmitProof(selectedMilestone.id, proofInput);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setSelectedMilestone(null);
    } catch (err) {
      alert(`Proof Submission Error: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel" style={{ margin: '20px', padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} color="#00f0ff" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Proof-of-Growth (PoG) Trajectory & Milestone Payouts
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Investor staked capital directly scales milestone payouts on Soroban. Unlocking a milestone releases instant capital and accelerates streaming.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Active Staked Pool</span>
          <strong style={{ fontSize: '1.2rem', color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>{totalStaked} XLM</strong>
        </div>
      </div>

      {/* Milestone Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
        {milestones.map((m) => {
          const isUnlocked = m.unlocked;
          const isOverdue = !isUnlocked && Date.now() > m.deadline * 1000;
          
          // Calculate exact XLM capital unlocked based on current investor staked pool
          const unlockedXLM = ((numericStaked * m.unlockPct) / 100).toFixed(2);

          return (
            <div 
              key={m.id} 
              className="glass-card" 
              style={{
                borderLeft: isUnlocked 
                  ? '4px solid var(--accent-emerald)' 
                  : isOverdue 
                    ? '4px solid var(--accent-rose)' 
                    : '4px solid var(--accent-cyan)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Milestone #{m.id}
                </span>
                {isUnlocked ? (
                  <span className="badge badge-active">
                    <CheckCircle2 size={12} /> UNLOCKED ON-CHAIN
                  </span>
                ) : isOverdue ? (
                  <span className="badge badge-warning" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                    <ShieldAlert size={12} /> OVERDUE
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    <Clock size={12} /> PENDING
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                {m.description.replace(/_/g, ' ')}
              </h3>

              {/* Dynamic Capital Release Calculated directly from Investor Staked Pool */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', margin: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Investor Payout ({m.unlockPct}% Pool)</span>
                  <Coins size={14} color="#00f0ff" />
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
                  {unlockedXLM} <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '400' }}>XLM</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                  Calculated from live {totalStaked} XLM investor pool
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Instant Release</span>
                  <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{m.unlockPct}% Capital</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Rate Acceleration</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--accent-violet)' }}>+{m.acceleratorPct}% Boost</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} /> Verifier: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{m.verifier.slice(0, 8)}...</code>
              </div>

              {!isUnlocked && (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleOpenModal(m)}
                  disabled={isLoading || !account}
                >
                  <Upload size={16} /> Submit Growth Attestation
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Proof Submission Modal */}
      {selectedMilestone && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={20} color="#00f0ff" /> Submit Growth Attestation
              </h3>
              <button 
                onClick={() => setSelectedMilestone(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Submitting proof hash for <strong>Milestone #{selectedMilestone.id}: {selectedMilestone.description.replace(/_/g, ' ')}</strong>. Unlocks <strong>{((numericStaked * selectedMilestone.unlockPct) / 100).toFixed(2)} XLM</strong> directly to the learner wallet!
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Proof Attestation Hash (SHA-256)
              </label>
              <input 
                type="text" 
                value={proofInput} 
                onChange={(e) => setProofInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#00f0ff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedMilestone(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmSubmit} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Execute Soroban Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
