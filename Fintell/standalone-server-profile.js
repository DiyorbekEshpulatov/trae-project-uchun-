// Standalone Profile Management Server
// User profile boshqarish uchun alohida server

const http = require('http');
const url = require('url');

const PORT = 8083;

// Mock user data
let currentUser = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  phone: '+998901234567',
  company: 'Smart Accounting',
  avatar: null,
  createdAt: '2024-01-01'
};

// Helper functions
function getRequestData(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

function sendResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// API server
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  console.log('📨 Profile Server Request:', req.method, req.url);

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

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // HTML sahifa
  if (path === '/profile' && req.method === 'GET') {
    const html = `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile - Smart Accounting</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .profile-card { background: white; border-radius: 15px; padding: 30px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .profile-header { display: flex; align-items: center; margin-bottom: 30px; }
        .avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; margin-right: 20px; }
        .profile-info h2 { color: #333; margin-bottom: 5px; }
        .profile-info p { color: #666; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: 600; }
        .form-group input { width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; transition: border-color 0.3s; }
        .form-group input:focus { outline: none; border-color: #667eea; }
        .btn { padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; transition: all 0.3s; margin-right: 10px; }
        .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .password-section { background: #f8f9fa; border-radius: 10px; padding: 20px; margin-top: 20px; }
        .alert { padding: 15px; border-radius: 8px; margin-bottom: 20px; display: none; }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .nav-links { display: flex; gap: 15px; margin-bottom: 20px; }
        .nav-links a { color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 20px; transition: background 0.3s; }
        .nav-links a:hover { background: rgba(255,255,255,0.3); }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a href="http://localhost:3000">Bosh sahifa</a>
            <a href="http://localhost:8081">Import/Export</a>
            <a href="http://localhost:8082">Hisobotlar</a>
            <a href="http://localhost:8083/profile">Profil</a>
            <a href="http://localhost:8084/categories">Categories</a>
            <a href="http://localhost:8085/notifications">Email Notifications</a>
        </div>
        
        <div class="header">
            <h1>👤 User Profile Management</h1>
            <p>Foydalanuvchi profilingizni boshqarish</p>
        </div>

        <div class="alert alert-success" id="successAlert"></div>
        <div class="alert alert-error" id="errorAlert"></div>

        <div class="profile-card">
            <div class="profile-header">
                <div class="avatar" id="avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                <div class="profile-info">
                    <h2 id="displayName">${currentUser.name}</h2>
                    <p id="displayEmail">${currentUser.email}</p>
                    <p id="displayRole">${currentUser.role.toUpperCase()}</p>
                </div>
            </div>

            <form id="profileForm">
                <div class="form-group">
                    <label for="name">To'liq ism:</label>
                    <input type="text" id="name" name="name" value="${currentUser.name}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${currentUser.email}" required>
                </div>
                <div class="form-group">
                    <label for="phone">Telefon raqam:</label>
                    <input type="tel" id="phone" name="phone" value="${currentUser.phone || ''}">
                </div>
                <div class="form-group">
                    <label for="company">Kompaniya:</label>
                    <input type="text" id="company" name="company" value="${currentUser.company || ''}">
                </div>
                <button type="submit" class="btn btn-primary">💾 Profilni yangilash</button>
            </form>
        </div>

        <div class="profile-card password-section">
            <h3>🔒 Parolni o'zgartirish</h3>
            <form id="passwordForm">
                <div class="form-group">
                    <label for="currentPassword">Joriy parol:</label>
                    <input type="password" id="currentPassword" name="currentPassword" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">Yangi parol:</label>
                    <input type="password" id="newPassword" name="newPassword" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Yangi parolni tasdiqlang:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
                </div>
                <button type="submit" class="btn btn-success">🔑 Parolni o'zgartirish</button>
            </form>
        </div>
    </div>

    <script>
        // Profile form submission
        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('http://localhost:3001/api/users/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    showAlert('✅ Profil muvaffaqiyatli yangilandi!', 'success');
                    updateDisplay(result);
                } else {
                    const error = await response.json();
                    showAlert('❌ ' + (error.message || 'Xatolik yuz berdi'), 'error');
                }
            } catch (error) {
                showAlert('❌ Tarmoq xatosi: ' + error.message, 'error');
            }
        });

        // Password form submission
        document.getElementById('passwordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            if (data.newPassword !== data.confirmPassword) {
                showAlert('❌ Yangi parollar mos kelmadi!', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:3001/api/users/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        currentPassword: data.currentPassword,
                        newPassword: data.newPassword
                    })
                });
                
                if (response.ok) {
                    showAlert('✅ Parol muvaffaqiyatli o\\'zgartirildi!', 'success');
                    e.target.reset();
                } else {
                    const error = await response.json();
                    showAlert('❌ ' + (error.message || 'Xatolik yuz berdi'), 'error');
                }
            } catch (error) {
                showAlert('❌ Tarmoq xatosi: ' + error.message, 'error');
            }
        });

        function showAlert(message, type) {
            const alertEl = document.getElementById(type === 'success' ? 'successAlert' : 'errorAlert');
            alertEl.textContent = message;
            alertEl.style.display = 'block';
            
            setTimeout(() => {
                alertEl.style.display = 'none';
            }, 5000);
        }

        function updateDisplay(user) {
            document.getElementById('displayName').textContent = user.name;
            document.getElementById('displayEmail').textContent = user.email;
            document.getElementById('avatar').textContent = user.name.charAt(0).toUpperCase();
        }
    </script>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // API endpointlar
  if (path === '/api/users/profile' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(currentUser));
    return;
  }

  if (path === '/api/users/profile' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        currentUser = { ...currentUser, ...data };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(currentUser));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid data' }));
      }
    });
    return;
  }

  if (path === '/api/users/change-password' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.currentPassword === 'password123' && data.newPassword) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Password changed successfully' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Current password is incorrect' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid data' }));
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Sahifa topilmadi</h1>');
});

server.listen(PORT, () => {
  console.log(`🚀 Profile Management Server running at http://localhost:${PORT}`);
  console.log(`📱 Profile page: http://localhost:${PORT}/profile`);
});