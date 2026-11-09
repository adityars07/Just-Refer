import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../client/dist');
const artifactDir = path.resolve('C:/Users/Aditya RS/.gemini/antigravity/brain/59f678bf-f1fc-46a2-9a34-ba6cee1e9ad4');

const cssFiles = fs.readdirSync(path.join(distDir, 'assets')).filter(f => f.endsWith('.css'));
const jsFiles = fs.readdirSync(path.join(distDir, 'assets')).filter(f => f.endsWith('.js'));

const cssContent = cssFiles.map(f => fs.readFileSync(path.join(distDir, 'assets', f), 'utf-8')).join('\n');
const jsContent = jsFiles.map(f => fs.readFileSync(path.join(distDir, 'assets', f), 'utf-8')).join('\n');

const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JustRefer — Desktop Test</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <style>
      ${cssContent}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>
      ${jsContent}
    </script>
  </body>
</html>`;

const tempHtmlPath = path.join(artifactDir, 'standalone_desktop_bundle.html');
fs.writeFileSync(tempHtmlPath, standaloneHtml, 'utf-8');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPath = path.join(artifactDir, 'landing_1440_actual.png');

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1440,4900',
  '--virtual-time-budget=2000',
  `--screenshot=${outputPath}`,
  `file:///${tempHtmlPath.replace(/\\/g, '/')}`,
];

const proc = spawn(chromePath, args, { stdio: 'inherit' });

proc.on('close', (code) => {
  console.log(`Chrome exited with code ${code}`);
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    console.log(`Desktop screenshot saved successfully! Size: ${stat.size} bytes`);
  } else {
    console.log('Desktop screenshot was not created.');
  }
});

