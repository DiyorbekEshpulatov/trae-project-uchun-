const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8082;

// Chart.js CDN orqali ulanadi
const server = http.createServer((req, res) => {
  console.log('📨 Frontend Reports Request:', req.method, req.url);

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

  if (cleanUrl === '/' || cleanUrl === '/reports') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Advanced Reports - SmartAccounting AI</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
          .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
          .header { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header h1 { color: #333; margin-bottom: 10px; }
          .nav { display: flex; gap: 15px; margin-bottom: 20px; }
          .nav a { color: #667eea; text-decoration: none; font-weight: 500; }
          .nav a:hover { text-decoration: underline; }
          .card { background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .chart-container { position: relative; height: 400px; margin: 20px 0; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .stat-card { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; text-align: center; }
          .stat-number { font-size: 2em; font-weight: bold; margin: 10px 0; }
          .btn { background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px 5px; }
          .btn:hover { background: #5a67d8; }
          .btn-success { background: #48bb78; }
          .btn-success:hover { background: #38a169; }
          .report-filters { background: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .filter-group { display: flex; gap: 15px; align-items: center; margin-bottom: 15px; }
          select, input { padding: 10px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 14px; }
          .loading { display: none; text-align: center; padding: 20px; }
          .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .report-summary { background: #edf2f7; padding: 20px; border-radius: 10px; margin-top: 20px; }
          .summary-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Advanced Hisobotlar</h1>
            <p>Batafsol analitika va grafiklar</p>
          </div>
          <div class="nav">
            <a href="/">🏠 Bosh Sahifa</a>
            <a href="/dashboard">📈 Dashboard</a>
            <a href="/companies">🏢 Kompaniyalar</a>
            <a href="/products">📦 Mahsulotlar</a>
            <a href="http://localhost:8081">📤 Import/Export</a>
            <a href="http://localhost:8082">📊 Hisobotlar</a>
            <a href="http://localhost:8083/profile">👤 User Profile</a>
            <a href="http://localhost:8084/categories">📂 Categories</a>
            <a href="http://localhost:8085/notifications">📧 Email Notifications</a>
          </div>

          <div class="report-filters">
            <h3>🔍 Filtrlar</h3>
            <div class="filter-group">
              <label>Vaqt oralig'i:</label>
              <input type="date" id="startDate" value="2024-01-01">
              <span>dan</span>
              <input type="date" id="endDate" value="2024-12-31">
              <span>gacha</span>
            </div>
            <div class="filter-group">
              <label>Kompaniya:</label>
              <select id="companyFilter">
                <option value="">Barchasi</option>
              </select>
              <button class="btn" onclick="updateReports()">🔄 Yangilash</button>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <h3>💰 Umumiy Qiymat</h3>
              <div class="stat-number" id="totalValue">$0</div>
              <p>Jami mahsulot qiymati</p>
            </div>
            <div class="stat-card">
              <h3>📈 O'shish Foizi</h3>
              <div class="stat-number" id="growthRate">0%</div>
              <p>Oxirgi oydagi o'shish</p>
            </div>
            <div class="stat-card">
              <h3>⚠️ Past Zaxira</h3>
              <div class="stat-number" id="lowStockCount">0</div>
              <p>Minimal miqdordan kam</p>
            </div>
            <div class="stat-card">
              <h3>🏢 Faol Kompaniyalar</h3>
              <div class="stat-number" id="activeCompanies">0</div>
              <p>Faol kompaniyalar soni</p>
            </div>
          </div>

          <div class="card">
            <h2>📈 Mahsulotlar Dinamikasi</h2>
            <div class="chart-container">
              <canvas id="productsChart"></canvas>
            </div>
          </div>

          <div class="card">
            <h2>🥧 Kompaniyalar Bo'yicha Taqsimot</h2>
            <div class="chart-container">
              <canvas id="companiesChart"></canvas>
            </div>
          </div>

          <div class="card">
            <h2>📊 Oylik Statistika</h2>
            <div class="chart-container">
              <canvas id="monthlyChart"></canvas>
            </div>
          </div>

          <div class="report-summary" id="reportSummary">
            <h3>📋 Hisobot Xulosasi</h3>
            <div id="summaryContent">
              <p>Ma'lumotlar yuklanmoqda...</p>
            </div>
          </div>
        </div>

        <script>
          let productsChart, companiesChart, monthlyChart;

          // Sahifa yuklanganda
          document.addEventListener('DOMContentLoaded', function() {
            loadCompanies();
            updateReports();
          });

          async function loadCompanies() {
            try {
              const response = await fetch('http://localhost:3001/api/companies');
              const companies = await response.json();
              const companyFilter = document.getElementById('companyFilter');
              
              companies.forEach(company => {
                const option = document.createElement('option');
                option.value = company.id;
                option.textContent = company.name;
                companyFilter.appendChild(option);
              });
            } catch (error) {
              console.error('Kompaniyalarni yuklash xatosi:', error);
            }
          }

          async function updateReports() {
            try {
              // Mahsulotlar ma'lumotlarini olish
              const productsResponse = await fetch('http://localhost:3001/api/products');
              const products = await products.json();
              
              // Kompaniyalar ma'lumotlarini olish
              const companiesResponse = await fetch('http://localhost:3001/api/companies');
              const companies = await companies.json();
              
              updateStatistics(products, companies);
              updateProductsChart(products);
              updateCompaniesChart(products, companies);
              updateMonthlyChart(products);
              updateSummary(products, companies);
              
            } catch (error) {
              console.error('Hisobotlarni yangilash xatosi:', error);
            }
          }

          function updateStatistics(products, companies) {
            // Umumiy qiymat
            const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            document.getElementById('totalValue').textContent = '$' + totalValue.toLocaleString();
            
            // O'shish foizi (mock data)
            const growthRate = Math.floor(Math.random() * 30) + 5;
            document.getElementById('growthRate').textContent = '+' + growthRate + '%';
            
            // Past zaxira
            const lowStockCount = products.filter(p => p.quantity < p.minQuantity).length;
            document.getElementById('lowStockCount').textContent = lowStockCount;
            
            // Faol kompaniyalar
            const activeCompanies = companies.filter(c => c.status === 'active').length;
            document.getElementById('activeCompanies').textContent = activeCompanies;
          }

          function updateProductsChart(products) {
            const ctx = document.getElementById('productsChart').getContext('2d');
            
            // Mahsulotlar bo'yicha zaxira miqdori
            const productNames = products.map(p => p.name);
            const quantities = products.map(p => p.quantity);
            
            if (productsChart) {
              productsChart.destroy();
            }
            
            productsChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: productNames,
                datasets: [{
                  label: 'Zaxira Miqdori',
                  data: quantities,
                  backgroundColor: 'rgba(102, 126, 234, 0.8)',
                  borderColor: 'rgba(102, 126, 234, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'Mahsulotlar Zaxirasi'
                  }
                }
              }
            });
          }

          function updateCompaniesChart(products, companies) {
            const ctx = document.getElementById('companiesChart').getContext('2d');
            
            // Kompaniyalar bo'yicha mahsulotlar soni
            const companyProductCount = {};
            companies.forEach(company => {
              companyProductCount[company.name] = products.filter(p => p.companyId === company.id).length;
            });
            
            if (companiesChart) {
              companiesChart.destroy();
            }
            
            companiesChart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: Object.keys(companyProductCount),
                datasets: [{
                  data: Object.values(companyProductCount),
                  backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(72, 187, 120, 0.8)',
                    'rgba(56, 161, 105, 0.8)',
                    'rgba(245, 101, 101, 0.8)',
                    'rgba(229, 62, 62, 0.8)'
                  ]
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Kompaniyalar Bo\\'yicha Mahsulotlar'
                  }
                }
              }
            });
          }

          function updateMonthlyChart(products) {
            const ctx = document.getElementById('monthlyChart').getContext('2d');
            
            // Oylik statistika (mock data)
            const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
            const monthlyData = months.map(() => Math.floor(Math.random() * 100) + 20);
            
            if (monthlyChart) {
              monthlyChart.destroy();
            }
            
            monthlyChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: months,
                datasets: [{
                  label: 'Yangi Mahsulotlar',
                  data: monthlyData,
                  borderColor: 'rgba(102, 126, 234, 1)',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  tension: 0.4,
                  fill: true
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'Oylik Mahsulot Q\\'shimchalar'
                  }
                }
              }
            });
          }

          function updateSummary(products, companies) {
            const summaryContent = document.getElementById('summaryContent');
            
            const totalProducts = products.length;
            const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;
            const lowStockProducts = products.filter(p => p.quantity < p.minQuantity).length;
            const activeCompanies = companies.filter(c => c.status === 'active').length;
            
            summaryContent.innerHTML = '<div class="summary-item"><span>Umumiy mahsulotlar soni:</span><strong>' + totalProducts + ' ta</strong></div>' +
              '<div class="summary-item"><span>Umumiy qiymat:</span><strong>$' + totalValue.toLocaleString() + '</strong></div>' +
              '<div class="summary-item"><span>Ortacha narx:</span><strong>$' + avgPrice.toFixed(2) + '</strong></div>' +
              '<div class="summary-item"><span>Past zaxira:</span><strong style="color: ' + (lowStockProducts > 0 ? '#e53e3e' : '#48bb78') + '">' + lowStockProducts + ' ta</strong></div>' +
              '<div class="summary-item"><span>Faol kompaniyalar:</span><strong>' + activeCompanies + ' ta</strong></div>';
          }
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Sahifa topilmadi</h1>');
  }
});

server.listen(PORT, () => {
  console.log('🚀 Advanced Reports Server running at http://localhost:' + PORT);
});