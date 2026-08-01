import React, { useState, useEffect } from 'react';
import { Download, Clock, CheckCircle2, Activity, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LearnerClaim({ onClaim, account, userRole, isLoading, vaultState }) {
  const [claimableStroops, setClaimableStroops] = useState(12500000); // 1.25 XLM initial simulation

  // Tick claimable amount continuously based on vault state base rate
  useEffect(() => {
    const rate = ((vaultState?.baseRatePerSec || 1000) * ((vaultState?.multiplierBps || 10000) / 10000));
    const interval = setInterval(() => {
      setClaimableStroops(prev => prev + rate);
    }, 1000);
    return () => clearInterval(interval);
  }, [vaultState]);

  const isSponsorRole = userRole === 'SPONSOR';

  const handleClaimSubmit = async () => {
    if (!account || isSponsorRole) return;
    const amountToClaim = parseFloat((claimableStroops / 10000000).toFixed(6));
    try {
      await onClaim(amountToClaim);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      setClaimableStroops(0);
    } catch (err) {
      alert(`Claim Error: ${err.message}`);
    }
  };

  const claimableXLM = (claimableStroops / 10000000).toFixed(6);

  return (
    <div className="glass-panel" style={{ margin: '20px', padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={24} color="#00f0ff" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Learner Continuous Stream Claim
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Continuous per-second capital stream available for immediate withdrawal directly to your Stellar wallet.
          </p>
        </div>
        <span className="badge badge-active badge-pulse">Stream Active</span>
      </div>

      {isSponsorRole && (
        <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '20px', color: '#f59e0b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} />
          <span>Role Notice: You are connected as a <strong>Sponsor</strong>. Streaming withdrawals are restricted to registered <strong>Learners</strong>. Switch role to Learner in top bar to claim.</span>
        </div>
      )}

      <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Available Unallocated Capital Stream
          </span>
          <div style={{ fontSize: '3.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#00f0ff', margin: '6px 0', letterSpacing: '-0.03em' }}>
            {claimableXLM} <span style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '400' }}>XLM</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Vesting continuously from Soroban Contract <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CA2H...KZPS</code>
          </span>
        </div>

        <button 
          className="btn btn-success" 
          style={{ padding: '16px 36px', fontSize: '1.1rem', borderRadius: 'var(--radius-md)' }}
          onClick={handleClaimSubmit}
          disabled={isLoading || !account || isSponsorRole || parseFloat(claimableXLM) <= 0}
        >
          <Download size={22} /> {isLoading ? 'Claiming to Wallet...' : 'Claim Streamed Funds'}
        </button>
      </div>
    </div>
  );
}
