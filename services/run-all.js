import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'AuthService', file: './auth-service/index.js', color: '\x1b[32m' },    // Green
  { name: 'LeadService', file: './lead-service/index.js', color: '\x1b[34m' },    // Blue
  { name: 'WalletService', file: './wallet-service/index.js', color: '\x1b[33m' }, // Yellow
  { name: 'ProductService', file: './product-service/index.js', color: '\x1b[35m' }, // Magenta
  { name: 'APIGateway', file: './api-gateway/index.js', color: '\x1b[36m' }       // Cyan
];

const RESET = '\x1b[0m';

console.log(`${RESET}=============================================`);
console.log(`🚀 Starting JustRefer Microservices Fleet...`);
console.log(`=============================================${RESET}\n`);

services.forEach((svc) => {
  const child = spawn('node', [svc.file], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      console.log(`${svc.color}[${svc.name}]${RESET} ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    console.error(`${svc.color}[${svc.name} ERROR]${RESET} ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    console.log(`${svc.color}[${svc.name}]${RESET} process exited with code ${code}`);
  });
});
