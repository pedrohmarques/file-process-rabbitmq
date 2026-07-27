const fs = require('fs');
const path = require('path');

const isNetlify = process.env.NETLIFY === 'true';

if (isNetlify && !process.env.API_URL) {
  console.error('❌ API_URL é obrigatória no Netlify.');
  console.error('   Configure em: Site settings → Environment variables → API_URL');
  process.exit(1);
}

const apiUrl = (process.env.API_URL || process.env.NG_APP_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const frontendRoot = path.join(__dirname, '..');
const publicDir = path.join(frontendRoot, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const environmentProdPath = path.join(frontendRoot, 'src/environments/environment.prod.ts');
const configJsonPath = path.join(publicDir, 'config.json');

const environmentContent = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(environmentProdPath, environmentContent, 'utf8');
fs.writeFileSync(configJsonPath, JSON.stringify({ apiUrl }, null, 2), 'utf8');

console.log(`✅ apiUrl configurada: ${apiUrl}`);
console.log(`   → ${environmentProdPath}`);
console.log(`   → ${configJsonPath}`);
