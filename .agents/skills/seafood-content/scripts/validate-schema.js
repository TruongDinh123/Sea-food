#!/usr/bin/env node
/**
 * validate-schema.js
 * Validate JSON-LD schema markup trong file HTML hoặc TypeScript.
 * 
 * Sử dụng:
 *   node validate-schema.js --help
 *   node validate-schema.js --file=path/to/page.tsx
 *   node validate-schema.js --file=path/to/page.tsx --type=Product
 *   node validate-schema.js --file=path/to/page.tsx --type=Article
 */

const fs = require('fs');
const path = require('path');

// Parse CLI args
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
JSON-LD Schema Validator — Hải Sản Cà Mau SEO Tool

USAGE:
  node validate-schema.js --file=<path> [options]

OPTIONS:
  --file=<path>    Đường dẫn file cần kiểm tra (.tsx, .html, .json)
  --type=<type>    Loại schema cần kiểm tra: Product | Article (mặc định: auto-detect)
  --help, -h       Hiển thị hướng dẫn này

VÍ DỤ:
  node validate-schema.js --file=src/app/san-pham/tom-su/page.tsx
  node validate-schema.js --file=src/app/blog/bai-viet/page.tsx --type=Article

REQUIRED FIELDS:
  Product: @context, @type, name, description, image, offers.price, offers.priceCurrency
  Article: @context, @type, headline, datePublished, author, publisher
  `);
  process.exit(0);
}

function parseArg(args, key, defaultValue) {
  const arg = args.find(a => a.startsWith(`--${key}=`));
  return arg ? arg.split('=').slice(1).join('=') : defaultValue;
}

const filePath = parseArg(args, 'file', null);
const forcedType = parseArg(args, 'type', null);

if (!filePath) {
  console.error('❌ ERROR: Cần cung cấp --file');
  console.error('   Chạy --help để xem hướng dẫn.');
  process.exit(1);
}

const absPath = path.resolve(filePath);
if (!fs.existsSync(absPath)) {
  console.error(`❌ ERROR: File không tồn tại: ${absPath}`);
  process.exit(1);
}

const content = fs.readFileSync(absPath, 'utf8');

// Tìm JSON-LD trong file
const jsonLdMatches = content.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g);
const jsObjectMatches = content.match(/"@context"\s*:\s*"https:\/\/schema\.org"[\s\S]{0,2000}/g);

let schemaText = null;

if (jsonLdMatches && jsonLdMatches.length > 0) {
  const inner = jsonLdMatches[0].replace(/<[^>]+>/g, '');
  schemaText = inner.trim();
} else if (jsObjectMatches && jsObjectMatches.length > 0) {
  // Tìm JSON object trong TypeScript (const schema = {...})
  schemaText = '{' + jsObjectMatches[0];
}

if (!schemaText) {
  console.log('\n⚠️  CẢNH BÁO: Không tìm thấy JSON-LD schema trong file.');
  console.log('   Hãy thêm schema markup theo hướng dẫn trong assets/schema-templates.md');
  process.exit(1);
}

// Parse JSON
let schema;
try {
  // Làm sạch TypeScript syntax trước khi parse
  const cleaned = schemaText
    .replace(/\/\/.*/g, '')           // Xóa comments
    .replace(/,\s*}/g, '}')          // Trailing commas
    .replace(/,\s*]/g, ']');
  schema = JSON.parse(cleaned);
} catch (e) {
  console.log('\n⚠️  CẢNH BÁO: Không thể parse JSON-LD schema hoàn toàn từ file TypeScript.');
  console.log('   Script chỉ validate được file .json thuần hoặc HTML với <script type="application/ld+json">');
  console.log('   Dùng Google Rich Results Test để validate: https://search.google.com/test/rich-results');
  process.exit(0);
}

// Xác định type
const schemaType = forcedType || schema['@type'];

// Validation rules theo type
const rules = {
  Product: {
    required: ['@context', '@type', 'name', 'description', 'image', 'offers'],
    offers_required: ['price', 'priceCurrency'],
    checks: [
      { field: 'offers.priceCurrency', value: 'VND', message: 'priceCurrency phải là "VND"' },
    ]
  },
  Article: {
    required: ['@context', '@type', 'headline', 'datePublished', 'author', 'publisher'],
    checks: [
      { field: 'headline', maxLength: 110, message: 'headline nên < 110 ký tự' },
    ]
  }
};

const rule = rules[schemaType];
if (!rule) {
  console.log(`\n⚠️  Không có validation rule cho type: "${schemaType}"`);
  console.log('   Hỗ trợ: Product, Article');
  process.exit(0);
}

// Kiểm tra fields
const errors = [];
const warnings = [];

console.log(`\n📋 Kiểm Tra JSON-LD Schema: ${schemaType}`);
console.log('─'.repeat(50));

// Check required fields
for (const field of rule.required) {
  if (!schema[field]) {
    errors.push(`❌ Thiếu field bắt buộc: "${field}"`);
  } else {
    console.log(`   ✅ ${field}: có`);
  }
}

// Check nested offers
if (schemaType === 'Product' && schema.offers && rule.offers_required) {
  for (const field of rule.offers_required) {
    if (!schema.offers[field]) {
      errors.push(`❌ Thiếu offers.${field}`);
    } else {
      console.log(`   ✅ offers.${field}: ${schema.offers[field]}`);
    }
  }
}

// Custom checks
if (rule.checks) {
  for (const check of rule.checks) {
    const parts = check.field.split('.');
    const val = parts.reduce((obj, k) => obj && obj[k], schema);
    if (check.value && val !== check.value) {
      errors.push(`❌ ${check.message} (hiện tại: "${val}")`);
    }
    if (check.maxLength && val && val.length > check.maxLength) {
      warnings.push(`⚠️  ${check.message} (hiện tại: ${val.length} ký tự)`);
    }
  }
}

// Kiểm tra image là URL tuyệt đối
if (schema.image) {
  const images = Array.isArray(schema.image) ? schema.image : [schema.image];
  for (const img of images) {
    if (typeof img === 'string' && !img.startsWith('https://')) {
      errors.push(`❌ image phải là URL tuyệt đối bắt đầu bằng "https://" (hiện tại: "${img}")`);
    }
  }
}

console.log('─'.repeat(50));

if (warnings.length > 0) {
  console.log('\n⚠️  Cảnh báo:');
  warnings.forEach(w => console.log('   ' + w));
}

if (errors.length > 0) {
  console.log('\n❌ LỖI:');
  errors.forEach(e => console.log('   ' + e));
  console.log('\nFAIL: Schema cần được sửa trước khi publish.');
  process.exit(1);
} else {
  console.log('\n✅ PASS: JSON-LD schema hợp lệ.');
  console.log('   Tip: Verify thêm tại https://search.google.com/test/rich-results');
  process.exit(0);
}
