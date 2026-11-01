import { defineConfig, Plugin } from 'vite';
import path from 'path';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';

function autoStartBackendPlugin(): Plugin {
  let backendProc: ChildProcess | null = (globalThis as any).__JUSTREFER_BACKEND_PROC__ || null;

  return {
    name: 'auto-start-backend',
    configureServer() {
      if (backendProc && !backendProc.killed) {
        return;
      }

      // Check if backend on port 3000 is reachable
      const checkReq = http.get('http://127.0.0.1:3000/api/health', () => {
        // Backend is already running
      });

      checkReq.on('error', () => {
        if (backendProc && !backendProc.killed) return;

        console.log('\n\x1b[36m[JustRefer]\x1b[0m Backend server (port 3000) not detected.');
        console.log('\x1b[36m[JustRefer]\x1b[0m Automatically starting backend server in background...\n');

        const serverDir = path.resolve(__dirname, '../server');
        const isWin = process.platform === 'win32';
        const npmCmd = isWin ? 'npm.cmd' : 'npm';

        backendProc = spawn(npmCmd, ['run', 'dev'], {
          cwd: serverDir,
          stdio: 'inherit',
          shell: true,
        });

        (globalThis as any).__JUSTREFER_BACKEND_PROC__ = backendProc;

        backendProc.on('error', (err) => {
          console.error('\x1b[31m[JustRefer] Failed to auto-start backend:\x1b[0m', err.message);
        });
      });

      const cleanup = () => {
        if (backendProc && !backendProc.killed) {
          try {
            if (process.platform === 'win32' && backendProc.pid) {
              spawn('taskkill', ['/pid', backendProc.pid.toString(), '/f', '/t']);
            } else {
              backendProc.kill('SIGINT');
            }
          } catch {}
          backendProc = null;
          (globalThis as any).__JUSTREFER_BACKEND_PROC__ = null;
        }
      };

      process.on('exit', cleanup);
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
    },
  };
}

export default defineConfig({
  plugins: [autoStartBackendPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res: any) => {
            if (res && !res.headersSent) {
              try {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    error: {
                      code: 'server_booting',
                      message: 'Backend server is starting up. Retrying automatically...',
                    },
                  })
                );
              } catch {}
            }
          });
        },
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        dashboard: path.resolve(__dirname, 'dashboard.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
});
