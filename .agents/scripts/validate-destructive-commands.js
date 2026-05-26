/**
 * validate-destructive-commands.js
 * Hook bảo mật kiểm tra các câu lệnh hủy hoại trước khi thực thi tool.
 * Ngăn chặn: DROP TABLE, TRUNCATE, DELETE không có WHERE, rm -rf, rmdir, git reset --hard.
 */

// Đọc thông tin từ environment variables được IDE nạp tự động khi gọi hook
const toolName = process.env.TOOL_NAME || process.env.AGENTS_TOOL_NAME || '';
const toolArgsRaw = process.env.TOOL_ARGS || process.env.AGENTS_TOOL_ARGS || '';

// In log để gỡ lỗi khi chạy hook
console.log(`[Security Hook] Đang kiểm tra tool: ${toolName}`);

if (!toolName) {
  // Nếu không có tên tool được truyền qua env, kiểm tra argv dự phòng
  console.log('[Security Hook] Không tìm thấy TOOL_NAME trong env. Bỏ qua kiểm tra bảo mật.');
  process.exit(0);
}

let toolArgs = {};
if (toolArgsRaw) {
  try {
    toolArgs = JSON.parse(toolArgsRaw);
  } catch (err) {
    console.error(`[Security Hook] Lỗi parse JSON toolArgs: ${err.message}`);
  }
}

// 1. Kiểm tra các câu lệnh huỷ hoại hệ thống file & git (đối với run_command)
if (toolName === 'run_command' || toolName === 'command' || toolName === 'unsandboxed') {
  const commandLine = toolArgs.CommandLine || '';
  if (commandLine) {
    const cmdNormalized = commandLine.toLowerCase().trim();
    console.log(`[Security Hook] Đang validate command: "${commandLine}"`);

    // Danh sách từ khóa lệnh phá hoại cấm thực thi
    const forbiddenPatterns = [
      {
        pattern: /\brm\s+-rf\b/,
        reason: 'Sử dụng lệnh "rm -rf" có thể gây mất mát file nghiêm trọng.'
      },
      {
        pattern: /\brmdir\s+\/s\b/,
        reason: 'Sử dụng lệnh "rmdir /s" có thể gây xoá thư mục đệ quy trên Windows.'
      },
      {
        pattern: /\bdel\s+\/f\s+\/s\s+\/q\b/,
        reason: 'Sử dụng lệnh "del /f /s /q" có thể gây xoá file diện rộng.'
      },
      {
        pattern: /\bgit\s+reset\s+--hard\b/,
        reason: 'Sử dụng "git reset --hard" sẽ xoá toàn bộ thay đổi chưa committed.'
      },
      {
        pattern: /\bdrop\s+table\b/,
        reason: 'Sử dụng lệnh SQL "DROP TABLE" sẽ huỷ hoại cấu trúc dữ liệu bảng.'
      },
      {
        pattern: /\btruncate\b/,
        reason: 'Sử dụng lệnh SQL "TRUNCATE" sẽ xoá sạch dữ liệu của bảng.'
      }
    ];

    for (const rule of forbiddenPatterns) {
      if (rule.pattern.test(cmdNormalized)) {
        console.error(`\n❌ [SECURITY ERROR] PHÁT HIỆN LỆNH BỊ CẤM: "${commandLine}"`);
        console.error(`Lý do: ${rule.reason}`);
        console.error('Vui lòng thực hiện thủ công hoặc điều chỉnh lệnh để đảm bảo an toàn.\n');
        process.exit(1); // Chặn thực thi tool
      }
    }

    // Kiểm tra câu lệnh DELETE SQL không có WHERE
    if (cmdNormalized.includes('delete') && cmdNormalized.includes('from')) {
      if (!cmdNormalized.includes('where')) {
        console.error(`\n❌ [SECURITY ERROR] PHÁT HIỆN CÚ PHÁP DELETE KHÔNG CÓ WHERE: "${commandLine}"`);
        console.error('Lý do: DELETE không có mệnh đề WHERE sẽ xoá sạch toàn bộ dữ liệu trong bảng.');
        process.exit(1); // Chặn thực thi tool
      }
    }
  }
}

// 2. Kiểm tra các tool huỷ hoại trực tiếp database (execute_sql)
if (toolName === 'execute_sql' || toolName === 'call_mcp_tool') {
  // Lấy câu lệnh SQL từ args (nếu dùng execute_sql trực tiếp hoặc call_mcp_tool)
  let sqlQuery = toolArgs.query || toolArgs.Query || '';
  
  // Trường hợp dùng call_mcp_tool cho supabase server
  if (toolName === 'call_mcp_tool' && toolArgs.ToolName === 'execute_sql') {
    const mcpArgs = toolArgs.Arguments || {};
    sqlQuery = mcpArgs.query || mcpArgs.Query || '';
  }

  if (sqlQuery) {
    const sqlNormalized = sqlQuery.toLowerCase().trim();
    console.log(`[Security Hook] Đang validate SQL query: "${sqlQuery.replace(/\n/g, ' ')}"`);

    if (sqlNormalized.includes('drop') && sqlNormalized.includes('table')) {
      console.error(`\n❌ [SECURITY ERROR] Chặn execute_sql chứa DROP TABLE: "${sqlQuery}"`);
      process.exit(1);
    }
    
    if (sqlNormalized.includes('truncate')) {
      console.error(`\n❌ [SECURITY ERROR] Chặn execute_sql chứa TRUNCATE: "${sqlQuery}"`);
      process.exit(1);
    }

    if (sqlNormalized.includes('delete') && sqlNormalized.includes('from') && !sqlNormalized.includes('where')) {
      console.error(`\n❌ [SECURITY ERROR] Chặn execute_sql chứa DELETE không có WHERE: "${sqlQuery}"`);
      process.exit(1);
    }
  }
}

console.log('[Security Hook] Lệnh an toàn. Cho phép thực thi.');
process.exit(0);
