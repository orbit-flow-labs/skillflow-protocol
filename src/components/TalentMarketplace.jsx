import React, { useState } from 'react';
import { UserCheck, PlusCircle, Award, Shield, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function TalentMarketplace({ 
  talentVaults, 
  onRegisterSkill, 
  onSponsorSelect, 
  userRole, 
  account, 
  isLoading 
}) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [learnerName, setLearnerName] = useState('');
  const [skillTrack, setSkillTrack] = useState('Soroban & Rust Smart Contracts');
  const [fundingTarget, setFundingTarget] = useState('1000');
  const [bio, setBio] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!learnerName || !fundingTarget) return;

    onRegisterSkill({
      id: talentVaults.length + 1,
      name: learnerName,
      track: skillTrack,
      learnerAddress: account || "GDSUFY...ACVC",
      stakedXLM: "0.00",
      targetXLM: `${parseFloat(fundingTarget).toFixed(2)}`,
      milestonesCount: 3,
      verifiedMilestones: 0,
      bio: bio || "Building next-generation Web3 protocols on Stellar Soroban."
    });

    setShowRegisterModal(false);
    setLearnerName('');
    setBio('');
  };

  return (
    <div className="glass-panel" style={{ margin: '20px', padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="#00f0ff" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Learner Talent Marketplace & Skill Trajectories
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Learners publish verifiable growth trajectories. Sponsors browse, choose talent, and stake capital directly onto Soroban vaults.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowRegisterModal(true)}
          disabled={userRole === 'SPONSOR'}
          title={userRole === 'SPONSOR' ? "Switch to Learner role to register skill trajectory" : ""}
        >
          <PlusCircle size={18} /> Register Skill Trajectory
        </button>
      </div>

      {/* Talent Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
        {talentVaults.map((vault) => {
          const progressPct = Math.min(100, (parseFloat(vault.stakedXLM) / (parseFloat(vault.targetXLM) || 1)) * 100).toFixed(1);

          return (
            <div key={vault.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                      {vault.track}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                      {vault.name}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Vault #{vault.id}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
                  {vault.bio}
                </p>

                {/* Milestone Progress */}
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>Staked Funding: <strong style={{ color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>{vault.stakedXLM} XLM</strong></span>
                    <span>Target: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{vault.targetXLM} XLM</strong></span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} color="var(--accent-violet)" /> {vault.verifiedMilestones}/{vault.milestonesCount} Milestones Verified
                </span>

                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                  onClick={() => onSponsorSelect(vault)}
                >
                  Sponsor Talent <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Skill Trajectory Modal */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="#00f0ff" /> Publish Skill Trajectory
              </h3>
              <button 
                onClick={() => setShowRegisterModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Learner Name / Handle
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Maya Lin (Rust & Soroban Developer)"
                  value={learnerName}
                  onChange={(e) => setLearnerName(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Skill Track Category
                </label>
                <select
                  value={skillTrack}
                  onChange={(e) => setSkillTrack(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#0a0d20', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                >
                  <option value="Soroban & Rust Smart Contracts">Soroban & Rust Smart Contracts</option>
                  <option value="Zero-Knowledge Proof Attestation">Zero-Knowledge Proof Attestation</option>
                  <option value="Web3 Security & Audit Engineering">Web3 Security & Audit Engineering</option>
                  <option value="DeFi Protocol Architecture">DeFi Protocol Architecture</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Target Capital Goal (XLM)
                </label>
                <input 
                  type="number"
                  placeholder="1000"
                  value={fundingTarget}
                  onChange={(e) => setFundingTarget(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                  Trajectory Bio & Key Goals
                </label>
                <textarea 
                  rows="3"
                  placeholder="Describe your learning trajectory and target milestones..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-sans)' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegisterModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
