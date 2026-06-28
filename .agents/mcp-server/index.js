const readline = require('readline');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Redefine logs to stderr so they don't corrupt the JSON-RPC stdout stream
const logDebug = (msg) => {
  process.stderr.write(`[DEBUG] ${msg}\n`);
};

logDebug('Tactilabs Custom MCP Server starting...');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    handleRequest(request);
  } catch (err) {
    logDebug(`Error parsing request line: ${err.message}`);
  }
});

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}

function handleRequest(req) {
  const { jsonrpc, id, method, params } = req;
  
  if (jsonrpc !== '2.0') return;

  logDebug(`Handling method: ${method}`);

  switch (method) {
    case 'initialize':
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'tactilabs-mcp',
            version: '1.0.0'
          }
        }
      });
      break;

    case 'notifications/initialized':
      // No response needed for notifications
      break;

    case 'tools/list':
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
              name: 'run_backend_tests',
              description: 'Runs Jest tests in the backend folder and returns the structured output.',
              inputSchema: {
                type: 'object',
                properties: {}
              }
            },
            {
              name: 'check_prisma_status',
              description: 'Checks the Prisma migration status against the PostgreSQL database.',
              inputSchema: {
                type: 'object',
                properties: {}
              }
            },
            {
              name: 'audit_threejs_memory',
              description: 'Scans the frontend source files for Three.js components and audits potential memory leaks (missing dispose() calls on geometries/materials/textures).',
              inputSchema: {
                type: 'object',
                properties: {
                  targetPath: {
                    type: 'string',
                    description: 'Optional absolute path to scan. Defaults to the frontend/src directory.'
                  }
                }
              }
            }
          ]
        }
      });
      break;

    case 'tools/call':
      handleToolCall(id, params);
      break;

    default:
      sendResponse({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      });
  }
}

function handleToolCall(id, params) {
  const { name, arguments: args } = params;

  logDebug(`Calling tool: ${name}`);

  if (name === 'run_backend_tests') {
    const backendPath = path.resolve(__dirname, '../../backend');
    exec('npm run test', { cwd: backendPath }, (error, stdout, stderr) => {
      const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `Backend Test Results:\n${output}`
            }
          ]
        }
      });
    });
  } else if (name === 'check_prisma_status') {
    const backendPath = path.resolve(__dirname, '../../backend');
    exec('npx prisma migrate status', { cwd: backendPath }, (error, stdout, stderr) => {
      const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `Prisma Migration Status:\n${output}`
            }
          ]
        }
      });
    });
  } else if (name === 'audit_threejs_memory') {
    const target = args?.targetPath || path.resolve(__dirname, '../../frontend/src');
    try {
      const auditResults = auditPath(target);
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: auditResults
            }
          ]
        }
      });
    } catch (err) {
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `Error scanning directory: ${err.message}`
            }
          ]
        }
      });
    }
  } else {
    sendResponse({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32602,
        message: `Unknown tool: ${name}`
      }
    });
  }
}

function auditPath(targetPath) {
  let report = `Three.js Memory Leak Audit for: ${targetPath}\n`;
  report += `==============================================\n\n`;

  let checkedFilesCount = 0;
  let issueCount = 0;

  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== 'dist') {
          scanDir(fullPath);
        }
      } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
        checkedFilesCount++;
        const content = fs.readFileSync(fullPath, 'utf8');
        const fileIssues = auditFileContent(file, content);
        if (fileIssues.length > 0) {
          issueCount++;
          report += `File: ${path.relative(targetPath, fullPath)}\n`;
          fileIssues.forEach(issue => {
            report += `  - [WARN] ${issue}\n`;
          });
          report += '\n';
        }
      }
    }
  }

  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    scanDir(targetPath);
  } else if (stat.isFile()) {
    checkedFilesCount++;
    const content = fs.readFileSync(targetPath, 'utf8');
    const fileIssues = auditFileContent(path.basename(targetPath), content);
    if (fileIssues.length > 0) {
      issueCount++;
      report += `File: ${path.basename(targetPath)}\n`;
      fileIssues.forEach(issue => {
        report += `  - [WARN] ${issue}\n`;
      });
      report += '\n';
    }
  }

  report += `Audit Ringkas: Memeriksa ${checkedFilesCount} berkas. Menemukan ${issueCount} berkas dengan potensi kebocoran memori.`;
  return report;
}

function auditFileContent(filename, content) {
  const issues = [];
  const hasThree = content.includes('three') || content.includes('THREE') || content.includes('@react-three');
  
  if (!hasThree) return issues;

  // Cek penciptaan geometri/material tanpa dispose
  const createdGeometries = (content.match(/new\s+THREE\.\w*Geometry/g) || []).length;
  const createdMaterials = (content.match(/new\s+THREE\.\w*Material/g) || []).length;
  const hasDispose = content.includes('.dispose(');

  if ((createdGeometries > 0 || createdMaterials > 0) && !hasDispose) {
    issues.push(`Mendeklarasikan objek Three.js (${createdGeometries} geometri, ${createdMaterials} material) tetapi tidak menemukan panggilan method '.dispose()'.`);
  }

  // Cek WebSocket event listener tanpa cleanup
  const hasSocketOn = content.includes('.on(');
  const hasSocketOff = content.includes('.off(');
  if (hasSocketOn && !hasSocketOff && (content.includes('useEffect') || content.includes('useFrame'))) {
    issues.push(`Menemukan event listener (.on) tetapi tidak menemukan pembersihan listener (.off) di dalam hook useEffect/useFrame.`);
  }

  return issues;
}
