const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;

const server = http.createServer((req, res) => {
  console.log('📨 Frontend Import/Export Request:', req.method, req.url);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' || req.url === '/import-export') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Import/Export - SmartAccounting AI</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .header { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header h1 { color: #333; margin-bottom: 10px; }
          .nav { display: flex; gap: 15px; margin-bottom: 20px; }
          .nav a { color: #667eea; text-decoration: none; font-weight: 500; }
          .nav a:hover { text-decoration: underline; }
          .card { background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .btn { background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px 5px; }
          .btn:hover { background: #5a67d8; }
          .btn-success { background: #48bb78; }
          .btn-success:hover { background: #38a169; }
          .file-input { margin: 20px 0; }
          .status { margin: 20px 0; padding: 15px; border-radius: 5px; }
          .status.success { background: #c6f6d5; color: #22543d; }
          .status.error { background: #fed7d7; color: #742a2a; }
          .status.info { background: #bee3f8; color: #2a4365; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background: #f7fafc; font-weight: 600; }
          .loading { display: none; text-align: center; padding: 20px; }
          .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Import/Export</h1>
            <div class="nav">
              <a href="/">🏠 Bosh Sahifa</a>
              <a href="/dashboard">📈 Dashboard</a>
              <a href="/companies">🏢 Kompaniyalar</a>
              <a href="/products">📦 Mahsulotlar</a>
              <a href="/import-export">📊 Import/Export</a>
              <a href="http://localhost:8083/profile">👤 User Profile</a>
              <a href="http://localhost:8084/categories">📂 Categories</a>
              <a href="http://localhost:8085/notifications">📧 Email Notifications</a>
            </div>
          </div>

          <div class="card">
            <h2>📤 Export Ma'lumotlar</h2>
            <p>Mahsulot va kompaniya ma'lumotlarini CSV/Excel formatida yuklab oling:</p>
            <button class="btn btn-success" onclick="exportProducts()">📦 Mahsulotlar Export</button>
            <button class="btn btn-success" onclick="exportCompanies()">🏢 Kompaniyalar Export</button>
          </div>

          <div class="card">
            <h2>📥 Import Mahsulotlar</h2>
            <p>Mahsulot ma'lumotlarini CSV/Excel formatida yuklang:</p>
            <div class="file-input">
              <input type="file" id="fileInput" accept=".csv,.xlsx,.xls" class="btn">
            </div>
            <button class="btn" onclick="importProducts()">📥 Import Qilish</button>
            <div id="importStatus"></div>
          </div>

          <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Ma'lumotlar yuklanmoqda...</p>
          </div>

          <div id="results"></div>
        </div>

        <script>
          function showLoading() {
            document.getElementById('loading').style.display = 'block';
          }

          function hideLoading() {
            document.getElementById('loading').style.display = 'none';
          }

          function showStatus(message, type = 'info') {
            const statusDiv = document.createElement('div');
            statusDiv.className = 'status ' + type;
            statusDiv.textContent = message;
            document.getElementById('results').innerHTML = '';
            document.getElementById('results').appendChild(statusDiv);
          }

          async function exportProducts() {
            showLoading();
            try {
              const response = await fetch('http://localhost:3001/api/export/products');
              const data = await response.json();
              
              // CSV formatida saqlash
              const csv = convertToCSV(data);
              downloadFile(csv, 'mahsulotlar.csv', 'text/csv');
              showStatus('✅ Mahsulotlar muvaffaqiyatli export qilindi!', 'success');
            } catch (error) {
              showStatus('❌ Export xatosi: ' + error.message, 'error');
            }
            hideLoading();
          }

          async function exportCompanies() {
            showLoading();
            try {
              const response = await fetch('http://localhost:3001/api/export/companies');
              const data = await response.json();
              
              // CSV formatida saqlash
              const csv = convertToCSV(data);
              downloadFile(csv, 'kompaniyalar.csv', 'text/csv');
              showStatus('✅ Kompaniyalar muvaffaqiyatli export qilindi!', 'success');
            } catch (error) {
              showStatus('❌ Export xatosi: ' + error.message, 'error');
            }
            hideLoading();
          }

          function convertToCSV(data) {
            if (!Array.isArray(data) || data.length === 0) return '';
            
            const headers = Object.keys(data[0]);
            const csvHeaders = headers.join(',');
            const csvRows = data.map(row => 
              headers.map(header => {
                const value = row[header] || '';
                return typeof value === 'string' && value.includes(',') ? '"' + value + '"' : value;
              }).join(',')
            );
            
            return csvHeaders + '\n' + csvRows.join('\n');
          }

          function downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }

          async function importProducts() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            
            if (!file) {
              showStatus('❌ Iltimos, fayl tanlang!', 'error');
              return;
            }

            showLoading();
            
            try {
              const text = await file.text();
              const data = parseCSV(text);
              
              const response = await fetch('http://localhost:3001/api/import/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              
              const result = await response.json();
              
              if (response.ok) {
                showStatus('✅ ' + result.count + ' ta mahsulot muvaffaqiyatli import qilindi!', 'success');
              } else {
                showStatus('❌ Import xatosi: ' + result.message, 'error');
              }
            } catch (error) {
              showStatus('❌ Import xatosi: ' + error.message, 'error');
            }
            
            hideLoading();
          }

          function parseCSV(text) {
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length < 2) return [];
            
            const headers = lines[0].split(',').map(h => h.trim());
            const data = [];
            
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim());
              const row = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              data.push(row);
            }
            
            return data;
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
  console.log('🚀 Import/Export Server running at http://localhost:' + PORT);
});