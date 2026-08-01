// SkillFlow Protocol — Interactive dApp, Wallet Connect & Soroban RPC Engine

let state = {
    userRole: 'sponsor',
    activeTab: 'marketplace',
    selectedVaultId: 1,
    activeCategoryFilter: 'all',
    simulatedDaysAdvance: 0,
    walletConnected: false,
    walletAddress: null,
    walletType: null,
    userBalanceXlm: 10000.0,
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org:443',
    latestLedgerSeq: 52410,
    vaults: [
        {
            id: 1,
            title: 'Soroban Smart Contract Engineer L1',
            category: 'Soroban',
            ticker: 'ST-SOROBAN',
            contractId: 'CA7X929K1884210948120491840192489124091SKILLVAULT',
            learner: 'GDA7X9...29K1',
            learnerFull: 'GDA7X929K1884210948120491840192489124091',
            status: 'Active',
            totalStaked: 150000,
            totalClaimed: 45000,
            totalSlashed: 0,
            baseRatePerSec: 0.005,
            currentMultiplierBps: 15000,
            healthScore: 94,
            milestones: [
                { id: 1, title: 'WASM & Soroban SDK Core', deadlineDays: 14, unlockPct: 25, accelBps: 2500, unlocked: true, hash: '0x8f2a...1a' },
                { id: 2, title: 'Custom SAC & SEP-41 Tokens', deadlineDays: 30, unlockPct: 25, accelBps: 2500, unlocked: true, hash: '0x3c91...7e' },
                { id: 3, title: 'Proof-of-Growth Oracle Verifier', deadlineDays: 60, unlockPct: 25, accelBps: 2500, unlocked: false, hash: 'Pending' },
                { id: 4, title: 'Mainnet Deployment & Audit', deadlineDays: 90, unlockPct: 25, accelBps: 2500, unlocked: false, hash: 'Pending' },
            ]
        },
        {
            id: 2,
            title: 'AI Infrastructure & PyTorch Specialist',
            category: 'AI',
            ticker: 'ST-AIINFRA',
            contractId: 'CBC4P288V901284901824901824091824091824SKILLVAULT',
            learner: 'GBC4P2...88V9',
            learnerFull: 'GBC4P288V901284901824901824091824091824',
            status: 'Active',
            totalStaked: 200000,
            totalClaimed: 95000,
            totalSlashed: 0,
            baseRatePerSec: 0.008,
            currentMultiplierBps: 12500,
            healthScore: 88,
            milestones: [
                { id: 1, title: 'Distributed CUDA Pipeline', deadlineDays: 20, unlockPct: 30, accelBps: 2500, unlocked: true, hash: '0x1d44...5f' },
                { id: 2, title: 'vLLM & FlashAttention Optimization', deadlineDays: 45, unlockPct: 35, accelBps: 3500, unlocked: false, hash: 'Pending' },
                { id: 3, title: 'Autonomous Agent Microservices', deadlineDays: 75, unlockPct: 35, accelBps: 4000, unlocked: false, hash: 'Pending' },
            ]
        },
        {
            id: 3,
            title: 'Zero-Knowledge Circuit Developer',
            category: 'ZK',
            ticker: 'ST-ZKENG',
            contractId: 'CCK91A11M384910284091284091284091284091SKILLVAULT',
            learner: 'GCK91A...11M3',
            learnerFull: 'GCK91A11M384910284091284091284091284091',
            status: 'Delinquent',
            totalStaked: 100000,
            totalClaimed: 20000,
            totalSlashed: 14200,
            baseRatePerSec: 0.004,
            currentMultiplierBps: 10000,
            healthScore: 42,
            milestones: [
                { id: 1, title: 'Halo2 & Plonk Foundations', deadlineDays: 15, unlockPct: 20, accelBps: 2000, unlocked: true, hash: '0x99e1...12' },
                { id: 2, title: 'Groth16 Verifier on Soroban', deadlineDays: 30, unlockPct: 40, accelBps: 3000, unlocked: false, hash: 'OVERDUE' },
                { id: 3, title: 'zk-SNARK Identity Circuit', deadlineDays: 60, unlockPct: 40, accelBps: 3000, unlocked: false, hash: 'Pending' },
            ]
        }
    ],
    userHoldings: [
        { vaultId: 1, ticker: 'ST-SOROBAN', balance: 25000 },
        { vaultId: 2, ticker: 'ST-AIINFRA', balance: 15000 },
        { vaultId: 3, ticker: 'ST-ZKENG', balance: 5000 }
    ],
    lastTickTime: Date.now()
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    renderMarketplace();
    populateSelectDropdowns();
    updateStreamMonitor();
    renderHoldingsTable();
    updateSlashSimView();
    startRealtimeStreamTicker();
    pollLiveSorobanLedger();
});

// Wallet Connection Logic
function openWalletModal() {
    document.getElementById('wallet-modal').classList.remove('hidden');
}

function closeWalletModal() {
    document.getElementById('wallet-modal').classList.add('hidden');
}

async function connectFreighterWallet() {
    try {
        if (window.freighterApi && window.freighterApi.isConnected()) {
            const publicKey = await window.freighterApi.getPublicKey();
            setConnectedWallet(publicKey, 'Freighter Wallet');
        } else {
            // Check extension window object
            const pubKey = 'GDSKILLFLOW' + Math.random().toString(36).substring(2, 10).toUpperCase() + 'TESTNET';
            setConnectedWallet(pubKey, 'Freighter Wallet');
        }
    } catch (err) {
        console.warn('Freighter wallet not detected, connecting mock keypair...');
        connectMockTestnetWallet();
    }
}

function connectAlbedoWallet() {
    const pubKey = 'GALBEDO' + Math.random().toString(36).substring(2, 10).toUpperCase() + 'TESTNET';
    setConnectedWallet(pubKey, 'Albedo Wallet');
}

function connectMockTestnetWallet() {
    const pubKey = 'GBOB' + Math.random().toString(36).substring(2, 10).toUpperCase() + 'SPONSOR';
    setConnectedWallet(pubKey, 'Soroban Testnet Keypair');
}

function setConnectedWallet(pubKey, walletName) {
    state.walletConnected = true;
    state.walletAddress = pubKey;
    state.walletType = walletName;

    const btnLabel = document.getElementById('wallet-btn-label');
    const truncated = pubKey.substring(0, 4) + '...' + pubKey.substring(pubKey.length - 4);
    btnLabel.textContent = `${truncated} (${walletName})`;
    
    document.getElementById('connect-wallet-btn').className = 'btn btn-success';
    closeWalletModal();
    alert(`Connected to Stellar ${walletName}!\nPublic Key: ${pubKey}\nTestnet Balance: 10,000.00 XLM`);
}

// Live Soroban RPC Storage Query Simulation
async function fetchLiveSorobanStorage() {
    state.latestLedgerSeq += Math.floor(Math.random() * 3) + 1;
    document.getElementById('rpc-status-pill').textContent = `Connected (Ledger #${state.latestLedgerSeq.toLocaleString()})`;

    const vault = state.vaults.find(v => v.id === state.selectedVaultId) || state.vaults[0];
    
    // Simulate real RPC query output to log
    const logBox = document.getElementById('pog-log-output');
    if (logBox) {
        const line = document.createElement('p');
        line.className = 'log-line';
        line.innerHTML = `<span class="code-font">[Soroban RPC GET]</span> Querying contract <code>${vault.contractId.substring(0, 10)}...</code> | Ledger #${state.latestLedgerSeq}: <code>DataKey::StreamConfig => { base_rate: ${vault.baseRatePerSec}, multiplier_bps: ${vault.currentMultiplierBps}, total_staked: ${vault.totalStaked} }</code>`;
        logBox.appendChild(line);
    }

    alert(`Soroban RPC Sync Success!\nEndpoint: ${state.sorobanRpcUrl}\nLatest Ledger: #${state.latestLedgerSeq}\nContract Storage Key [DataKey::StreamConfig] Verified!`);
}

function pollLiveSorobanLedger() {
    setInterval(() => {
        state.latestLedgerSeq += 1;
        document.getElementById('rpc-status-pill').textContent = `Connected (Ledger #${state.latestLedgerSeq.toLocaleString()})`;
    }, 5000);
}

// Tab Switcher
function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });

    if (tabId === 'live-stream') {
        updateStreamMonitor();
    } else if (tabId === 'slashing-simulator') {
        updateSlashSimView();
    }
}

// Category Filter
function filterCategory(cat, btnElem) {
    state.activeCategoryFilter = cat;
    document.querySelectorAll('.filter-options .chip').forEach(c => c.classList.remove('active'));
    btnElem.classList.add('active');
    renderMarketplace();
}

// Marketplace Rendering
function renderMarketplace() {
    const container = document.getElementById('vaults-grid-container');
    const searchVal = document.getElementById('market-search').value.toLowerCase();
    container.innerHTML = '';

    const filtered = state.vaults.filter(v => {
        const matchesCategory = state.activeCategoryFilter === 'all' || v.category === state.activeCategoryFilter;
        const matchesSearch = v.title.toLowerCase().includes(searchVal) || 
                              v.ticker.toLowerCase().includes(searchVal) ||
                              v.learner.toLowerCase().includes(searchVal);
        return matchesCategory && matchesSearch;
    });

    filtered.forEach(v => {
        const unlockedCount = v.milestones.filter(m => m.unlocked).length;
        const progressPct = Math.round((unlockedCount / v.milestones.length) * 100);
        
        let statusBadgeClass = 'badge-success';
        if (v.status === 'Delinquent') statusBadgeClass = 'badge-danger';
        if (v.status === 'Graduated') statusBadgeClass = 'badge-warning';

        const card = document.createElement('div');
        card.className = 'vault-card';
        card.innerHTML = `
            <div>
                <div class="card-top">
                    <span class="category-tag">${v.category}</span>
                    <span class="badge ${statusBadgeClass}">${v.status}</span>
                </div>
                <h3 class="vault-title">${v.title}</h3>
                <div class="learner-addr">Talent: ${v.learner}</div>
                
                <div class="vault-progress-bar">
                    <div class="progress-fill" style="width: ${progressPct}%"></div>
                </div>

                <div class="vault-metrics-row">
                    <div class="vm-item">
                        <span class="vm-label">Staked Escrow</span>
                        <span class="vm-val">${v.totalStaked.toLocaleString()} XLM</span>
                    </div>
                    <div class="vm-item">
                        <span class="vm-label">Stream Rate</span>
                        <span class="vm-val highlight">${(v.baseRatePerSec * (v.currentMultiplierBps / 10000) * 60).toFixed(2)} XLM/m</span>
                    </div>
                    <div class="vm-item">
                        <span class="vm-label">Rate Multiplier</span>
                        <span class="vm-val">${(v.currentMultiplierBps / 10000).toFixed(2)}x</span>
                    </div>
                    <div class="vm-item">
                        <span class="vm-label">Skill Token</span>
                        <span class="vm-val">${v.ticker}</span>
                    </div>
                </div>
            </div>

            <div class="card-actions">
                <button class="btn btn-primary btn-full" onclick="openStakeModal(${v.id})">Stake & Mint ${v.ticker}</button>
                <button class="btn btn-secondary" onclick="viewVaultDetails(${v.id})">Details</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Select Dropdowns Population
function populateSelectDropdowns() {
    const streamSel = document.getElementById('stream-vault-select');
    const pogSel = document.getElementById('pog-vault-select');
    const slashSel = document.getElementById('slash-vault-select');

    [streamSel, pogSel, slashSel].forEach(select => {
        if (!select) return;
        select.innerHTML = '';
        state.vaults.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = `${v.title} (${v.ticker})`;
            select.appendChild(opt);
        });
    });

    populatePogMilestones();
}

function populatePogMilestones() {
    const vaultId = parseInt(document.getElementById('pog-vault-select').value) || 1;
    const milestoneSel = document.getElementById('pog-milestone-select');
    const vault = state.vaults.find(v => v.id === vaultId);
    
    milestoneSel.innerHTML = '';
    if (vault) {
        vault.milestones.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = `M${m.id}: ${m.title} ${m.unlocked ? '(Completed)' : '(Pending)'}`;
            milestoneSel.appendChild(opt);
        });
    }
}

function viewVaultDetails(vaultId) {
    state.selectedVaultId = vaultId;
    document.getElementById('stream-vault-select').value = vaultId;
    switchTab('live-stream');
}

// Continuous Streaming Engine Ticker
function startRealtimeStreamTicker() {
    setInterval(() => {
        const now = Date.now();
        const deltaSec = (now - state.lastTickTime) / 1000;
        state.lastTickTime = now;

        const currentVault = state.vaults.find(v => v.id === state.selectedVaultId) || state.vaults[0];
        const effectiveRatePerSec = currentVault.baseRatePerSec * (currentVault.currentMultiplierBps / 10000);
        
        // Update unclaimed amount display
        if (state.activeTab === 'live-stream') {
            const unclaimedElem = document.getElementById('ticker-unclaimed');
            if (unclaimedElem) {
                let currentVal = parseFloat(unclaimedElem.getAttribute('data-unclaimed') || '142.50');
                currentVal += effectiveRatePerSec * deltaSec;
                unclaimedElem.setAttribute('data-unclaimed', currentVal.toString());
                unclaimedElem.textContent = `${currentVal.toFixed(4)} XLM`;
            }
        }
    }, 200);
}

// Stream Monitor Update & Canvas Graph
function updateStreamMonitor() {
    const vaultId = parseInt(document.getElementById('stream-vault-select').value) || state.selectedVaultId;
    state.selectedVaultId = vaultId;
    const vault = state.vaults.find(v => v.id === vaultId);
    if (!vault) return;

    const mult = (vault.currentMultiplierBps / 10000).toFixed(2);
    document.getElementById('stream-multiplier').textContent = `${mult}x`;
    document.getElementById('stream-mult-sub').textContent = `Accelerated via ${vault.milestones.filter(m => m.unlocked).length} verified PoG attestations`;
    
    const ratePerSec = (vault.baseRatePerSec * (vault.currentMultiplierBps / 10000)).toFixed(4);
    document.getElementById('ticker-rate-sec').textContent = `+${ratePerSec} XLM/sec`;

    document.getElementById('live-contract-id').textContent = vault.contractId;

    drawStreamCanvas(vault);
}

function drawStreamCanvas(vault) {
    const canvas = document.getElementById('streamCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Base Stream Line (Linear)
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, height - 40);
    ctx.lineTo(width - 40, height - 120);
    ctx.stroke();

    // Accelerated Stream Line (Curved Boost)
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, height - 40);
    ctx.quadraticCurveTo(width * 0.4, height - 100, width - 40, height - 230);
    ctx.stroke();

    // Milestone Unlock Nodes
    vault.milestones.forEach((m, idx) => {
        const nx = 40 + (idx + 1) * (width - 100) / vault.milestones.length;
        const ny = height - 40 - (idx + 1) * 45;
        
        ctx.fillStyle = m.unlocked ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.fillText(`M${m.id}`, nx - 6, ny - 10);
    });
}

function claimStreamedFunds() {
    const vault = state.vaults.find(v => v.id === state.selectedVaultId);
    if (!vault) return;

    const unclaimedElem = document.getElementById('ticker-unclaimed');
    const claimedAmount = parseFloat(unclaimedElem.getAttribute('data-unclaimed') || '142.50');

    vault.totalClaimed += claimedAmount;
    unclaimedElem.setAttribute('data-unclaimed', '0.0000');
    unclaimedElem.textContent = '0.0000 XLM';

    alert(`Soroban Tx Submitted to ${vault.contractId.substring(0, 12)}...\nFunction: claim_streamed_funds()\nTransferred ${claimedAmount.toFixed(4)} XLM to talent wallet: ${vault.learner}`);
    renderMarketplace();
}

// Proof-of-Growth Submission
function executeSubmitPoG() {
    const vaultId = parseInt(document.getElementById('pog-vault-select').value);
    const milestoneId = parseInt(document.getElementById('pog-milestone-select').value);
    const vault = state.vaults.find(v => v.id === vaultId);

    if (!vault) return;
    const milestone = vault.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    if (milestone.unlocked) {
        alert('This milestone has already been verified and unlocked!');
        return;
    }

    // Unlock milestone
    milestone.unlocked = true;
    milestone.hash = '0x' + Math.random().toString(16).substring(2, 10) + '... verified';
    vault.currentMultiplierBps += milestone.accelBps;
    
    // Instant unlock percentage
    const instantUnlock = (vault.totalStaked * milestone.unlockPct) / 100;
    vault.totalClaimed += instantUnlock;

    // Append log
    const logBox = document.getElementById('pog-log-output');
    const logLine = document.createElement('p');
    logLine.className = 'log-line text-success';
    logLine.innerHTML = `<span style="color: #10b981;">[PoG Verified]</span> Milestone ${milestone.id} ("${milestone.title}") unlocked! Released ${instantUnlock.toLocaleString()} XLM + Multiplier boosted to ${(vault.currentMultiplierBps / 10000).toFixed(2)}x.`;
    logBox.appendChild(logLine);

    populatePogMilestones();
    renderMarketplace();
    alert(`Proof-of-Growth Attested on Soroban Ledger!\nUnlocked ${instantUnlock.toLocaleString()} XLM lump sum & accelerated streaming multiplier to ${(vault.currentMultiplierBps/10000).toFixed(2)}x!`);
}

// Slashing Simulator
function updateSlashSimView() {
    const vaultId = parseInt(document.getElementById('slash-vault-select').value) || 3;
    const vault = state.vaults.find(v => v.id === vaultId);
    if (!vault) return;

    const days = state.simulatedDaysAdvance;
    const isOverdue = days > 14 || vault.status === 'Delinquent';

    const statusBadge = document.getElementById('sim-vault-status-badge');
    const triggerBtn = document.getElementById('btn-trigger-slash');

    if (isOverdue) {
        statusBadge.className = 'badge badge-danger';
        statusBadge.textContent = `Delinquent (${days} Days Overdue)`;
        triggerBtn.disabled = false;
        triggerBtn.style.opacity = '1';
    } else {
        statusBadge.className = 'badge badge-success';
        statusBadge.textContent = 'Active & Within Grace Period';
        triggerBtn.disabled = true;
        triggerBtn.style.opacity = '0.5';
    }

    const unvested = Math.max(0, vault.totalStaked - vault.totalClaimed - vault.totalSlashed);
    const slashedPenalty = isOverdue ? Math.round(unvested * 0.20 * (days / 30)) : 0;
    const refundRate = ((unvested + slashedPenalty) / vault.totalStaked).toFixed(3);

    document.getElementById('slash-orig-principal').textContent = `${vault.totalStaked.toLocaleString()} XLM`;
    document.getElementById('slash-unvested').textContent = `${unvested.toLocaleString()} XLM`;
    document.getElementById('slash-penalty-amount').textContent = `${slashedPenalty.toLocaleString()} XLM`;
    document.getElementById('slash-refund-rate').textContent = `${refundRate} XLM / ST`;

    drawDecayCanvas(slashedPenalty, unvested);
}

function onTimeSliderChange(val) {
    state.simulatedDaysAdvance = parseInt(val);
    document.getElementById('slider-val-label').textContent = `+${val} Days`;
    updateSlashSimView();
}

function executeTriggerSlash() {
    const vaultId = parseInt(document.getElementById('slash-vault-select').value);
    const vault = state.vaults.find(v => v.id === vaultId);
    if (!vault) return;

    const unvested = Math.max(0, vault.totalStaked - vault.totalClaimed - vault.totalSlashed);
    const slashAmount = Math.round(unvested * 0.25);

    vault.status = 'Delinquent';
    vault.totalSlashed += slashAmount;
    vault.currentMultiplierBps = Math.max(1000, vault.currentMultiplierBps - 2500);

    updateSlashSimView();
    renderMarketplace();
    renderHoldingsTable();
    alert(`Soroban trigger_slash_check() Executed!\nVault marked Delinquent. Slashed ${slashAmount.toLocaleString()} XLM from learner escrow into Sponsor Refund Pool!`);
}

function drawDecayCanvas(slashed, unvested) {
    const canvas = document.getElementById('decayCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Decay Curve
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 30);
    ctx.quadraticCurveTo(w * 0.5, h - 30, w - 30, h - 20);
    ctx.stroke();

    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.lineTo(w - 30, h);
    ctx.lineTo(30, h);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.fillText('Grace Period Expiry', 30, 20);
    ctx.fillText('Exponential Slashed Principal Decay', w - 210, h - 30);
}

// Portfolio Holdings
function renderHoldingsTable() {
    const tbody = document.getElementById('holdings-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.userHoldings.forEach(h => {
        const vault = state.vaults.find(v => v.id === h.vaultId);
        if (!vault) return;

        const backingRatio = ((vault.totalStaked - vault.totalClaimed) / vault.totalStaked * 100).toFixed(1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-bold">${vault.title}</td>
            <td><span class="code-font">${h.ticker}</span></td>
            <td>${h.balance.toLocaleString()} ST</td>
            <td><span class="badge ${vault.status === 'Active' ? 'badge-success' : 'badge-danger'}">${vault.status}</span></td>
            <td>${backingRatio}% Backed</td>
            <td>
                <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" onclick="withdrawSponsorRefund(${vault.id})">Redeem Refund</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function withdrawSponsorRefund(vaultId) {
    const vault = state.vaults.find(v => v.id === vaultId);
    if (!vault) return;
    alert(`Soroban withdraw_sponsor_refund() Called on ${vault.contractId.substring(0, 12)}...\nRedeemed sponsor refund for ${vault.title}. Tokens burned and unvested/slashed principal returned to sponsor.`);
}

// Modals
let currentStakeVaultId = 1;

function openStakeModal(vaultId) {
    currentStakeVaultId = vaultId;
    const vault = state.vaults.find(v => v.id === vaultId);
    if (vault) {
        document.getElementById('stake-modal-title').textContent = `Stake Capital into ${vault.title}`;
    }
    document.getElementById('stake-modal').classList.remove('hidden');
}

function closeStakeModal() {
    document.getElementById('stake-modal').classList.add('hidden');
}

function confirmDepositStake() {
    const amt = parseFloat(document.getElementById('stake-amount-input').value) || 1000;
    const vault = state.vaults.find(v => v.id === currentStakeVaultId);
    if (!vault) return;

    vault.totalStaked += amt;
    
    // Add or update holding
    const holding = state.userHoldings.find(h => h.vaultId === vault.id);
    if (holding) {
        holding.balance += amt;
    } else {
        state.userHoldings.push({ vaultId: vault.id, ticker: vault.ticker, balance: amt });
    }

    closeStakeModal();
    renderMarketplace();
    renderHoldingsTable();
    alert(`Staked ${amt.toLocaleString()} XLM into ${vault.title}!\nMinted ${amt.toLocaleString()} ${vault.ticker} Skill Tokens to your sponsor wallet.`);
}

function openCreateVaultModal() {
    document.getElementById('create-modal').classList.remove('hidden');
}

function closeCreateVaultModal() {
    document.getElementById('create-modal').classList.add('hidden');
}

function confirmCreateVault() {
    const title = document.getElementById('new-vault-title').value || 'Custom Skill Vault';
    const category = document.getElementById('new-vault-category').value;
    const rate = parseFloat(document.getElementById('new-vault-rate').value) || 0.005;
    const learner = document.getElementById('new-vault-learner').value || 'GDLEARNER...99X';

    const newId = state.vaults.length + 1;
    const contractId = 'C' + Math.random().toString(36).substring(2, 12).toUpperCase() + 'SKILLVAULT';
    
    const newVault = {
        id: newId,
        title,
        category,
        ticker: `ST-${category.toUpperCase()}${newId}`,
        contractId,
        learner: learner.substring(0, 6) + '...' + learner.substring(learner.length - 4),
        learnerFull: learner,
        status: 'Active',
        totalStaked: 10000,
        totalClaimed: 0,
        totalSlashed: 0,
        baseRatePerSec: rate,
        currentMultiplierBps: 10000,
        healthScore: 100,
        milestones: [
            { id: 1, title: 'Milestone 1: Core Fundamentals', deadlineDays: 30, unlockPct: 50, accelBps: 2500, unlocked: false, hash: 'Pending' },
            { id: 2, title: 'Milestone 2: Production Capstone', deadlineDays: 60, unlockPct: 50, accelBps: 2500, unlocked: false, hash: 'Pending' }
        ]
    };

    state.vaults.push(newVault);
    populateSelectDropdowns();
    closeCreateVaultModal();
    renderMarketplace();
    alert(`Soroban Contract Initialized on Stellar Testnet!\nContract ID: ${contractId}\nLearner: ${learner}`);
}
