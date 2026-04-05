const fs = require('fs');
const files = [
  'src/pages/Policy.jsx',
  'src/pages/Plans.jsx',
  'src/pages/Payouts.jsx',
  'src/pages/Forecast.jsx',
  'src/pages/Dashboard.jsx',
  'src/components/dashboard/IncomeProtectionDashboard.jsx'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/\$(\d)/g, '₹$1');
    fs.writeFileSync(f, c, 'utf8');
  }
});
