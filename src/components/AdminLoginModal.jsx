import React, { useState } from 'react';
import { Lock, ShieldAlert, Key, CheckCircle2, X } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/contracts';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, account }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (passwordInput === STELLAR_CONFIG.adminPassword) {
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg('Invalid Admin Password. Access denied.');
    }
  };

  const handleWalletAdminVerify = () => {
    setErrorMsg('');
    if (account === STELLAR_CONFIG.permanentAdminAddress || account === STELLAR_CONFIG.deployerAddress) {
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg(`Connected address (${account.slice(0, 6)}...${account.slice(-6)}) is not authorized as Permanent Admin (${STELLAR_CONFIG.permanentAdminAddress.slice(0, 6)}...).`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="#f59e0b" /> Protocol Admin Portal Login
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          The Admin Console is restricted. Login using authorized Admin Credentials or connect with Permanent Admin address:
          <code style={{ display: 'block', marginTop: '6px', padding: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', color: '#00f0ff', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            {STELLAR_CONFIG.permanentAdminAddress}
          </code>
        </p>

        {errorMsg && (
          <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: '18px', color: '#f43f5e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Admin Security Password
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="password" 
              placeholder="Enter admin password (e.g. admin123)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem'
              }}
            />
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or verify via connected wallet:</span>
          <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={handleWalletAdminVerify}>
            <Key size={14} color="#f59e0b" /> Verify Admin Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
