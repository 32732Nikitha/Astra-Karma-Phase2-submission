/* ──────────────────────────────────────────────────────────
   BHIMA ASTRA — Main Orchestrator
   Runs the 4-stage pipeline simulation end-to-end.
   ────────────────────────────────────────────────────────── */

let currentWorkerIdx = 0;
let simRunning = false;
let totalPayout = 482350;
let claimCount  = 847;

/* ── Worker selection ────────────────────────────────────── */
function onWorkerChange(val) {
  currentWorkerIdx = parseInt(val);
  const worker = WORKERS[currentWorkerIdx];
  updateWorkerUI(worker);
  resetRuleFlags();
  resetBehaviorUI();
  resetPipeline();
}

/* ── Sleep ───────────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Full simulation pipeline ────────────────────────────── */
async function runSimulation() {
  if (simRunning) return;
  simRunning = true;
  document.getElementById('run-btn').disabled = true;

  const worker = WORKERS[currentWorkerIdx];
  const evt    = EVENTS[Math.floor(Math.random() * EVENTS.length)];

  clearTerminal();
  document.getElementById('term-event-id').textContent = 'EVENT: ' + evt.id;

  /* ════════════════════════════════════════════════════════
     BOOT
  ════════════════════════════════════════════════════════ */
  log('SYSTEM', 'Initializing Astra simulation pipeline...');
  await sleep(350);
  log('SYSTEM', 'Worker: ' + worker.name + ' [' + worker.id + ']');
  await sleep(250);
  log('SYSTEM', 'Loading disruption event ' + evt.id + ' from disruption.csv');
  await sleep(300);

  /* ════════════════════════════════════════════════════════
     STAGE 1 — ORACLE PHASE  (disruption.csv)
  ════════════════════════════════════════════════════════ */
  setPipeState(0, 'running');
  log('ORACLE', 'Environmental scan initiated. Zone: ' + worker.city);
  await sleep(450);

  // Rainfall
  setGauge('rain', evt.rainfall, 100);
  document.getElementById('rain-detail').textContent =
    evt.rainfall.toFixed(1) + ' mm · Zone: ' + worker.zone;
  await sleep(280);

  // AQI
  setGauge('aqi', evt.aqi, 500);
  document.getElementById('aqi-detail').textContent =
    evt.aqi + ' · ' + (evt.aqi > 300 ? 'Hazardous' : evt.aqi > 150 ? 'Unhealthy' : 'Moderate');
  await sleep(280);

  // Traffic
  setGauge('traf', evt.traffic, 100);
  document.getElementById('traf-detail').textContent =
    evt.traffic.toFixed(1) + ' · ' + (evt.traffic > 75 ? 'Congested' : evt.traffic > 50 ? 'Slow' : 'Moderate');
  await sleep(280);

  // Composite
  document.getElementById('oracle-event-label').textContent = evt.label;
  document.getElementById('oracle-event-label').classList.add('active');
  document.getElementById('composite-val').textContent = evt.composite.toFixed(4);
  document.getElementById('composite-bar').style.width = (evt.composite * 100) + '%';

  if (evt.rainfall > 45)
    log('ORACLE', '⚑ Threshold ' + evt.rainfall.toFixed(1) + 'mm exceeded. Initiating Astra-Check.', 'warn');
  if (evt.aqi > 300)
    log('ORACLE', '⚑ AQI ' + evt.aqi + ' exceeds L3 threshold. Policy trigger active.', 'warn');
  if (evt.traffic > 75)
    log('ORACLE', '⚑ Traffic index ' + evt.traffic.toFixed(1) + '% — Zone shutdown check.', 'warn');

  log('ORACLE', 'Composite disruption score: ' + evt.composite.toFixed(4));
  if (evt.flood_alert)    log('ORACLE', 'Flood alert: ACTIVE — Road closures detected.', 'warn');
  if (evt.road_closure)   log('ORACLE', 'Road closure flag: ON — Delivery zone restricted.', 'warn');
  await sleep(500);

  /* ════════════════════════════════════════════════════════
     STAGE 2 — RULE ENGINE  (fraud_rules.py)
  ════════════════════════════════════════════════════════ */
  setPipeState(1, 'running');
  log('RULES', 'Checking deterministic pre-filters (Stage 1)...');
  await sleep(400);

  const ruleResult = runRuleEngine(worker.features);

  const f = worker.features;
  log('RULES', 'GPS delta: ' + f.gps_tower_delta + 'm (threshold: 500m)',
    f.gps_tower_delta > 500 ? 'warn' : '');
  await sleep(200);
  log('RULES', 'Accel variance: ' + f.accelerometer_variance.toFixed(3) + ' (min: 0.5)',
    f.accelerometer_variance < 0.5 ? 'warn' : '');
  await sleep(200);
  log('RULES', 'Response time: ' + f.claim_response_time_sec + 's (threshold: 60s)',
    f.claim_response_time_sec < 60 ? 'warn' : '');
  await sleep(200);
  log('RULES', 'Device flagged: ' + (f.device_flagged ? 'YES ⚠' : 'No'),
    f.device_flagged ? 'warn' : '');
  await sleep(300);

  updateRuleFlags(ruleResult.rule_flags, ruleResult.rule_decision);

  if (ruleResult.rule_decision === 'REVIEW') {
    log('RULES', '⚑ REVIEW — ' + ruleResult.rule_flags.length + ' flag(s): [' + ruleResult.rule_flags.join(', ') + ']', 'warn');
  } else {
    log('RULES', '✓ All rules passed. Decision: PASS', 'good');
  }
  await sleep(500);

  /* ════════════════════════════════════════════════════════
     STAGE 3 — BEHAVIOR MODEL  (behavior_model.py)
  ════════════════════════════════════════════════════════ */
  setPipeState(2, 'running');
  log('BEHAVIOR', 'Loading LSTM-style behavioral signature (Stage 2)...');
  await sleep(400);
  log('BEHAVIOR', 'Worker ' + worker.id + ' · Analyzing movement patterns');
  await sleep(350);

  const behaviorResult = computeBehaviorScore(worker.features);
  const bs = behaviorResult.behavior_score;

  // Sparkline
  const trace = generateMotionTrace(worker.features.accelerometer_variance);
  setSparkline(trace);

  // Update components
  updateBehaviorUI(
    bs,
    behaviorResult.gpsComp,
    behaviorResult.motionComp,
    behaviorResult.interactComp,
    behaviorResult.locationJump
  );
  updateGPSBadge(worker.features.gps_tower_delta);

  const bsLabel = bs < 0.30 ? 'NORMAL' : bs < 0.70 ? 'SUSPICIOUS' : 'HIGH ANOMALY';
  log('BEHAVIOR', 'GPS component:         ' + (behaviorResult.gpsComp * 100).toFixed(0) + '%');
  await sleep(180);
  log('BEHAVIOR', 'Motion component:      ' + (behaviorResult.motionComp * 100).toFixed(0) + '%');
  await sleep(180);
  log('BEHAVIOR', 'Interaction component: ' + (behaviorResult.interactComp * 100).toFixed(0) + '%');
  await sleep(180);
  log('BEHAVIOR',
    'Behavior score: ' + bs.toFixed(4) + '  [' + bsLabel + ']',
    bs > 0.5 ? 'warn' : 'good'
  );
  await sleep(550);

  /* ════════════════════════════════════════════════════════
     STAGE 4 — DECISION ENGINE  (decision_engine.py)
  ════════════════════════════════════════════════════════ */
  setPipeState(3, 'running');
  log('DECISION', 'Running adaptive percentile decision engine (Stage 4)...');
  await sleep(400);
  log('DECISION', 'Loading calibration distribution from fraud_score_calibration.pkl');
  await sleep(500);

  const decisionResult = makeFraudDecision(
    worker.graph.tabular_prob,
    worker.graph.fraud_cluster_score,
    worker.graph.cluster_size,
    bs,
    ruleResult.rule_score,
    worker.features,
    worker.name
  );

  const featureImportance = generateFeatureImportance(worker.features, behaviorResult);

  log('DECISION', 'Tabular fraud prob:  ' + worker.graph.tabular_prob.toFixed(4));
  await sleep(180);
  log('DECISION', 'Cluster score:       ' + worker.graph.fraud_cluster_score.toFixed(4) +
    '  (cluster size: ' + worker.graph.cluster_size + ')');
  await sleep(180);
  log('DECISION', 'Behavior score:      ' + bs.toFixed(4) + '  (weight: 0.15)');
  await sleep(180);
  log('DECISION', 'Rule score:          ' + ruleResult.rule_score.toFixed(4) + '  (weight: 0.10)');
  await sleep(180);
  log('DECISION', 'Final score:         ' + decisionResult.finalScore.toFixed(4) +
    '  |  Percentile: ' + decisionResult.percentile.toFixed(4));
  await sleep(350);

  const decCls = { APPROVE: 'good', REVIEW: 'warn', BLOCK: 'danger' }[decisionResult.decision] || '';
  log('DECISION',
    '══ VERDICT: ' + decisionResult.decision +
    ' ══  Payout: ' + decisionResult.payoutStatus,
    decCls + ' bold'
  );
  log('DECISION', 'Primary reason: ' + (REASON_LABELS[decisionResult.primary_reason] || decisionResult.primary_reason), decCls);

  /* Finalize pipeline */
  allPipesDone();
  updateRisk(decisionResult.finalScore);

  /* Update payout tally */
  if (decisionResult.decision === 'APPROVE') {
    const payout = Math.floor(600 + Math.random() * 1400);
    totalPayout += payout;
    claimCount++;
    document.getElementById('payout-total').textContent =
      '₹' + totalPayout.toLocaleString('en-IN');
    document.getElementById('payout-count').textContent = claimCount;
  }

  // Latency jitter
  document.getElementById('latency-val').textContent =
    (6 + Math.floor(Math.random() * 18)) + 'ms';

  await sleep(750);

  /* Show modal */
  showModal(decisionResult, featureImportance, worker);

  simRunning = false;
  document.getElementById('run-btn').disabled = false;
}

/* ── Reset ───────────────────────────────────────────────── */
function resetAll() {
  simRunning = false;
  document.getElementById('run-btn').disabled = false;
  clearTerminal();
  const body = document.getElementById('term-body');
  if (body) {
    body.innerHTML =
      `<div class="log-line init">
        <span class="log-ts">${getTs()}</span>
        <span class="log-sub sys">[SYSTEM]</span>
        <span class="log-msg">System reset. Ready.<span class="cursor-blink"></span></span>
      </div>`;
  }
  resetGauges();
  resetPipeline();
  resetRuleFlags();
  resetBehaviorUI();
  updateRisk(0.12);
  closeModal();
  document.getElementById('term-event-id').textContent = 'EVENT: —';
}

/* ── Init on load ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateWorkerUI(WORKERS[0]);
  updateRisk(0.12);
});
