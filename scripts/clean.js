// Cross-platform clean script
const { existsSync, rmSync } = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
  console.log('Removed dist/');
}

const coverageDir = path.join(__dirname, '..', 'coverage');
if (existsSync(coverageDir)) {
  rmSync(coverageDir, { recursive: true, force: true });
  console.log('Removed coverage/');
}
