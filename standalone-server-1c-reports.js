// 1C Reports and Analytics System
// Bu server 1C dagi barcha hisobotlar va analitika funksiyalarini taklif qiladi

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8082;

// Hisobot turlari (1C dagi Report Types)
const REPORT_TYPES = {
  FINANCIAL: 'financial',           // Moliyaviy hisobotlar
  SALES: 'sales',                   // Sotuv hisobotlari
  INVENTORY: 'inventory',             // Ombor hisobotlari
  CUSTOMER: 'customer',             // Mijoz hisobotlari
  SUPPLIER: 'supplier',             // Yetkazib beruvchi hisobotlari
  EMPLOYEE: 'employee',             // Xodim hisobotlari
  TAX: 'tax',                       // Soliq hisobotlari
  AUDIT: 'audit'                    // Audit hisobotlari
};

// Hisobot davri turlari
const PERIOD_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
};

// 1C dagi hisobotlar bazasi
let REPORTS = {
  financial: [
    {
      id: 'FR001',
      code: 'BALANCE_SHEET',
      name: 'Balans hisoboti',
      type: REPORT_TYPES.FINANCIAL,
      period: PERIOD_TYPES.MONTHLY,
      description: 'Korxonaning moliyaviy holatini ko\'rsatuvchi balans hisoboti',
      sqlQuery: 'SELECT * FROM accounts WHERE date <= ?',
      parameters: ['endDate'],
      columns: [
        { name: 'account_code', title: 'Hisob kodi', type: 'text' },
        { name: 'account_name', title: 'Hisob nomi', type: 'text' },
        { name: 'debit', title: 'Debit', type: 'number' },
        { name: 'credit', title: 'Kredit', type: 'number' },
        { name: 'balance', title: 'Saldo', type: 'number' }
      ],
      filters: ['startDate', 'endDate', 'accountType'],
      createdDate: '2024-01-01',
      status: 'active'
    },
    {
      id: 'FR002',
      code: 'INCOME_STATEMENT',
      name: 'Daromadlar hisoboti',
      type: REPORT_TYPES.FINANCIAL,
      period: PERIOD_TYPES.MONTHLY,
      description: 'Korxonaning daromad va xarajatlari haqidagi hisobot',
      sqlQuery: 'SELECT * FROM income_expense WHERE date BETWEEN ? AND ?',
      parameters: ['startDate', 'endDate'],
      columns: [
        { name: 'item_name', title: 'Xarajat nomi', type: 'text' },
        { name: 'amount', title: 'Miqdori', type: 'number' },
        { name: 'type', title: 'Turi', type: 'text' }
      ],
      filters: ['startDate', 'endDate', 'department'],
      createdDate: '2024-01-01',
      status: 'active'
    }
  ],
  sales: [
    {
      id: 'SR001',
      code: 'SALES_SUMMARY',
      name: 'Sotuvlar yig\'indisi',
      type: REPORT_TYPES.SALES,
      period: PERIOD_TYPES.DAILY,
      description: 'Kunlik sotuvlar yig\'indisi hisoboti',
      sqlQuery: 'SELECT * FROM sales WHERE sale_date BETWEEN ? AND ?',
      parameters: ['startDate', 'endDate'],
      columns: [
        { name: 'sale_date', title: 'Sana', type: 'date' },
        { name: 'customer_name', title: 'Mijoz', type: 'text' },
        { name: 'product_name', title: 'Mahsulot', type: 'text' },
        { name: 'quantity', title: 'Miqdori', type: 'number' },
        { name: 'unit_price', title: 'Narxi', type: 'number' },
        { name: 'total_amount', title: 'Jami', type: 'number' }
      ],
      filters: ['startDate', 'endDate', 'customer', 'product'],
      createdDate: '2024-01-01',
      status: 'active'
    }
  ]
};

// Hisobot natijalari (1C dagi Report Results)
let REPORT_RESULTS = {
  'FR001': [
    {
      account_code: '1010',
      account_name: 'Asosiy vositalar',
      debit: 500000,
      credit: 0,
      balance: 500000
    },
    {
      account_code: '1030',
      account_name: 'Tovar-material qoldiqlari',
      debit: 200000,
      credit: 0,
      balance: 200000
    },
    {
      account_code: '2010',
      account_name: 'Mijozlar qarzdorligi',
      debit: 150000,
      credit: 0,
      balance: 150000
    }
  ],
  'SR001': [
    {
      sale_date: '2024-01-15',
      customer_name: 'Ozbekiston Respublikasi Vazirlar Mahkamasi',
      product_name: 'Kompyuter Lenovo ThinkPad',
      quantity: 5,
      unit_price: 1500,
      total_amount: 7500
    },
    {
      sale_date: '2024-01-16',
      customer_name: 'Global Tech Solutions',
      product_name: 'Smartphone iPhone 15',
      quantity: 3,
      unit_price: 1200,
      total_amount: 3600
    }
  ]
};

// Hisobotlarni qidirish (1C dagi Report Search)
function searchReports(query, type = null, period = null) {
  let results = [];
  
  // Barcha hisobotlarni birlashtirish
  const allReports = [];
  for (let key in REPORTS) {
    allReports.push(...REPORTS[key]);
  }
  
  results = allReports.filter(report => {
    const matchesQuery = !query || 
      report.name.toLowerCase().includes(query.toLowerCase()) ||
      report.code.toLowerCase().includes(query.toLowerCase()) ||
      report.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesType = !type || report.type === type;
    const matchesPeriod = !period || report.period === period;
    
    return matchesQuery && matchesType && matchesPeriod;
  });
  
  return results;
}

// Hisobotni bajarish (1C dagi Execute Report)
function executeReport(reportId, parameters = {}) {
  const report = findReportById(reportId);
  if (!report) {
    return { error: 'Hisobot topilmadi' };
  }
  
  // Bu yerda real SQL so'rov bajariladi
  // Hozircha mock natijalar qaytaramiz
  const results = REPORT_RESULTS[reportId] || [];
  
  // Hisobot statistikasi
  const statistics = calculateReportStatistics(results, report.columns);
  
  return {
    report: report,
    data: results,
    statistics: statistics,
    executionTime: new Date().toISOString(),
    totalRecords: results.length
  };
}

// Hisobot statistikasini hisoblash
function calculateReportStatistics(data, columns) {
  const statistics = {};
  
  columns.forEach(column => {
    if (column.type === 'number') {
      const values = data.map(row => row[column.name]).filter(val => val !== null && val !== undefined);
      if (values.length > 0) {
        statistics[column.name] = {
          sum: values.reduce((sum, val) => sum + val, 0),
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    }
  });
  
  return statistics;
}

// Hisobotni topish
function findReportById(reportId) {
  for (let key in REPORTS) {
    const report = REPORTS[key].find(r => r.id === reportId);
    if (report) return report;
  }
  return null;
}

// Yangi hisobot yaratish
function createReport(reportData) {
  const newReport = {
    id: generateReportId(reportData.type),
    code: reportData.code || generateReportCode(reportData.type),
    ...reportData,
    createdDate: new Date().toISOString().split('T')[0],
    status: reportData.status || 'active'
  };
  
  // Hisobotni tegishli guruhga qo'shish
  if (REPORTS[reportData.type]) {
    REPORTS[reportData.type].push(newReport);
  } else {
    REPORTS[reportData.type] = [newReport];
  }
  
  return newReport;
}

// Hisobotni o'chirish
function deleteReport(reportId) {
  for (let key in REPORTS) {
    const initialLength = REPORTS[key].length;
    REPORTS[key] = REPORTS[key].filter(r => r.id !== reportId);
    if (REPORTS[key].length < initialLength) {
      return true;
    }
  }
  return false;
}

// ID va kod generatsiyasi
function generateReportId(type) {
  const prefix = type.substring(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return prefix + timestamp;
}

function generateReportCode(type) {
  const prefixes = {
    [REPORT_TYPES.FINANCIAL]: 'FR',
    [REPORT_TYPES.SALES]: 'SR',
    [REPORT_TYPES.INVENTORY]: 'IR',
    [REPORT_TYPES.CUSTOMER]: 'CR',
    [REPORT_TYPES.SUPPLIER]: 'SUPR',
    [REPORT_TYPES.EMPLOYEE]: 'ER',
    [REPORT_TYPES.TAX]: 'TR',
    [REPORT_TYPES.AUDIT]: 'AR'
  };
  
  const prefix = prefixes[type] || 'RPT';
  const count = getReportCount(type) + 1;
  return prefix + String(count).padStart(3, '0');
}

function getReportCount(type) {
  return REPORTS[type] ? REPORTS[type].length : 0;
}

// HTML generatsiya funksiyasi
function generateHTML() {
  return `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1C Hisobotlar & Analitika</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: white; border-radius: 15px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header h1 { color: #333; font-size: 2.5em; margin-bottom: 10px; }
        .header p { color: #666; font-size: 1.2em; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-card h3 { color: #333; margin-bottom: 10px; }
        .stat-card .number { font-size: 2em; font-weight: bold; color: #667eea; }
        .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .report-card { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .report-card:hover { transform: translateY(-5px); }
        .report-card h4 { color: #333; margin-bottom: 10px; }
        .report-card p { color: #666; margin-bottom: 15px; }
        .btn { background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.3s; }
        .btn:hover { background: #5a6fd8; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 0.9em; }
        .status.active { background: #d4edda; color: #155724; }
        .status.inactive { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 1C Hisobotlar & Analitika</h1>
            <p>Barcha hisobotlar va analitika oynasi</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>📋 Jami Hisobotlar</h3>
                <div class="number">${Object.keys(REPORTS).reduce((sum, key) => sum + REPORTS[key].length, 0)}</div>
            </div>
            <div class="stat-card">
                <h3>⚡ Faol Hisobotlar</h3>
                <div class="number">${Object.keys(REPORTS).reduce((sum, key) => sum + REPORTS[key].filter(r => r.status === 'active').length, 0)}</div>
            </div>
            <div class="stat-card">
                <h3>📊 Hisobot Turlari</h3>
                <div class="number">${Object.keys(REPORT_TYPES).length}</div>
            </div>
        </div>
        
        <div class="reports-grid">
            ${Object.keys(REPORTS).map(type => 
                REPORTS[type].map(report => `
                    <div class="report-card">
                        <h4>${report.name}</h4>
                        <p>${report.description}</p>
                        <p><strong>Kodi:</strong> ${report.code}</p>
                        <p><strong>Oxirgi yangilanish:</strong> ${report.lastUpdated}</p>
                        <span class="status ${report.status}">${report.status === 'active' ? 'Faol' : 'Nofaol'}</span>
                        <button class="btn" onclick="executeReport('${report.id}')">Ishga tushirish</button>
                    </div>
                `).join('')
            ).join('')}
        </div>
    </div>
    
    <script>
        function executeReport(reportId) {
            fetch(\`/api/reports/\${reportId}/execute\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                alert('Hisobot muvaffaqiyatli ishga tushirildi!');
            })
            .catch(error => {
                alert('Xatolik yuz berdi: ' + error.message);
            });
        }
    </script>
</body>
</html>`;
}

// Server sozlamalari
const server = http.createServer((req, res) => {
  console.log('📊 1C Reports & Analytics Request:', req.method, req.url);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Vite client va boshqa yo'nalishlar uchun
  if (req.url === '/@vite/client') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('// Vite client mock\nconsole.log("Vite client connected");');
    return;
  }

  // Query parametrlarini olib tashlash
  const cleanUrl = req.url.split('?')[0];

  // Asosiy sahifa
  if (cleanUrl === '/' || cleanUrl === '/reports') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateHTML());
    return;
  }

  // API endpointlar
  if (cleanUrl === '/api/reports/search') {
    const url = new URL(req.url, 'http://localhost:8089');
    const query = url.searchParams.get('query');
    const type = url.searchParams.get('type');
    const period = url.searchParams.get('period');
    
    const results = searchReports(query, type, period);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
    return;
  }

  if (cleanUrl === '/api/reports/stats') {
    let totalReports = 0;
    let activeReports = 0;
    
    for (let key in REPORTS) {
      totalReports += REPORTS[key].length;
      activeReports += REPORTS[key].filter(r => r.status === 'active').length;
    }
    
    const stats = {
      total: totalReports,
      active: activeReports,
      financial: REPORTS.financial ? REPORTS.financial.length : 0,
      sales: REPORTS.sales ? REPORTS.sales.length : 0,
      inventory: REPORTS.inventory ? REPORTS.inventory.length : 0,
      customer: REPORTS.customer ? REPORTS.customer.length : 0,
      tax: REPORTS.tax ? REPORTS.tax.length : 0
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  if (cleanUrl.startsWith('/api/reports/')) {
    const parts = cleanUrl.split('/');
    const reportId = parts[3];
    const action = parts[4];
    
    if (reportId && !action) {
      // Hisobot ma'lumotlari
      const report = findReportById(reportId);
      if (report) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(report));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Hisobot topilmadi' }));
      }
      return;
    }
    
    if (reportId && action === 'execute') {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const parameters = JSON.parse(body);
            const result = executeReport(reportId, parameters);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid parameters' }));
          }
        });
        return;
      }
    }
    
    if (reportId && action === 'delete') {
      const deleted = deleteReport(reportId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: deleted }));
      return;
    }
  }

  if (cleanUrl === '/api/reports') {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost:8089');
      const type = url.searchParams.get('type');
      
      let reports = [];
      if (type && REPORTS[type]) {
        reports = REPORTS[type];
      } else {
        // Barcha hisobotlarni qaytarish
        for (let key in REPORTS) {
          reports = [...reports, ...REPORTS[key]];
        }
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reports));
      return;
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const reportData = JSON.parse(body);
          const newReport = createReport(reportData);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newReport));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid report data' }));
        }
      });
      return;
    }
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Sahifa topilmadi</h1>');
});

server.listen(PORT, () => {
  console.log('📊 1C Reports & Analytics Server running at http://localhost:' + PORT);
  console.log('📋 Available endpoints:');
  console.log('   GET  /api/reports/search');
  console.log('   GET  /api/reports/stats');
  console.log('   GET  /api/reports/{id}');
  console.log('   POST /api/reports');
  console.log('   POST /api/reports/{id}/execute');
  console.log('   DELETE /api/reports/{id}');
});