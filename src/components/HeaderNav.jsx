import React, { useState } from 'react';
import { Wallet, ShieldCheck, Cpu, Key, LogOut, Copy, Check, Shield } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/contracts';

export default function HeaderNav({ 
  account, 
  balance, 
  userRole,
  onToggleRole,
  isFreighter, 
  isAdminAuthenticated,
  onConnectFreighter, 
  onGenerateKeypair, 
  onDisconnect, 
  isLoading 
}) {
  const [copied, setCopied] = useState(false);

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="glass-panel" style={{ margin: '20px 20px 0 20px', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Brand & Network Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #00f0ff, #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)'
        }}>
          <Cpu size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
              SkillFlow <span style={{ color: '#00f0ff', fontSize: '0.75rem', verticalAlign: 'super', background: 'rgba(0,240,255,0.1)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.3)', fontWeight: '700' }}>SOROBAN TESTNET</span>
            </h1>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Programmable Skill Vaults & Talent Streaming Protocol</p>
        </div>
      </div>

      {/* Role Switcher & Wallet Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* User Role Selector */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px', display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => onToggleRole('SPONSOR')}
            className={`btn ${userRole === 'SPONSOR' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            Sponsor Mode
          </button>
          <button 
            onClick={() => onToggleRole('LEARNER')}
            className={`btn ${userRole === 'LEARNER' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            Learner Mode
          </button>
        </div>

        {/* Admin Badge Only Shown If Authenticated via /admin Route */}
        {isAdminAuthenticated && (
          <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
            <Shield size={12} /> Admin Mode
          </span>
        )}

        {account ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* XLM Balance Badge */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff' }}></div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', lineHeight: '1' }}>Wallet Balance</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>{balance} XLM</strong>
              </div>
            </div>

            {/* Wallet Address Pill */}
            <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={18} color="#00f0ff" />
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', display: 'block', lineHeight: '1', fontWeight: '700' }}>
                  {isFreighter ? 'Freighter Wallet' : 'Testnet Keypair'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/account/${account}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ fontSize: '0.85rem', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
                  >
                    {truncateAddress(account)}
                  </a>
                  <button 
                    onClick={handleCopy} 
                    title="Copy Address"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Disconnect Button */}
            <button 
              className="btn btn-danger" 
              onClick={onDisconnect} 
              title="Disconnect Wallet"
              style={{ padding: '10px 16px' }}
            >
              <LogOut size={16} /> Disconnect
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn btn-primary" onClick={onConnectFreighter} disabled={isLoading}>
              <Wallet size={18} /> Connect Wallet
            </button>
            <button className="btn btn-secondary" onClick={onGenerateKeypair} disabled={isLoading}>
              <Key size={18} color="#00f0ff" /> Demo Keypair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
