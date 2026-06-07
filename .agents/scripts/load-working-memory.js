#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * load-working-memory.js
 * Đọc và hiển thị Trạng thái Hiện tại từ docs/ky-uc/NOTES.md một cách cross-platform.
 * Dùng làm PreInvocation hook trong hooks.json.
 */

const fs = require('fs');
const path = require('path');

const notesPath = path.resolve(__dirname, '..', '..', 'docs', 'ky-uc', 'NOTES.md');

if (!fs.existsSync(notesPath)) {
  console.log('⚠️ [Working Memory] docs/ky-uc/NOTES.md không tồn tại.');
  process.exit(0);
}

try {
  const content = fs.readFileSync(notesPath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  // Tìm tiêu đề "## 📍 Trạng Thái Hiện Tại"
  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## 📍 Trạng Thái Hiện Tại') || lines[i].includes('Trạng Thái Hiện Tại')) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) {
    console.log('⚠️ [Working Memory] Không tìm thấy phần "Trạng Thái Hiện Tại" trong NOTES.md');
    process.exit(0);
  }

  console.log('\n=================== 🧠 WORKING MEMORY LOADED ===================');
  // In ra 6 dòng bắt đầu từ startIndex
  const maxLinesToPrint = 6;
  const endIndex = Math.min(startIndex + maxLinesToPrint, lines.length);
  for (let j = startIndex; j < endIndex; j++) {
    console.log(lines[j]);
  }
  console.log('================================================================\n');

} catch (error) {
  console.error('❌ [Working Memory] Lỗi khi đọc NOTES.md:', error.message);
}
process.exit(0);
