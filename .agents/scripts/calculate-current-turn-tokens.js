#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * calculate-current-turn-tokens.js
 * Tính toán tự động số lượng input/output tokens của cuộc hội thoại hiện tại.
 * Đọc transcript.jsonl từ lần USER_INPUT cuối cùng, tính toán qua tất cả các bước (steps)
 * của turn hiện tại để đưa ra số lượng In/Out thực tế nhất.
 */

const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\dinhp\\.gemini\\antigravity-ide\\brain';
const workspaceDir = path.resolve(__dirname, '..', '..');
const dataDir = path.join(workspaceDir, '.agents', 'data');
const metricsPath = path.join(dataDir, 'session-metrics.json');

// Đọc transcript.jsonl
function getTranscriptPath() {
  
  // Fallback quét thư mục brain
  if (fs.existsSync(brainDir)) {
    const subdirs = fs.readdirSync(brainDir).filter(f => fs.statSync(path.join(brainDir, f)).isDirectory());
    let latestTime = 0;
    let latestPath = null;
    subdirs.forEach(dir => {
      const p = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
      if (fs.existsSync(p)) {
        const stat = fs.statSync(p);
        if (stat.mtimeMs > latestTime) {
          latestTime = stat.mtimeMs;
          latestPath = p;
        }
      }
    });
    if (latestPath) return latestPath;
  }
  return null;
}

const transcriptPath = getTranscriptPath();
if (!transcriptPath) {
  console.log(JSON.stringify({ inputTokens: 0, outputTokens: 0, error: 'Không tìm thấy transcript.jsonl' }));
  process.exit(1);
}

// 1 Token trung bình bằng khoảng 3.6 ký tự (hỗn hợp Việt/Anh/Code)
const CHARS_PER_TOKEN = 3.6;

// Tính kích thước các tài liệu tĩnh (AGENTS.md, GEMINI.md, workflows, skills)
function getStaticContextSize() {
  let size = 12000; // Base system prompt instruction size (ước tính)
  
  const agentsMd = path.join(workspaceDir, 'AGENTS.md');
  if (fs.existsSync(agentsMd)) size += fs.statSync(agentsMd).size;
  
  const geminiMd = path.join(workspaceDir, 'GEMINI.md');
  if (fs.existsSync(geminiMd)) size += fs.statSync(geminiMd).size;
  
  // Workflows
  const workflowsDir = path.join(workspaceDir, '.agents', 'workflows');
  if (fs.existsSync(workflowsDir)) {
    fs.readdirSync(workflowsDir).forEach(f => {
      if (f.endsWith('.md')) size += fs.statSync(path.join(workflowsDir, f)).size;
    });
  }

  // Skills
  const skillsDir = path.join(workspaceDir, '.agents', 'skills');
  if (fs.existsSync(skillsDir)) {
    const scanSkills = (dir) => {
      fs.readdirSync(dir).forEach(f => {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
          scanSkills(full);
        } else if (f.endsWith('.md') || f.endsWith('.js') || f.endsWith('.json')) {
          size += fs.statSync(full).size;
        }
      });
    };
    scanSkills(skillsDir);
  }

  return size;
}

// Format số lớn thành K/M
function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

try {
  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.trim().split('\n').map(line => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);

  // Tìm USER_INPUT cuối cùng
  let lastUserInputIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].source === 'USER_EXPLICIT' && lines[i].type === 'USER_INPUT') {
      lastUserInputIdx = i;
      break;
    }
  }

  if (lastUserInputIdx === -1) {
    console.log(JSON.stringify({ inputTokens: 0, outputTokens: 0, error: 'Không tìm thấy USER_INPUT' }));
    process.exit(1);
  }

  const staticSize = getStaticContextSize();
  
  // Tính toán kích thước hội thoại trước turn hiện tại (history)
  let historySize = 0;
  for (let i = 0; i < lastUserInputIdx; i++) {
    const step = lines[i];
    if (step.content) historySize += step.content.length;
    if (step.thinking) historySize += step.thinking.length;
  }
  // Giới hạn history size vì IDE thường trim bớt context
  historySize = Math.min(historySize, 50000);

  let totalInputChars = 0;
  let totalOutputChars = 0;

  // Lặp qua các bước của turn hiện tại
  let currentAccumulatedInput = staticSize + historySize;

  for (let i = lastUserInputIdx; i < lines.length; i++) {
    const step = lines[i];
    
    // Mỗi step là một cuộc gọi LLM
    totalInputChars += currentAccumulatedInput;

    // Đầu ra của step
    let stepOutputChars = 0;
    if (step.thinking) stepOutputChars += step.thinking.length;
    if (step.tool_calls) stepOutputChars += JSON.stringify(step.tool_calls).length;
    if (step.content && step.source === 'MODEL') stepOutputChars += step.content.length;

    totalOutputChars += stepOutputChars;

    // Tích lũy cho bước tiếp theo
    if (step.content) currentAccumulatedInput += step.content.length;
    if (step.thinking) currentAccumulatedInput += step.thinking.length;
    if (step.tool_calls) currentAccumulatedInput += JSON.stringify(step.tool_calls).length;
  }

  // Cộng thêm ước tính cho câu trả lời final hiện tại của model
  totalInputChars += currentAccumulatedInput;
  totalOutputChars += 1500; // Ước tính output của final response

  const inputTokens = Math.round(totalInputChars / CHARS_PER_TOKEN);
  const outputTokens = Math.round(totalOutputChars / CHARS_PER_TOKEN);
  const costUSD = (inputTokens / 1000000 * 0.075) + (outputTokens / 1000000 * 0.30); // Gemini Flash pricing

  const args = process.argv.slice(2);
  
  if (args.includes('--update')) {
    // Tự động cập nhật vào file session-metrics.json
    if (fs.existsSync(metricsPath)) {
      try {
        const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
        
        metrics.turns += 1;
        metrics.tokens.inputTotal += inputTokens;
        metrics.tokens.outputTotal += outputTokens;
        metrics.tokens.grandTotal = metrics.tokens.inputTotal + metrics.tokens.outputTotal;
        metrics.estimatedCostUSD += costUSD;
        
        metrics.allTimeTotals.turns += 1;
        metrics.allTimeTotals.inputTokens += inputTokens;
        metrics.allTimeTotals.outputTokens += outputTokens;
        
        metrics.history.push({
          turn: metrics.turns,
          timestamp: new Date().toISOString(),
          inputTokens,
          outputTokens,
          note: 'Auto updated by calculate-current-turn-tokens'
        });
        
        fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), 'utf8');
      } catch {
        // Ignored
      }
    }
  }

  // In ra định dạng markdown sạch để agent copy vào chat response
  console.log(`\n**[Metrics]** Input: ~${formatNum(inputTokens)} tokens | Output: ~${formatNum(outputTokens)} tokens | Turn: #${fs.existsSync(metricsPath) ? JSON.parse(fs.readFileSync(metricsPath, 'utf8')).turns : 1} | Cost: ~$${costUSD.toFixed(4)}`);

} catch (error) {
  console.log(JSON.stringify({ inputTokens: 0, outputTokens: 0, error: error.message }));
}
