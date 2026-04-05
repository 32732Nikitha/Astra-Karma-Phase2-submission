/* ──────────────────────────────────────────────────────────
   BHIMA ASTRA — UI Layer
   All DOM updates, animations, gauge rendering, terminal log
   ────────────────────────────────────────────────────────── */

const CIRC = 150.8; // 2πr for r=24

/* ── Clock ───────────────────────────────────────────────── */
function updateClock() {
  const t = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
  const el = document.getElementById('sys-clock');
  if (el) el.textContent = 'IST ' + t;
}
setInterval(updateClock, 1000);
updateClock();

/* ── Get timestamp string ────────────────────────────────── */
function getTs() {
  return new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
}

/* ── Terminal log ────────────────────────────────────────── */
function log(subsystem, msg, cls = '') {
  const body = document.getElementById('term-body');
  if (!body) return;
  const SUB_MAP = {
    SYSTEM:   'sys',
    ORACLE:   'oracle',
    RULES:    'rule',
    BEHAVIOR: 'behavior',
    DECISION: 'decision',
    FRAUD:    'fraud'
  };
  const subCls = SUB_MAP[subsystem] || 'sys';
  const line = document.createElement('div');
  line.className = 'log-line';
  line.innerHTML =
    `<span class="log-ts">${getTs()}</span>` +
    `<span class="log-sub ${subCls}">[${subsystem}]</span>` +
    `<span class="log-msg ${cls}">${msg}</span>`;
  body.appendChild(line);
  setTimeout(() => { body.scrollTop = body.scrollHeight; }, 40);
}

function clearTerminal() {
  const body = document.getElementById('term-body');
  if (body) body.innerHTML = '';
}

/* ── Gauge rings ─────────────────────────────────────────── */
function setGauge(id, value, max) {
  const pct = Math.min(value / max, 1);
  const dash = pct * CIRC;
  const circle = document.getElementById('g-' + id + '-c');
  if (!circle) return;
  circle.style.strokeDasharray = dash + ' ' + CIRC;
  // Color: sage → amber-warm → danger
  if (pct > 0.75) circle.style.stroke = 'var(--danger)';
  else if (pct > 0.50) circle.style.stroke = 'var(--amber-warm)';
  else circle.style.stroke = 'var(--sage)';

  const valEl = document.getElementById('g-' + id + '-val');
  if (valEl) valEl.textContent = Math.round(pct * 100) + '%';
}

function resetGauges() {
  ['rain', 'aqi', 'traf'].forEach(id => {
    setGauge(id, 0, 100);
    const valEl = document.getElementById('g-' + id + '-val');
    if (valEl) valEl.textContent = '0%';
  });
  document.getElementById('rain-detail').textContent = '0.0 mm · Clear';
  document.getElementById('aqi-detail').textContent  = '0 · Good';
  document.getElementById('traf-detail').textContent = '0.0 · Free flow';
  document.getElementById('oracle-event-label').textContent = 'No event loaded';
  document.getElementById('oracle-event-label').classList.remove('active');
  document.getElementById('composite-val').textContent = '0.000';
  document.getElementById('composite-bar').style.width = '0%';
  document.getElementById('term-event-id').textContent = 'EVENT: —';
}

/* ── Pipeline stages ─────────────────────────────────────── */
function setPipeState(idx, state) {
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById('pipe-' + i);
    if (!el) continue;
    el.className = 'pipe-stage';
    if (i < idx)   el.classList.add('done');
    if (i === idx) el.classList.add(state);
  }
}

function allPipesDone() {
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById('pipe-' + i);
    if (el) el.className = 'pipe-stage done';
  }
}

function resetPipeline() {
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById('pipe-' + i);
    if (el) el.className = 'pipe-stage';
  }
}

/* ── Worker card ─────────────────────────────────────────── */
function updateWorkerUI(worker) {
  document.getElementById('w-name').textContent = worker.name;
  document.getElementById('w-meta').textContent =
    worker.id + ' · ' + worker.platform + ' · ' + worker.city;
  document.getElementById('w-avatar').textContent = worker.initials;
  document.getElementById('syn-badge').style.display = worker.synthetic ? 'inline' : 'none';

  const tagsEl = document.getElementById('w-tags');
  tagsEl.innerHTML = worker.tags
    .map(t => `<span class="tag ${t.cls}">${t.label}</span>`)
    .join('');

  const f = worker.features;
  document.getElementById('f-gps').textContent   = f.gps_tower_delta + 'm';
  document.getElementById('f-accel').textContent = f.accelerometer_variance.toFixed(3);
  document.getElementById('f-resp').textContent  = f.claim_response_time_sec + 's';
  document.getElementById('f-inter').textContent = f.app_interaction_count;
  document.getElementById('f-jump').textContent  = f.location_jump_flag ? 'Yes' : 'No';
}

/* ── Rule flags ──────────────────────────────────────────── */
function updateRuleFlags(flags, decision) {
  const chips = document.querySelectorAll('.flag-chip');
  chips.forEach(chip => {
    chip.classList.remove('triggered');
    if (flags.includes(chip.dataset.flag)) {
      chip.classList.add('triggered');
    }
  });

  const rdEl = document.getElementById('rule-decision');
  const ruleCard = document.getElementById('card-rules');
  if (decision === 'REVIEW') {
    rdEl.textContent = '⚑ Review — ' + flags.length + ' flag' + (flags.length > 1 ? 's' : '') + ' raised';
    rdEl.style.color = 'var(--amber-warm)';
    ruleCard.classList.add('card-amber');
  } else {
    rdEl.textContent = '✓ Pass — No flags raised';
    rdEl.style.color = 'var(--sage)';
    ruleCard.classList.remove('card-amber');
  }

  const ruleScore = flags.length / 4;
  document.getElementById('rule-score-bar').style.width = (ruleScore * 100) + '%';
  document.getElementById('rule-score-val').textContent = flags.length + ' / 4';
}

function resetRuleFlags() {
  document.querySelectorAll('.flag-chip').forEach(c => c.classList.remove('triggered'));
  const rdEl = document.getElementById('rule-decision');
  rdEl.textContent = '— Awaiting Simulation —';
  rdEl.style.color = 'var(--silver)';
  document.getElementById('card-rules').classList.remove('card-amber');
  document.getElementById('rule-score-bar').style.width = '0%';
  document.getElementById('rule-score-val').textContent = '0 / 4';
}

/* ── Behavior panel ──────────────────────────────────────── */
function updateBehaviorUI(score, gpsComp, motionComp, interactComp, locationJump) {
  const el = document.getElementById('bscore-val');
  el.textContent = score.toFixed(2);

  let color = 'var(--sage)', tagText = 'NORMAL', tagCls = '';
  if (score > 0.70) { color = 'var(--danger)';      tagText = 'HIGH ANOMALY'; tagCls = 'anomaly'; }
  else if (score > 0.30) { color = 'var(--amber-warm)'; tagText = 'SUSPICIOUS';  tagCls = 'suspicious'; }
  el.style.color = color;

  const tag = document.getElementById('bscore-tag');
  tag.textContent = tagText;
  tag.className = 'behavior-score-tag ' + tagCls;

  const DELAY = 120;
  setTimeout(() => {
    document.getElementById('bar-gps').style.width    = (gpsComp * 100).toFixed(0) + '%';
    document.getElementById('pct-gps').textContent    = (gpsComp * 100).toFixed(0) + '%';
  }, 0);
  setTimeout(() => {
    document.getElementById('bar-motion').style.width = ((1 - motionComp) * 100).toFixed(0) + '%';
    document.getElementById('pct-motion').textContent = ((1 - motionComp) * 100).toFixed(0) + '%';
  }, DELAY);
  setTimeout(() => {
    document.getElementById('bar-interact').style.width = ((1 - interactComp) * 100).toFixed(0) + '%';
    document.getElementById('pct-interact').textContent  = ((1 - interactComp) * 100).toFixed(0) + '%';
  }, DELAY * 2);
  setTimeout(() => {
    document.getElementById('bar-jump').style.width  = (locationJump * 100).toFixed(0) + '%';
    document.getElementById('pct-jump').textContent  = (locationJump * 100).toFixed(0) + '%';
  }, DELAY * 3);
}

function resetBehaviorUI() {
  document.getElementById('bscore-val').textContent = '0.00';
  document.getElementById('bscore-val').style.color = 'var(--sage)';
  document.getElementById('bscore-tag').textContent = 'AWAITING';
  document.getElementById('bscore-tag').className = 'behavior-score-tag';
  ['gps', 'motion', 'interact', 'jump'].forEach(k => {
    document.getElementById('bar-' + k).style.width  = '0%';
    document.getElementById('pct-' + k).textContent  = '0%';
  });
  document.getElementById('gps-badge').className = 'gps-badge ok';
  document.getElementById('gps-badge').textContent = 'NOMINAL';
  document.getElementById('gps-delta-val').textContent = 'Delta: — m';
  setSparkline([]);
}

/* ── GPS badge ───────────────────────────────────────────── */
function updateGPSBadge(delta) {
  document.getElementById('gps-delta-val').textContent = 'Delta: ' + delta.toFixed(0) + ' m';
  const badge = document.getElementById('gps-badge');
  if (delta > 500) {
    badge.className = 'gps-badge fail'; badge.textContent = 'MISMATCH';
  } else if (delta > 200) {
    badge.className = 'gps-badge warn'; badge.textContent = 'DEGRADED';
  } else {
    badge.className = 'gps-badge ok';  badge.textContent = 'NOMINAL';
  }
}

/* ── Sparkline ───────────────────────────────────────────── */
function setSparkline(data) {
  const W = 240, H = 60;
  const pathEl = document.getElementById('spark-path');
  const fillEl = document.getElementById('spark-fill');
  if (!pathEl || !fillEl) return;
  if (!data || data.length < 2) {
    pathEl.setAttribute('d', 'M0 30 L240 30');
    fillEl.setAttribute('d', 'M0 30 L240 30 L240 60 L0 60 Z');
    return;
  }
  const max = Math.max(...data);
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: (H - 8) - (v / max) * (H - 16)
  }));
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C${cpx} ${pts[i-1].y} ${cpx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`;
  }
  pathEl.setAttribute('d', d);
  fillEl.setAttribute('d', d + ` L${pts[pts.length-1].x} ${H} L0 ${H} Z`);
}

/* ── Risk meter ──────────────────────────────────────────── */
function updateRisk(score) {
  const pct = Math.min(1, Math.max(0, score)) * 100;
  document.getElementById('risk-cursor').style.left = pct + '%';
  let label, color;
  if (score < 0.25)      { label = 'LOW';      color = 'var(--sage)'; }
  else if (score < 0.55) { label = 'MEDIUM';   color = 'var(--amber-warm)'; }
  else if (score < 0.80) { label = 'HIGH';     color = 'var(--clay)'; }
  else                   { label = 'CRITICAL'; color = 'var(--danger)'; }
  const rtEl = document.getElementById('risk-text');
  rtEl.textContent = label;
  rtEl.style.color = color;
}

/* ── Modal ───────────────────────────────────────────────── */
function showModal(decisionResult, featureImportance, worker) {
  const { decision, finalScore, percentile, behaviorScore, ruleScore,
          payoutStatus, primary_reason, all_reasons } = decisionResult;

  const clsMap = { APPROVE: 'approve', REVIEW: 'review', BLOCK: 'block' };
  const badge = document.getElementById('verdict-badge');
  badge.className = 'verdict-badge ' + clsMap[decision];
  badge.textContent = '● ' + decision;

  document.getElementById('verdict-reason').textContent =
    REASON_LABELS[primary_reason] || primary_reason;

  let sub = REASON_SUBS[primary_reason] || '';
  if (primary_reason === 'ring_cluster')
    sub = 'Worker connected to a ' + decisionResult.clusterSize + '-node fraud cluster.';
  if (primary_reason === 'behavioral_anomaly')
    sub = 'LSTM behavior score ' + behaviorScore.toFixed(2) + ' exceeds anomaly threshold of 0.70.';
  if (primary_reason === 'high_tabular_prob')
    sub = 'XGBoost model probability: ' + (decisionResult.tabularProb * 100).toFixed(1) + '%';
  document.getElementById('verdict-sub').textContent = sub;

  document.getElementById('m-final').textContent   = finalScore.toFixed(3);
  document.getElementById('m-pct').textContent     = 'P' + Math.round(percentile * 100);
  document.getElementById('m-bscore').textContent  = behaviorScore.toFixed(3);
  document.getElementById('m-rules').textContent   = Math.round(ruleScore * 4) + ' / 4';

  const payoutMap = {
    'FULL_RELEASE':     '✓ Full Release — Immediate transfer',
    'PARTIAL_RELEASE':  '⏸ Partial Release — 48h investigative hold',
    'ON_HOLD':          '✗ On Hold — Manual investigation required'
  };
  document.getElementById('m-payout').textContent = payoutMap[payoutStatus] || payoutStatus;
  document.getElementById('m-worker').textContent = worker.name + ' [' + worker.id + ']';

  // Feature importance rows
  const featRows = document.getElementById('feat-rows');
  featRows.innerHTML = featureImportance.map(f => `
    <div class="feat-imp-row">
      <span class="feat-imp-name">${f.name}</span>
      <div class="feat-imp-track">
        <div class="feat-imp-bar" style="width:${f.importance}%"></div>
      </div>
      <span class="feat-imp-pct">${f.importance.toFixed(1)}%</span>
    </div>
  `).join('');

  // All reasons chips
  const allWrap = document.getElementById('all-reasons-wrap');
  allWrap.innerHTML = all_reasons.map((r, i) =>
    `<span class="reason-chip ${i === 0 ? 'primary' : ''}">${REASON_LABELS[r] || r}</span>`
  ).join('');

  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}
