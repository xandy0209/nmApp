import { execSync } from 'child_process';
try {
  const output = execSync('git log -p -1 components/GroupOrderManagement.tsx').toString();
  console.log(output);
} catch (e) {
  console.error(e);
}
