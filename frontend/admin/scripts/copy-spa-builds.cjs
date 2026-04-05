const fs = require('fs')
const path = require('path')
const adminRoot = path.join(__dirname, '..')

function copyApp(label, distDir, outDir) {
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    console.error(
      `[copy-spa-builds] Missing ${label} build (${distDir}). Run: npm run build --prefix ../${label === 'worker' ? 'worker' : 'manager'}`
    )
    process.exit(1)
  }
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(outDir), { recursive: true })
  fs.cpSync(distDir, outDir, { recursive: true })
  console.log(`[copy-spa-builds] ${label} → ${outDir}`)
}

const workerDist = path.join(adminRoot, '..', 'worker', 'dist')
const managerDist = path.join(adminRoot, '..', 'manager', 'dist')
copyApp('worker', workerDist, path.join(adminRoot, 'public', 'worker'))
copyApp('manager', managerDist, path.join(adminRoot, 'public', 'manager'))
