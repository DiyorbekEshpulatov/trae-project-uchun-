// Standalone Next.js development server
// Bu fayl Next.js ni dependenciesiz ishga tushirish uchun

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Oddiy HTML sahifalar
const pages = {
  '/': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Accounting - Home</title>
</head>
<body>
    <h1>Smart Accounting Platform</h1>
    <p>Server ishga tushdi!</p>
    <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/companies">Companies</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="http://localhost:8081">📤 Import/Export</a></li>
        <li><a href="http://localhost:8082">📊 Advanced Reports</a></li>
        <li><a href="http://localhost:8083/profile">👤 User Profile</a></li>
        <li><a href="http://localhost:8084/categories">📂 Categories</a></li>
        <li><a href="http://localhost:8085/notifications">📧 Email Notifications</a></li>
    </ul>
</body>
</html>`,

  '/dashboard': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Smart Accounting</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .nav { display: flex; gap: 20px; margin-bottom: 20px; }
        .nav a { color: #2563eb; text-decoration: none; padding: 10px 20px; background: white; border-radius: 4px; }
        .nav a:hover { background: #f0f0f0; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #2563eb; }
        .chart { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Dashboard</h1>
            <p>Boshqaruv paneli</p>
        </div>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/login">Login</a>
            <a href="/companies">Companies</a>
            <a href="/products">Products</a>
            <a href="http://localhost:8081">Import/Export</a>
        </div>
        <div class="stats">
            <div class="stat-card">
                <h3>Jami Mahsulotlar</h3>
                <div class="stat-number" id="totalProducts">0</div>
            </div>
            <div class="stat-card">
                <h3>Umumiy Qiymat</h3>
                <div class="stat-number" id="totalValue">$0</div>
            </div>
            <div class="stat-card">
                <h3>Past Zaxira</h3>
                <div class="stat-number" id="lowStockProducts">0</div>
            </div>
            <div class="stat-card">
                <h3>Faol Kompaniyalar</h3>
                <div class="stat-number" id="activeCompanies">0</div>
            </div>
        </div>
        <script>
        const API_BASE = 'http://localhost:3001/api';
        
        async function loadDashboardStats() {
            try {
                const response = await fetch(API_BASE + '/stats');
                const data = await response.json();
                document.getElementById('totalProducts').textContent = data.totalProducts;
                document.getElementById('totalValue').textContent = '$' + data.totalValue.toLocaleString();
                document.getElementById('lowStockProducts').textContent = data.lowStockProducts;
                document.getElementById('activeCompanies').textContent = data.activeCompanies;
            } catch (error) {
                console.error('Dashboard stats error:', error);
            }
        }
        
        document.addEventListener('DOMContentLoaded', loadDashboardStats);
        </script>
        </div>
        <div class="chart">
            <h3>Oylik Statistika</h3>
            <p>Grafik bu yerda ko'rsatiladi</p>
        </div>
    </div>
</body>
</html>`,

  '/login': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Smart Accounting</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .login-container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #2563eb; margin: 0; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
        .form-group input:focus { outline: none; border-color: #2563eb; }
        .btn { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        .btn:hover { background: #1d4ed8; }
        .error { color: #ef4444; margin-top: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>Smart Accounting</h1>
        </div>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="admin@example.com" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" value="password123" required>
            </div>
            <button type="submit" class="btn">Login</button>
            <div id="error" class="error"></div>
        </form>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error');

            try {
                const response = await fetch('http://localhost:3001/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = '/dashboard';
                } else {
                    errorDiv.textContent = 'Invalid credentials';
                }
            } catch (error) {
                errorDiv.textContent = 'An error occurred. Please try again.';
            }
        });
    </script>
</body>
</html>`,

  '/companies': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Companies - Smart Accounting</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .nav { display: flex; gap: 20px; margin-bottom: 20px; }
        .nav a { color: #2563eb; text-decoration: none; padding: 10px 20px; background: white; border-radius: 4px; }
        .nav a:hover { background: #f0f0f0; }
        .table { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: bold; }
        .btn { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Companies</h1>
            <p>Kompaniyalar boshqaruvi</p>
        </div>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/login">Login</a>
            <a href="/products">Products</a>
        </div>
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <th>Nomi</th>
                        <th>INN</th>
                        <th>Manzil</th>
                        <th>Telefon</th>
                        <th>Holati</th>
                        <th>Amallar</th>
                    </tr>
                </thead>
                <tbody id="companiesTableBody">
                    <!-- Companies will be loaded here -->
                </tbody>
            </table>
        </div>
    </div>
    <script>
    const API_BASE = 'http://localhost:3001/api';
    
    async function loadCompanies() {
        try {
            const response = await fetch(API_BASE + '/companies');
            const companies = await response.json();
            const tbody = document.getElementById('companiesTableBody');
            tbody.innerHTML = '';
            
            companies.forEach(company => {
                const row = document.createElement('tr');
                row.innerHTML = \`
                    <td>\${company.name}</td>
                    <td>\${company.inn}</td>
                    <td>\${company.address}</td>
                    <td>\${company.phone}</td>
                    <td><span style="color: \${company.status === 'active' ? 'green' : 'red'};">\${company.status === 'active' ? 'Faol' : 'Nofaol'}</span></td>
                    <td><button class="btn" onclick="editCompany('\${company.id}')">Tahrirlash</button></td>
                \`;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Companies load error:', error);
        }
    }
    
    function editCompany(id) {
        alert('Edit company: ' + id);
    }
    
    document.addEventListener('DOMContentLoaded', loadCompanies);
    </script>
</body>
</html>`,

  '/products': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - Smart Accounting</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .nav { display: flex; gap: 20px; margin-bottom: 20px; }
        .nav a { color: #2563eb; text-decoration: none; padding: 10px 20px; background: white; border-radius: 4px; }
        .nav a:hover { background: #f0f0f0; }
        .table { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: bold; }
        .btn { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #1d4ed8; }
        .low-stock { color: #ef4444; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Products</h1>
            <p>Mahsulotlar boshqaruvi</p>
        </div>
        <div class="nav">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/login">Login</a>
            <a href="/companies">Companies</a>
        </div>
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <th>Nomi</th>
                        <th>Kodi</th>
                        <th>Narxi</th>
                        <th>Miqdori</th>
                        <th>Minimal Zaxira</th>
                        <th>Holati</th>
                        <th>Amallar</th>
                    </tr>
                </thead>
                <tbody id="productsTableBody">
                    <!-- Products will be loaded here -->
                </tbody>
            </table>
        </div>
    </div>
    <script>
    const API_BASE = 'http://localhost:3001/api';
    
    async function loadProducts() {
        try {
            const response = await fetch(API_BASE + '/products');
            const products = await response.json();
            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = '';
            
            products.forEach(product => {
                const row = document.createElement('tr');
                const stockStatus = product.quantity <= product.minQuantity ? 'Past zaxira' : 'Omborda';
                const stockColor = product.quantity <= product.minQuantity ? '#ef4444' : 'green';
                
                row.innerHTML = \`
                    <td>\${product.name}</td>
                    <td>\${product.code}</td>
                    <td>$\${product.price}</td>
                    <td>\${product.quantity}</td>
                    <td>\${product.minQuantity}</td>
                    <td><span style="color: \${stockColor};">\${stockStatus}</span></td>
                    <td><button class="btn" onclick="editProduct('\${product.id}')">Tahrirlash</button></td>
                \`;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Products load error:', error);
        }
    }
    
    function editProduct(id) {
        alert('Edit product: ' + id);
    }
    
    document.addEventListener('DOMContentLoaded', loadProducts);
    </script>
</body>
</html>`,
};

const server = http.createServer((req, res) => {
  console.log('📨 Request:', req.method, req.url);
  
  // Vite client va boshqa yo'nalishlar uchun
  if (req.url === '/@vite/client') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('// Vite client mock\nconsole.log("Vite client connected");');
    return;
  }

  // Query parametrlarini olib tashlash
  const cleanUrl = req.url.split('?')[0];
  const url = cleanUrl === '/' ? '/' : cleanUrl;
  
  if (pages[url]) {
    console.log('✅ Serving page:', url);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(pages[url]);
  } else if (url.startsWith('/api/')) {
    // Mock API responses
    if (url === '/api/auth/login' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ access_token: 'mock-jwt-token', user: { id: '1', email: 'admin@example.com' } }));
    } else if (url === '/api/stats') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        totalProducts: 156,
        totalValue: 45230,
        lowStockProducts: 12,
        activeCompanies: 8
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } else {
    console.log('❌ 404 Not Found:', url);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log('🚀 Server running at http://localhost:' + PORT);
  console.log('📱 Available pages:');
  Object.keys(pages).forEach(page => {
    console.log('   http://localhost:' + PORT + (page === '/' ? '' : page));
  });
});