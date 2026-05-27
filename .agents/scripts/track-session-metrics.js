#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * track-session-metrics.js
 * Theo dõi input/output token, số lần hội thoại (turns) và cảnh báo ngưỡng.
 * Được gọi từ hooks.json:
 *   - PreInvocation: hiển thị dashboard metrics hiện tại
 *   - PostInvocation: cập nhật số turns
 *
 * Dữ liệu lưu tại: .agents/data/session-metrics.json
 *
 * Cách đọc token: Antigravity không expose trực tiếp token count,
 * vì vậy script ước tính dựa trên kích thước context đầu vào/đầu ra.
 * Công thức ước tính: ~4 chars = 1 token (GPT/Gemini average).
 *
 * Sử dụng:
 *   node .agents/scripts/track-session-metrics.js --show       (hiển thị dashboard)
 *   node .agents/scripts/track-session-metrics.js --turn       (tăng turn counter)
 *   node .agents/scripts/track-session-metrics.js --reset      (reset metrics mới)
 *   node .agents/scripts/track-session-metrics.js --add-tokens --input=N --output=N
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CẤU HÌNH NGƯỠNG CẢNH BÁO
// ============================================================
const THRESHOLDS = {
  // Cảnh báo khi input tokens gần đạt ngưỡng context window
  inputTokensWarning: 100_000,   // ⚠️  Cảnh báo nhẹ
  inputTokensDanger:  180_000,   // 🔴  Cảnh báo nghiêm trọng
  // Cảnh báo chi phí output (output tokens đắt hơn input)
  outputTokensWarning: 50_000,   // ⚠️  Cảnh báo nhẹ
  outputTokensDanger:  100_000,  // 🔴  Cảnh báo nghiêm trọng
  // Số turns tối đa trong 1 session trước khi khuyến nghị handoff
  turnsWarning: 20,              // ⚠️  Nên cân nhắc handoff
  turnsDanger:  35,              // 🔴  Nên /handoff ngay
  // Tổng tokens (input + output) cho cost management
  totalTokensWarning: 150_000,   // ⚠️  Chi phí đang tăng
  totalTokensDanger:  300_000,   // 🔴  Xem xét tối ưu
};

// ============================================================
// MÔ HÌNH CHI PHÍ (USD per 1M tokens — ước tính)
// Cập nhật theo model thực tế đang dùng
// ============================================================
const COST_MODEL = {
  // Gemini 3.5 Flash (High)
  'gemini-flash': { inputPerM: 0.075, outputPerM: 0.30 },
  // Claude Sonnet 4.x
  'claude-sonnet': { inputPerM: 3.0, outputPerM: 15.0 },
  // Default fallback
  'default': { inputPerM: 1.0, outputPerM: 4.0 },
};

// ============================================================
// PATHS
// ============================================================
const dataDir = path.resolve(__dirname, '..', 'data');
const metricsPath = path.join(dataDir, 'session-metrics.json');

// ============================================================
// HELPERS
// ============================================================

/**
 * Đọc metrics từ file JSON. Tạo mới nếu chưa có.
 */
function readMetrics() {
  if (!fs.existsSync(metricsPath)) {
    return createFreshMetrics();
  }
  try {
    const raw = fs.readFileSync(metricsPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    console.warn('⚠️  Không đọc được session-metrics.json, tạo mới...');
    return createFreshMetrics();
  }
}

/**
 * Tạo metrics object mới cho session
 */
function createFreshMetrics() {
  const now = new Date().toISOString();
  return {
    version: '1.0',
    session: {
      id: `session-${Date.now()}`,
      startedAt: now,
      lastUpdatedAt: now,
      model: 'unknown',
    },
    turns: 0,
    tokens: {
      inputTotal: 0,
      outputTotal: 0,
      grandTotal: 0,
    },
    estimatedCostUSD: 0,
    history: [],      // Mảng { turn, timestamp, inputTokens, outputTokens, note }
    warnings: [],     // Mảng cảnh báo đã phát ra
    allTimeTotals: {  // Tổng cộng dồn theo session
      turns: 0,
      inputTokens: 0,
      outputTokens: 0,
      sessionsCount: 0,
    },
  };
}

/**
 * Lưu metrics ra file
 */
function saveMetrics(metrics) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  metrics.session.lastUpdatedAt = new Date().toISOString();
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), 'utf8');
}

/**
 * Tính chi phí ước tính theo model
 */
function calcCost(inputTokens, outputTokens, modelKey = 'default') {
  const model = COST_MODEL[modelKey] || COST_MODEL['default'];
  const inputCost  = (inputTokens  / 1_000_000) * model.inputPerM;
  const outputCost = (outputTokens / 1_000_000) * model.outputPerM;
  return inputCost + outputCost;
}

/**
 * Tạo progress bar đơn giản
 */
function progressBar(value, max, width = 20) {
  const ratio = Math.min(value / max, 1);
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  const color = ratio >= 0.9 ? '🔴' : ratio >= 0.6 ? '⚠️ ' : '🟢';
  return `${color} [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round(ratio * 100)}%`;
}

/**
 * Format số lớn thành K/M
 */
function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

// ============================================================
// KIỂM TRA NGƯỠNG VÀ TẠO CẢNH BÁO
// ============================================================
function checkThresholds(metrics) {
  const warnings = [];
  const { inputTotal, outputTotal, grandTotal } = metrics.tokens;
  const { turns } = metrics;

  if (inputTotal >= THRESHOLDS.inputTokensDanger) {
    warnings.push({
      level: 'DANGER',
      code: 'INPUT_TOKEN_CRITICAL',
      message: `🔴 INPUT TOKEN NGUY HIỂM: ${formatNum(inputTotal)} tokens — Context window sắp đầy! Hãy /handoff ngay.`,
    });
  } else if (inputTotal >= THRESHOLDS.inputTokensWarning) {
    warnings.push({
      level: 'WARNING',
      code: 'INPUT_TOKEN_HIGH',
      message: `⚠️  Input tokens cao: ${formatNum(inputTotal)} — Xem xét nén context (compaction).`,
    });
  }

  if (outputTotal >= THRESHOLDS.outputTokensDanger) {
    warnings.push({
      level: 'DANGER',
      code: 'OUTPUT_TOKEN_CRITICAL',
      message: `🔴 OUTPUT TOKEN NGUY HIỂM: ${formatNum(outputTotal)} — Chi phí đang rất cao!`,
    });
  } else if (outputTotal >= THRESHOLDS.outputTokensWarning) {
    warnings.push({
      level: 'WARNING',
      code: 'OUTPUT_TOKEN_HIGH',
      message: `⚠️  Output tokens tăng: ${formatNum(outputTotal)} — Cân nhắc ngắn gọn hơn trong phản hồi.`,
    });
  }

  if (turns >= THRESHOLDS.turnsDanger) {
    warnings.push({
      level: 'DANGER',
      code: 'TURNS_CRITICAL',
      message: `🔴 TURNS NGUY HIỂM: ${turns} turns — Context rot có thể xảy ra! Chạy /handoff NGAY.`,
    });
  } else if (turns >= THRESHOLDS.turnsWarning) {
    warnings.push({
      level: 'WARNING',
      code: 'TURNS_HIGH',
      message: `⚠️  ${turns} turns trong session này — Nên cân nhắc /handoff sớm.`,
    });
  }

  if (grandTotal >= THRESHOLDS.totalTokensDanger) {
    warnings.push({
      level: 'DANGER',
      code: 'TOTAL_COST_CRITICAL',
      message: `🔴 TỔNG TOKEN NGUY HIỂM: ${formatNum(grandTotal)} — Chi phí session này rất cao!`,
    });
  } else if (grandTotal >= THRESHOLDS.totalTokensWarning) {
    warnings.push({
      level: 'WARNING',
      code: 'TOTAL_COST_HIGH',
      message: `⚠️  Tổng tokens: ${formatNum(grandTotal)} — Hãy theo dõi chi phí.`,
    });
  }

  return warnings;
}

// ============================================================
// HIỂN THỊ SUMMARY (1 DÒNG — Token-efficient)
// Dùng cho PreInvocation hook để tránh tốn token context mỗi lần gọi.
// Dùng --full để xem đầy đủ dashboard khi cần debug.
// ============================================================
function showSummary(metrics) {
  const { grandTotal } = metrics.tokens;
  const warnings = checkThresholds(metrics);
  const warnStr = warnings.length > 0
    ? ` | ⚠️ ${warnings.map(w => w.code).join(', ')}`
    : '';
  console.log(`[Metrics] Turn ${metrics.turns} | Tokens: ${formatNum(grandTotal)} (~$${metrics.estimatedCostUSD.toFixed(4)})${warnStr}`);
  // Nếu có cảnh báo nghiêm trọng thì in thêm 1 dòng hướng dẫn
  const dangerWarnings = warnings.filter(w => w.level === 'DANGER');
  if (dangerWarnings.length > 0) {
    dangerWarnings.forEach(w => console.warn(w.message));
  }
}

// ============================================================
// HIỂN THỊ DASHBOARD ĐẦY ĐỦ (Chỉ dùng khi debug: --full)
// ============================================================
function showDashboard(metrics) {
  const { inputTotal, outputTotal, grandTotal } = metrics.tokens;
  const cost = metrics.estimatedCostUSD;
  const warnings = checkThresholds(metrics);

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         📊 SESSION METRICS DASHBOARD                    ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Session ID  : ${metrics.session.id.padEnd(42)}║`);
  console.log(`║  Model       : ${(metrics.session.model).padEnd(42)}║`);
  console.log(`║  Bắt đầu     : ${metrics.session.startedAt.substring(0,19).replace('T',' ').padEnd(42)}║`);
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  🔄 Số turns      : ${String(metrics.turns).padEnd(37)}║`);
  console.log(`║  📥 Input tokens  : ${formatNum(inputTotal).padEnd(37)}║`);
  console.log(`║  📤 Output tokens : ${formatNum(outputTotal).padEnd(37)}║`);
  console.log(`║  📦 Tổng tokens   : ${formatNum(grandTotal).padEnd(37)}║`);
  console.log(`║  💰 Chi phí ước tính: $${cost.toFixed(4).padEnd(35)}║`);
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Context Usage (Input):                                  ║');
  console.log(`║  ${progressBar(inputTotal, THRESHOLDS.inputTokensDanger, 30).padEnd(56)}║`);
  console.log('║  Output Cost (Output):                                   ║');
  console.log(`║  ${progressBar(outputTotal, THRESHOLDS.outputTokensDanger, 30).padEnd(56)}║`);
  console.log('║  Turns Load:                                             ║');
  console.log(`║  ${progressBar(metrics.turns, THRESHOLDS.turnsDanger, 30).padEnd(56)}║`);
  if (warnings.length > 0) {
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║  ⚠️  CẢNH BÁO                                            ║');
    warnings.forEach(w => {
      const parts = w.message.match(/.{1,54}/g) || [w.message];
      parts.forEach(p => console.log(`║  ${p.padEnd(56)}║`));
    });
  } else {
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║  ✅ Không có cảnh báo — Session đang ổn                 ║');
  }
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  📈 ALL-TIME TOTALS                                      ║');
  console.log(`║  Sessions : ${String(metrics.allTimeTotals.sessionsCount).padEnd(45)}║`);
  console.log(`║  Turns    : ${String(metrics.allTimeTotals.turns).padEnd(45)}║`);
  console.log(`║  Input    : ${formatNum(metrics.allTimeTotals.inputTokens).padEnd(45)}║`);
  console.log(`║  Output   : ${formatNum(metrics.allTimeTotals.outputTokens).padEnd(45)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝\n');
}

// ============================================================
// MAIN — XỬ LÝ ARGUMENTS
// ============================================================
const args = process.argv.slice(2);
const metrics = readMetrics();

if (args.includes('--show') || args.length === 0) {
  // 1 dòng summary — dùng cho PreInvocation hook (tiết kiệm token)
  showSummary(metrics);

} else if (args.includes('--full')) {
  // Full dashboard — dùng thủ công khi debug: node track-session-metrics.js --full
  showDashboard(metrics);

} else if (args.includes('--turn')) {
  // Tăng turn counter
  metrics.turns += 1;
  metrics.allTimeTotals.turns += 1;
  metrics.history.push({
    turn: metrics.turns,
    timestamp: new Date().toISOString(),
    note: 'Turn recorded by PostInvocation hook',
  });
  saveMetrics(metrics);
  console.log(`[Metrics] Turn ${metrics.turns} recorded.`);

} else if (args.includes('--add-tokens')) {
  // Thêm tokens thủ công
  const inputArg = args.find(a => a.startsWith('--input='));
  const outputArg = args.find(a => a.startsWith('--output='));
  const noteArg = args.find(a => a.startsWith('--note='));
  const modelArg = args.find(a => a.startsWith('--model='));

  const inputN = inputArg ? parseInt(inputArg.split('=')[1], 10) : 0;
  const outputN = outputArg ? parseInt(outputArg.split('=')[1], 10) : 0;
  const note = noteArg ? noteArg.split('=')[1] : '';
  const modelKey = modelArg ? modelArg.split('=')[1] : 'default';

  metrics.tokens.inputTotal += inputN;
  metrics.tokens.outputTotal += outputN;
  metrics.tokens.grandTotal = metrics.tokens.inputTotal + metrics.tokens.outputTotal;
  metrics.estimatedCostUSD += calcCost(inputN, outputN, modelKey);
  metrics.allTimeTotals.inputTokens += inputN;
  metrics.allTimeTotals.outputTokens += outputN;

  if (modelKey !== 'unknown') {
    metrics.session.model = modelKey;
  }

  metrics.history.push({
    turn: metrics.turns,
    timestamp: new Date().toISOString(),
    inputTokens: inputN,
    outputTokens: outputN,
    note: note || 'Manual token add',
  });

  // Lưu cảnh báo vào file nếu có
  const newWarnings = checkThresholds(metrics);
  if (newWarnings.length > 0) {
    metrics.warnings = newWarnings;
    newWarnings.forEach(w => {
      console.warn(w.message);
    });
  }

  saveMetrics(metrics);
  console.log(`[Metrics] +${formatNum(inputN)} input, +${formatNum(outputN)} output tokens. Total: ${formatNum(metrics.tokens.grandTotal)}`);

} else if (args.includes('--reset')) {
  // Reset metrics nhưng giữ all-time totals
  const oldTotals = metrics.allTimeTotals;
  oldTotals.turns += metrics.turns;
  oldTotals.inputTokens += metrics.tokens.inputTotal;
  oldTotals.outputTokens += metrics.tokens.outputTotal;
  oldTotals.sessionsCount += 1;

  const fresh = createFreshMetrics();
  fresh.allTimeTotals = oldTotals;
  saveMetrics(fresh);
  console.log('[Metrics] ✅ Metrics reset cho session mới. All-time totals được giữ lại.');
  showDashboard(fresh);

} else if (args.includes('--set-model')) {
  const modelArg = args.find(a => a.startsWith('--model='));
  if (modelArg) {
    metrics.session.model = modelArg.split('=')[1];
    saveMetrics(metrics);
    console.log(`[Metrics] Model set to: ${metrics.session.model}`);
  }
} else {
  console.log('Usage:');
  console.log('  node track-session-metrics.js --show');
  console.log('  node track-session-metrics.js --turn');
  console.log('  node track-session-metrics.js --reset');
  console.log('  node track-session-metrics.js --add-tokens --input=1000 --output=500 --model=gemini-flash');
  console.log('  node track-session-metrics.js --set-model --model=claude-sonnet');
}
