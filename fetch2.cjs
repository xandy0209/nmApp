const https = require('https');
const fs = require('fs');

const files = [
  'GroupOrderDetailView.tsx',
  'GroupOrderTaskDetailView.tsx'
];

files.forEach(file => {
  https.get(`https://raw.githubusercontent.com/xandy0209/26NM/main/components/${file}`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      fs.writeFileSync(`./${file}`, data);
      console.log(`Downloaded ${file}`);
    });
  });
});
