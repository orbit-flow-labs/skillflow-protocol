import React from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { STELLAR_CONFIG } from '../config/contracts';

export default function ExplorerFeed({ txHistory }) {
  return (
    <div className="glass-panel" style={{ margin: '20px', padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={22} color="#00f0ff" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
            Stellar Expert Testnet Explorer Audit Log
          </h2>
        </div>
        <span className="badge badge-active">Real-Time Ledger Submissions</span>
      </div>

      {txHistory.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
          No transactions submitted yet in this session. Perform any action above to execute Soroban contracts on Stellar Testnet!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {txHistory.map((tx, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block' }}>{tx.action}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Timestamp: {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <a 
                href={`${STELLAR_CONFIG.explorerUrl}${tx.hash}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 14px', fontFamily: 'var(--font-mono)' }}
              >
                Tx {tx.hash.slice(0, 8)}... <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
