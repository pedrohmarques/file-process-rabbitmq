const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || process.env.NG_APP_API_URL || 'http://localhost:3000';

const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log(`Generated environment.prod.ts with apiUrl: ${apiUrl}`);
