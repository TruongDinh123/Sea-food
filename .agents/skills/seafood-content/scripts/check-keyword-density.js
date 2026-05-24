#!/usr/bin/env node
/**
 * check-keyword-density.js
 * Kiểm tra mật độ từ khóa trong file markdown hoặc HTML.
 * 
 * Sử dụng:
 *   node check-keyword-density.js --help
 *   node check-keyword-density.js --file=path/to/file.md --keyword="tôm sú cà mau"
 *   node check-keyword-density.js --file=path/to/file.md --keyword="cua cà mau" --min=0.5 --max=2.5
 * 
 * Output:
 *   ✅ PASS: Mật độ 1.2% (target: 0.5%-2.5%)
 *   ❌ FAIL: Mật độ 3.8% (quá cao, nguy cơ keyword stuffing)
 */

const fs = require('fs');
const path = require('path');

// Parse CLI args
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
Keyword Density Checker — Hải Sản Cà Mau SEO Tool

USAGE:
  node check-keyword-density.js --file=<path> --keyword=<từ khóa> [options]

OPTIONS:
  --file=<path>      Đường dẫn file cần kiểm tra (.md, .html, .txt)
  --keyword=<text>   Từ khóa cần kiểm tra mật độ (không phân biệt hoa/thường)
  --min=<number>     Mật độ tối thiểu (%) — mặc định: 0.5
  --max=<number>     Mật độ tối đa (%) — mặc định: 2.5
  --help, -h         Hiển thị hướng dẫn này

VÍ DỤ:
  node check-keyword-density.js --file=content/tom-su.md --keyword="tôm sú cà mau"
  node check-keyword-density.js --file=content/cua.md --keyword="cua năm căn" --min=1 --max=3
  `);
  process.exit(0);
}

function parseArg(args, key, defaultValue) {
  const arg = args.find(a => a.startsWith(`--${key}=`));
  return arg ? arg.split('=').slice(1).join('=') : defaultValue;
}

const filePath = parseArg(args, 'file', null);
const keyword  = parseArg(args, 'keyword', null);
const minDensity = parseFloat(parseArg(args, 'min', '0.5'));
const maxDensity = parseFloat(parseArg(args, 'max', '2.5'));

if (!filePath || !keyword) {
  console.error('❌ ERROR: Cần cung cấp --file và --keyword');
  console.error('   Chạy --help để xem hướng dẫn.');
  process.exit(1);
}

// Đọc file
const absPath = path.resolve(filePath);
if (!fs.existsSync(absPath)) {
  console.error(`❌ ERROR: File không tồn tại: ${absPath}`);
  process.exit(1);
}

let text = fs.readFileSync(absPath, 'utf8');

// Xóa markdown syntax để đếm từ chính xác hơn
text = text
  .replace(/```[\s\S]*?```/g, '')   // Xóa code blocks
  .replace(/`[^`]+`/g, '')           // Xóa inline code
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Giữ link text
  .replace(/[#*_>|\-]/g, ' ')        // Xóa markdown syntax
  .toLowerCase();

// Đếm từ tổng
const totalWords = text.trim().split(/\s+/).filter(w => w.length > 1).length;

// Đếm keyword (không phân biệt hoa/thường)
const keywordLower = keyword.toLowerCase();
const keywordRegex = new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
const keywordCount = (text.match(keywordRegex) || []).length;

// Tính mật độ
const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;

// Kết quả
console.log('\n📊 Kết Quả Kiểm Tra Keyword Density');
console.log('─'.repeat(45));
console.log(`   File:     ${filePath}`);
console.log(`   Từ khóa: "${keyword}"`);
console.log(`   Tổng từ:  ${totalWords}`);
console.log(`   Xuất hiện: ${keywordCount} lần`);
console.log(`   Mật độ:   ${density.toFixed(2)}%`);
console.log(`   Target:   ${minDensity}% - ${maxDensity}%`);
console.log('─'.repeat(45));

if (density < minDensity) {
  console.log(`❌ THẤP: ${density.toFixed(2)}% < ${minDensity}% — Cần thêm từ khóa tự nhiên hơn.`);
  process.exit(1);
} else if (density > maxDensity) {
  console.log(`❌ CAO: ${density.toFixed(2)}% > ${maxDensity}% — Nguy cơ keyword stuffing, Google có thể phạt.`);
  process.exit(1);
} else {
  console.log(`✅ ĐẠT: ${density.toFixed(2)}% nằm trong vùng an toàn (${minDensity}%-${maxDensity}%).`);
  process.exit(0);
}
