import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();
const PORT = process.env.GATEWAY_PORT || 4000;

app.use(cors());
app.use(express.json());

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  leads: process.env.LEAD_SERVICE_URL || 'http://localhost:4002',
  wallet: process.env.WALLET_SERVICE_URL || 'http://localhost:4003',
  products: process.env.PRODUCT_SERVICE_URL || 'http://localhost:4004',
};

// Generic Proxy Forwarder using native Node http
function forwardRequest(targetUrl, req, res) {
  const url = new URL(targetUrl);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + (url.search || ''),
    method: req.method,
    headers: {
      ...req.headers,
      host: `${url.hostname}:${url.port}`
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`[Gateway] Error proxying to ${targetUrl}:`, err.message);
    res.status(502).json({
      error: `Bad Gateway: Target microservice unreachable (${targetUrl})`,
      details: err.message
    });
  });

  if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }

  proxyReq.end();
}

// Gateway Health & Services Overview
app.get('/api/status', (req, res) => {
  res.json({
    gateway: 'JustRefer API Gateway',
    status: 'ONLINE',
    version: '1.0.0',
    services: {
      authService: SERVICES.auth,
      leadService: SERVICES.leads,
      walletService: SERVICES.wallet,
      productService: SERVICES.products,
    },
    architecture: 'Microservices (Zero KYC)',
    timestamp: new Date().toISOString()
  });
});

// Route /api/auth/* -> Auth Service (:4001)
app.use('/api/auth', (req, res) => {
  const target = `${SERVICES.auth}${req.url}`;
  forwardRequest(target, req, res);
});

// Route /api/leads/* -> Lead Service (:4002)
app.use('/api/leads', (req, res) => {
  const target = `${SERVICES.leads}${req.url}`;
  forwardRequest(target, req, res);
});

// Route /api/wallet/* -> Wallet Service (:4003)
app.use('/api/wallet', (req, res) => {
  const target = `${SERVICES.wallet}${req.url}`;
  forwardRequest(target, req, res);
});

// Route /api/products/* -> Product Service (:4004)
app.use('/api/products', (req, res) => {
  const target = `${SERVICES.products}${req.url}`;
  forwardRequest(target, req, res);
});

app.listen(PORT, () => {
  console.log(`[APIGateway] 🌐 Unified Microservices Gateway running on port ${PORT}`);
  console.log(`[APIGateway] Forwarding: /api/auth -> 4001, /api/leads -> 4002, /api/wallet -> 4003, /api/products -> 4004`);
});
