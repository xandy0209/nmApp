const https = require('https');
const fs = require('fs');

https.get('https://raw.githubusercontent.com/xandy0209/26NM/main/components/GroupOrderView.tsx', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('GroupOrderView.tsx', data);
    console.log('Downloaded GroupOrderView.tsx');
  });
});
https.get('https://raw.githubusercontent.com/xandy0209/26NM/main/components/GroupOrderDetailView.tsx', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('GroupOrderDetailView.tsx', data);
    console.log('Downloaded GroupOrderDetailView.tsx');
  });
});
https.get('https://raw.githubusercontent.com/xandy0209/26NM/main/components/GroupOrderTaskDetailView.tsx', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('GroupOrderTaskDetailView.tsx', data);
    console.log('Downloaded GroupOrderTaskDetailView.tsx');
  });
});
