const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const adminRoot = path.join(__dirname, '..')
const workerHtml = path.join(adminRoot, 'public', 'worker', 'index.html')
const managerHtml = path.join(adminRoot, 'public', 'manager', 'index.html')

if (!fs.existsSync(workerHtml) || !fs.existsSync(managerHtml)) {
  console.log('[ensure-spa] Building worker + manager and copying to public/…')
  execSync('npm run build:spas', { stdio: 'inherit', cwd: adminRoot })
}
