// Standalone Email Notifications Server
// Kam qolgan tovarlar uchun email xabarnomalar

const http = require('http');
const url = require('url');

const PORT = 8085;

// Mock data
let notifications = [
  { id: '1', productId: '1', productName: 'Kompyuter', currentQuantity: 15, threshold: 20, email: 'admin@company.com', status: 'sent', sentAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', productId: '3', productName: 'Printer', currentQuantity: 5, threshold: 10, email: 'admin@company.com', status: 'pending', sentAt: null }
];

let products = [
  { id: '1', name: 'Kompyuter', code: 'PC001', quantity: 15, minQuantity: 20 },
  { id: '2', name: 'Monitor', code: 'MN001', quantity: 25, minQuantity: 10 },
  { id: '3', name: 'Printer', code: 'PR001', quantity: 5, minQuantity: 10 }
];

let emailSettings = {
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  email: 'notifications@company.com',
  password: 'app-password',
  enabled: true
};

// Helper functions
function sendResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function generateMockEmailContent(product, threshold) {
  return {
    subject: `⚠️ Diqqat: ${product.name} mahsuloti kam qoldi!`,
    body: `
      Assalomu alaykum,
      
      Diqqatga sazovor holat: ${product.name} mahsulotining ombordagi qoldigi ${product.quantity} ga tushdi.
      Minimal talab etilgan miqdor: ${threshold}
      
      Mahsulot haqida ma'lumot:
      - Nomi: ${product.name}
      - Kodi: ${product.code}
      - Joriy miqdor: ${product.quantity}
      - Minimal miqdor: ${threshold}
      
      Iltimos, tezda buyurtma berishni ko'rib chiqing.
      
      Hurmat bilan,
      Smart Accounting tizimi
    `
  };
}

function checkLowStock() {
  const newNotifications = [];
  
  products.forEach(product => {
    if (product.quantity <= product.minQuantity) {
      const existingNotification = notifications.find(n => n.productId === product.id && n.status === 'pending');
      
      if (!existingNotification) {
        const newNotification = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          productId: product.id,
          productName: product.name,
          currentQuantity: product.quantity,
          threshold: product.minQuantity,
          email: emailSettings.email,
          status: 'pending',
          sentAt: null
        };
        
        notifications.push(newNotification);
        newNotifications.push(newNotification);
      }
    }
  });
  
  return newNotifications;
}

function sendMockEmail(notification) {
  // Mock email sending - real implementation would use nodemailer
  const product = products.find(p => p.id === notification.productId);
  const emailContent = generateMockEmailContent(product, notification.threshold);
  
  console.log('📧 Mock Email sent to:', notification.email);
  console.log('Subject:', emailContent.subject);
  console.log('Body:', emailContent.body);
  
  // Update notification status
  notification.status = 'sent';
  notification.sentAt = new Date().toISOString();
  
  return true;
}

// HTML sahifa
function generateHTML() {
  const lowStockProducts = products.filter(p => p.quantity <= p.minQuantity);
  
  return `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Xabarnomalar - Smart Accounting</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .nav-links { display: flex; gap: 15px; margin-bottom: 20px; }
        .nav-links a { color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 20px; transition: background 0.3s; }
        .nav-links a:hover { background: rgba(255,255,255,0.3); }
        .card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .stat-value { font-size: 32px; font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 14px; }
        .btn { padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s; margin: 5px; }
        .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-warning { background: #ffc107; color: #212529; }
        .btn-danger { background: #dc3545; color: white; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .table th { background: #f8f9fa; font-weight: 600; }
        .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .status-pending { background: #ffc107; color: #212529; }
        .status-sent { background: #28a745; color: white; }
        .status-failed { background: #dc3545; color: white; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: 600; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; }
        .modal-content { background: white; border-radius: 15px; padding: 30px; max-width: 600px; margin: 50px auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close { font-size: 24px; cursor: pointer; color: #666; }
        .close:hover { color: #333; }
        .low-stock-item { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
        .notification-item { background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a href="http://localhost:3000">Bosh sahifa</a>
            <a href="http://localhost:8081">Import/Export</a>
            <a href="http://localhost:8082">Hisobotlar</a>
            <a href="http://localhost:8083/profile">User Profile</a>
            <a href="http://localhost:8084/categories">Categories</a>
            <a href="http://localhost:8085/notifications">Notifications</a>
        </div>
        
        <div class="header">
            <h1>📧 Email Xabarnomalar</h1>
            <p>Kam qolgan tovarlar uchun avtomatik xabarnomalar</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${notifications.length}</div>
                <div class="stat-label">Jami xabarnomalar</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${notifications.filter(n => n.status === 'sent').length}</div>
                <div class="stat-label">Yuborilgan</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${notifications.filter(n => n.status === 'pending').length}</div>
                <div class="stat-label">Kutilmoqda</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${lowStockProducts.length}</div>
                <div class="stat-label">Kam qolgan mahsulotlar</div>
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>🔄 Xabarnoma sozlamalari</h2>
                <div>
                    <button class="btn btn-primary" onclick="checkLowStock()">🔍 Kam qolganlarni tekshirish</button>
                    <button class="btn btn-success" onclick="sendAllPending()">📧 Kutilganlarni yuborish</button>
                    <button class="btn btn-warning" onclick="openSettingsModal()">⚙️ Sozlamalar</button>
                </div>
            </div>

            <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 20px;">
                <label>Avtomatik xabarnomalar:</label>
                <button class="btn ${emailSettings.enabled ? 'btn-success' : 'btn-danger'}" onclick="toggleNotifications()">
                    ${emailSettings.enabled ? '✅ Yoqilgan' : '❌ O\'chirilgan'}
                </button>
            </div>
        </div>

        <div class="card">
            <h2>⚠️ Kam qolgan mahsulotlar</h2>
            ${lowStockProducts.length === 0 ? 
                '<p style="color: #28a745; text-align: center;">✅ Hozircha kam qolgan mahsulotlar yo\'q</p>' :
                lowStockProducts.map(product => `
                    <div class="low-stock-item">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${product.name}</strong> (${product.code})
                                <br><span style="color: #dc3545;">Qoldiq: ${product.quantity} (Minimal: ${product.minQuantity})</span>
                            </div>
                            <button class="btn btn-primary" onclick="sendNotification('${product.id}')">📧 Xabar yuborish</button>
                        </div>
                    </div>
                `).join('')
            }
        </div>

        <div class="card">
            <h2>📋 Xabarnomalar tarixi</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Mahsulot</th>
                        <th>Joriy miqdor</th>
                        <th>Chegara</th>
                        <th>Email</th>
                        <th>Holat</th>
                        <th>Yuborilgan vaqt</th>
                        <th>Harakatlar</th>
                    </tr>
                </thead>
                <tbody>
                    ${notifications.map(notification => `
                        <tr>
                            <td><strong>${notification.productName}</strong></td>
                            <td><span style="color: ${notification.currentQuantity <= notification.threshold ? '#dc3545' : '#28a745'}">${notification.currentQuantity}</span></td>
                            <td>${notification.threshold}</td>
                            <td>${notification.email}</td>
                            <td><span class="status-badge status-${notification.status}">${notification.status === 'sent' ? 'Yuborilgan' : notification.status === 'pending' ? 'Kutilmoqda' : 'Xato'}</span></td>
                            <td>${notification.sentAt ? new Date(notification.sentAt).toLocaleString('uz-UZ') : '-'}</td>
                            <td>
                                ${notification.status === 'pending' ? 
                                    `<button class="btn btn-success" onclick="sendNotification('${notification.productId}')">📧 Yuborish</button>` :
                                    `<button class="btn btn-warning" onclick="resendNotification('${notification.id}')">🔄 Qayta yuborish</button>`
                                }
                                <button class="btn btn-danger" onclick="deleteNotification('${notification.id}')">🗑️ O'chirish</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Settings Modal -->
        <div class="modal" id="settingsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⚙️ Xabarnoma sozlamalari</h2>
                    <span class="close" onclick="closeSettingsModal()">&times;</span>
                </div>
                <form id="settingsForm">
                    <div class="form-group">
                        <label for="smtpHost">SMTP Server:</label>
                        <input type="text" id="smtpHost" value="${emailSettings.smtpHost}" required>
                    </div>
                    <div class="form-group">
                        <label for="smtpPort">SMTP Port:</label>
                        <input type="number" id="smtpPort" value="${emailSettings.smtpPort}" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email manzil:</label>
                        <input type="email" id="email" value="${emailSettings.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Parol:</label>
                        <input type="password" id="password" value="${emailSettings.password}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">💾 Saqlash</button>
                    <button type="button" class="btn btn-secondary" onclick="closeSettingsModal()">❌ Bekor qilish</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        function openSettingsModal() {
            document.getElementById('settingsModal').style.display = 'block';
        }

        function closeSettingsModal() {
            document.getElementById('settingsModal').style.display = 'none';
        }

        function toggleNotifications() {
            fetch('/api/notifications/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.enabled !== undefined) {
                    location.reload();
                }
            });
        }

        function checkLowStock() {
            fetch('/api/notifications/check-low-stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.newNotifications && data.newNotifications.length > 0) {
                    alert('✅ ' + data.newNotifications.length + ' ta yangi xabarnoma yaratildi!');
                    location.reload();
                } else {
                    alert('ℹ️ Yangi kam qolgan mahsulotlar topilmadi.');
                }
            });
        }

        function sendAllPending() {
            if (confirm('Haqiqatan ham barcha kutilayotgan xabarnomalarni yubormoqchimisiz?')) {
                fetch('/api/notifications/send-pending', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    alert('✅ ' + data.sent + ' ta xabarnoma yuborildi!');
                    location.reload();
                });
            }
        }

        function sendNotification(productId) {
            fetch('/api/notifications/send/' + productId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Notification sent') {
                    alert('✅ Xabarnoma yuborildi!');
                    location.reload();
                } else {
                    alert('❌ Xatolik: ' + data.message);
                }
            });
        }

        function resendNotification(notificationId) {
            fetch('/api/notifications/resend/' + notificationId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Notification resent') {
                    alert('✅ Xabarnoma qayta yuborildi!');
                    location.reload();
                }
            });
        }

        function deleteNotification(notificationId) {
            if (confirm('Haqiqatan ham bu xabarnomani o\'chirmoqchimisiz?')) {
                fetch('/api/notifications/' + notificationId, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Notification deleted') {
                        location.reload();
                    }
                });
            }
        }

        document.getElementById('settingsForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                smtpHost: document.getElementById('smtpHost').value,
                smtpPort: parseInt(document.getElementById('smtpPort').value),
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            fetch('/api/notifications/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Settings updated') {
                    alert('✅ Sozlamalar yangilandi!');
                    closeSettingsModal();
                }
            });
        });

        // Auto-check for low stock every 30 seconds
        setInterval(() => {
            if (${emailSettings.enabled}) {
                fetch('/api/notifications/check-low-stock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.newNotifications && data.newNotifications.length > 0) {
                        console.log('New low stock notifications found:', data.newNotifications.length);
                    }
                });
            }
        }, 30000);
    </script>
</body>
</html>`;
}

// API server
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  console.log('📨 Notifications Server Request:', req.method, req.url);

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
  if (path === '/notifications' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateHTML());
    return;
  }

  // API endpointlar
  if (path === '/api/notifications' && req.method === 'GET') {
    sendResponse(res, 200, notifications);
    return;
  }

  if (path === '/api/notifications/settings' && req.method === 'GET') {
    sendResponse(res, 200, emailSettings);
    return;
  }

  if (path === '/api/notifications/settings' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        emailSettings = { ...emailSettings, ...data };
        sendResponse(res, 200, { message: 'Settings updated' });
      } catch (error) {
        sendResponse(res, 400, { message: 'Invalid data' });
      }
    });
    return;
  }

  if (path === '/api/notifications/toggle' && req.method === 'POST') {
    emailSettings.enabled = !emailSettings.enabled;
    sendResponse(res, 200, { enabled: emailSettings.enabled });
    return;
  }

  if (path === '/api/notifications/check-low-stock' && req.method === 'POST') {
    const newNotifications = checkLowStock();
    sendResponse(res, 200, { newNotifications, count: newNotifications.length });
    return;
  }

  if (path === '/api/notifications/send-pending' && req.method === 'POST') {
    const pendingNotifications = notifications.filter(n => n.status === 'pending');
    let sentCount = 0;
    
    pendingNotifications.forEach(notification => {
      if (sendMockEmail(notification)) {
        sentCount++;
      }
    });
    
    sendResponse(res, 200, { sent: sentCount, total: pendingNotifications.length });
    return;
  }

  const productIdMatch = path.match(/^\/api\/notifications\/send\/([^\/]+)$/);
  if (productIdMatch && req.method === 'POST') {
    const productId = productIdMatch[1];
    const product = products.find(p => p.id === productId);
    
    if (product && product.quantity <= product.minQuantity) {
      const existingNotification = notifications.find(n => n.productId === productId && n.status === 'pending');
      
      if (existingNotification) {
        if (sendMockEmail(existingNotification)) {
          sendResponse(res, 200, { message: 'Notification sent' });
        } else {
          sendResponse(res, 500, { message: 'Failed to send email' });
        }
      } else {
        // Create new notification
        const newNotification = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          productId: product.id,
          productName: product.name,
          currentQuantity: product.quantity,
          threshold: product.minQuantity,
          email: emailSettings.email,
          status: 'pending',
          sentAt: null
        };
        
        notifications.push(newNotification);
        if (sendMockEmail(newNotification)) {
          sendResponse(res, 200, { message: 'Notification sent' });
        } else {
          sendResponse(res, 500, { message: 'Failed to send email' });
        }
      }
    } else {
      sendResponse(res, 400, { message: 'Product not found or not low in stock' });
    }
    return;
  }

  const notificationIdMatch = path.match(/^\/api\/notifications\/resend\/([^\/]+)$/);
  if (notificationIdMatch && req.method === 'POST') {
    const notificationId = notificationIdMatch[1];
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.status = 'pending';
      notification.sentAt = null;
      
      if (sendMockEmail(notification)) {
        sendResponse(res, 200, { message: 'Notification resent' });
      } else {
        sendResponse(res, 500, { message: 'Failed to resend email' });
      }
    } else {
      sendResponse(res, 404, { message: 'Notification not found' });
    }
    return;
  }

  const deleteNotificationMatch = path.match(/^\/api\/notifications\/([^\/]+)$/);
  if (deleteNotificationMatch && req.method === 'DELETE') {
    const notificationId = deleteNotificationMatch[1];
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex !== -1) {
      notifications.splice(notificationIndex, 1);
      sendResponse(res, 200, { message: 'Notification deleted' });
    } else {
      sendResponse(res, 404, { message: 'Notification not found' });
    }
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Sahifa topilmadi</h1>');
});

server.listen(PORT, () => {
  console.log(`🚀 Email Notifications Server running at http://localhost:${PORT}`);
  console.log(`📧 Notifications page: http://localhost:${PORT}/notifications`);
  
  // Check for low stock every minute
  setInterval(() => {
    if (emailSettings.enabled) {
      const newNotifications = checkLowStock();
      if (newNotifications.length > 0) {
        console.log(`Found ${newNotifications.length} new low stock items`);
      }
    }
  }, 60000);
});