import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, Zap, Lock, DollarSign, Activity, AlertTriangle, Layers, ArrowUpRight } from 'lucide-react';

export default function VaultOverview({ vaultState, onRefresh }) {
  const [liveStreamedStroops, setLiveStreamedStroops] = useState(0);

  // Per-second continuous streaming ticker simulation matching Soroban contract math
  useEffect(() => {
    if (!vaultState) return;

    const baseRate = vaultState.baseRatePerSec || 1000;
    const mult = (vaultState.multiplierBps || 10000) / 10000;
    const ratePerSec = baseRate * mult;

    const interval = setInterval(() => {
      setLiveStreamedStroops(prev => prev + ratePerSec);
    }, 1000);

    return () => clearInterval(interval);
  }, [vaultState]);

  const multiplierDisplay = ((vaultState?.multiplierBps || 10000) / 10000).toFixed(2);
  const totalStaked = vaultState?.totalStaked || "5000.00";
  const totalClaimed = vaultState?.totalClaimed || "1250.00";
  const totalSlashed = vaultState?.totalSlashed || "0.00";
  const remainingCapital = (parseFloat(totalStaked) - parseFloat(totalClaimed) - parseFloat(totalSlashed)).toFixed(2);
  const claimPct = Math.min(100, (parseFloat(totalClaimed) / (parseFloat(totalStaked) || 1)) * 100).toFixed(1);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', margin: '20px' }}>
      {/* Live Telemetry Panel (Spans 8 cols) */}
      <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-active badge-pulse">LIVE SOROBAN VAULT</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skill Vault #1 • AI & Smart Contracts</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Talent Capital Telemetry & Streaming
            </h2>
          </div>
          <button className="btn btn-secondary" onClick={onRefresh} style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            <Activity size={14} color="#00f0ff" /> Sync Soroban Ledger
          </button>
        </div>

        {/* Live Streaming Counter Card */}
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-lg)', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', boxShadow: 'inset 0 0 30px rgba(0,240,255,0.05)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
              Live Micro-Vesting Rate
            </span>
            <div className="stream-live-ticker" style={{ marginTop: '4px' }}>
              +{(liveStreamedStroops / 10000000).toFixed(7)} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '400' }}>XLM / sec</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid var(--border-violet)', padding: '10px 20px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-violet)', fontWeight: '800', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACCELERATION MULTIPLIER</span>
              <strong style={{ fontSize: '1.6rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>{multiplierDisplay}x</strong>
            </div>
          </div>
        </div>

        {/* Streaming Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <span>Claimed Capital: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{totalClaimed} XLM ({claimPct}%)</strong></span>
            <span>Total Vault Pool: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{totalStaked} XLM</strong></span>
          </div>
          <div className="progress-container">
            <div className="progress-bar-fill" style={{ width: `${claimPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Capital Summary Cards (Spans 4 cols) */}
      <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-cyan-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={26} color="#00f0ff" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Staked Capital</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>{totalStaked} XLM</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={26} color="#10b981" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Remaining Reserve</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>{remainingCapital} XLM</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={26} color="#f43f5e" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Slashed Penalties</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>{totalSlashed} XLM</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
