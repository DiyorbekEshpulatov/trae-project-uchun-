// Standalone API server
// Bu fayl NestJS ni dependenciesiz ishga tushirish uchun

const http = require('http');
const url = require('url');

const PORT = 3001;

// Mock data
const mockUsers = [
  { id: '1', email: 'admin@example.com', password: 'password123', name: 'Admin User', role: 'admin' }
];

const mockCompanies = [
  { id: '1', name: 'ABC Kompaniyasi', inn: '123456789', address: 'Toshkent shahar', phone: '+998901234567', email: 'info@abc.uz', status: 'active' },
  { id: '2', name: 'XYZ MCHJ', inn: '987654321', address: 'Samarqand shahar', phone: '+998909876543', email: 'info@xyz.uz', status: 'active' }
];

const mockProducts = [
  { id: '1', name: 'Kompyuter', code: 'PC001', description: 'Desktop computer', quantity: 15, price: 1200, minQuantity: 10, companyId: '1' },
  { id: '2', name: 'Printer', code: 'PR001', description: 'Laser printer', quantity: 5, price: 300, minQuantity: 10, companyId: '1' },
  { id: '3', name: 'Monitor', code: 'MN001', description: '24 inch monitor', quantity: 25, price: 400, minQuantity: 15, companyId: '2' }
];

const mockTransactions = [
  { id: '1', type: 'INCOME', amount: 5000, description: 'Product sale', companyId: '1', createdAt: new Date() },
  { id: '2', type: 'EXPENSE', amount: 2000, description: 'Office supplies', companyId: '1', createdAt: new Date() }
];

const mockCategories = [
  { id: '1', name: 'Elektronika', description: 'Kompyuterlar va elektron qurilmalar', color: '#FF6B6B' },
  { id: '2', name: 'Ofis jihozlari', description: 'Printerlar va ofis uskunalari', color: '#4ECDC4' },
  { id: '3', name: 'Mebel', description: 'Stol-stul va mebellar', color: '#45B7D1' },
  { id: '4', name: 'Program taminoti', description: 'Dasturiy taminot va litsenziyalar', color: '#96CEB4' }
];

// Mahsulotlarga kategoriya qo'shamiz
mockProducts.forEach(product => {
  product.categoryId = product.id === '1' ? '1' : product.id === '2' ? '2' : '1';
});

// Helper functions
function getRequestData(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
    req.on('error', reject);
  });
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Routes
const routes = {
  'POST /api/auth/login': async (req, res) => {
    const data = await getRequestData(req);
    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
    if (user) {
      sendResponse(res, 200, { 
        access_token: 'mock-jwt-token-' + Date.now(), 
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      });
    } else {
      sendResponse(res, 401, { message: 'Invalid credentials' });
    }
  },

  'GET /api/stats': (req, res) => {
    const stats = {
      totalProducts: mockProducts.length,
      totalValue: mockProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      lowStockProducts: mockProducts.filter(p => p.quantity <= p.minQuantity).length,
      activeCompanies: mockCompanies.filter(c => c.status === 'active').length
    };
    sendResponse(res, 200, stats);
  },

  'GET /api/companies': (req, res) => {
    sendResponse(res, 200, mockCompanies);
  },

  'GET /api/companies/:id': (req, res, id) => {
    const company = mockCompanies.find(c => c.id === id);
    if (company) {
      sendResponse(res, 200, company);
    } else {
      sendResponse(res, 404, { message: 'Company not found' });
    }
  },

  'GET /api/products': (req, res) => {
    sendResponse(res, 200, mockProducts);
  },

  'GET /api/products/:id': (req, res, id) => {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
      sendResponse(res, 200, product);
    } else {
      sendResponse(res, 404, { message: 'Product not found' });
    }
  },

  'GET /api/transactions': (req, res) => {
    sendResponse(res, 200, mockTransactions);
  },

  'GET /api/export/products': (req, res) => {
    sendResponse(res, 200, mockProducts);
  },

  'GET /api/export/companies': (req, res) => {
    sendResponse(res, 200, mockCompanies);
  },

  'POST /api/import/products': async (req, res) => {
    const data = await getRequestData(req);
    if (Array.isArray(data)) {
      data.forEach(item => {
        const newProduct = { id: Date.now().toString() + Math.random().toString(36).slice(2), ...item };
        mockProducts.push(newProduct);
      });
      sendResponse(res, 201, { message: 'Products imported', count: data.length });
    } else {
      sendResponse(res, 400, { message: 'Invalid data format' });
    }
  },

  'POST /api/companies': async (req, res) => {
    const data = await getRequestData(req);
    const newCompany = { id: Date.now().toString(), ...data, status: 'active' };
    mockCompanies.push(newCompany);
    sendResponse(res, 201, newCompany);
  },

  'POST /api/products': async (req, res) => {
    const data = await getRequestData(req);
    const newProduct = { id: Date.now().toString(), ...data };
    mockProducts.push(newProduct);
    sendResponse(res, 201, newProduct);
  },

  'PUT /api/companies/:id': async (req, res, id) => {
    const data = await getRequestData(req);
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCompanies[index] = { ...mockCompanies[index], ...data };
      sendResponse(res, 200, mockCompanies[index]);
    } else {
      sendResponse(res, 404, { message: 'Company not found' });
    }
  },

  'PUT /api/products/:id': async (req, res, id) => {
    const data = await getRequestData(req);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...data };
      sendResponse(res, 200, mockProducts[index]);
    } else {
      sendResponse(res, 404, { message: 'Product not found' });
    }
  },

  'DELETE /api/companies/:id': (req, res, id) => {
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCompanies.splice(index, 1);
      sendResponse(res, 200, { message: 'Company deleted' });
    } else {
      sendResponse(res, 404, { message: 'Company not found' });
    }
  },

  'DELETE /api/products/:id': (req, res, id) => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
      sendResponse(res, 200, { message: 'Product deleted' });
    } else {
      sendResponse(res, 404, { message: 'Product not found' });
    }
  },

  'GET /api/users/profile': (req, res) => {
    const userId = '1'; // Mock: hozircha faqat admin user
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      sendResponse(res, 200, userWithoutPassword);
    } else {
      sendResponse(res, 404, { message: 'User not found' });
    }
  },

  'PUT /api/users/profile': async (req, res) => {
    const userId = '1'; // Mock: hozircha faqat admin user
    const data = await getRequestData(req);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      const { password, ...userWithoutPassword } = mockUsers[userIndex];
      sendResponse(res, 200, userWithoutPassword);
    } else {
      sendResponse(res, 404, { message: 'User not found' });
    }
  },

  'PUT /api/users/change-password': async (req, res) => {
    const userId = '1'; // Mock: hozircha faqat admin user
    const data = await getRequestData(req);
    const user = mockUsers.find(u => u.id === userId);
    
    if (user && data.currentPassword && data.newPassword) {
      if (user.password === data.currentPassword) {
        user.password = data.newPassword;
        sendResponse(res, 200, { message: 'Password changed successfully' });
      } else {
        sendResponse(res, 400, { message: 'Current password is incorrect' });
      }
    } else {
      sendResponse(res, 400, { message: 'Invalid request' });
    }
  },

  'GET /api/categories': (req, res) => {
    sendResponse(res, 200, mockCategories);
  },

  'POST /api/categories': async (req, res) => {
    const data = await getRequestData(req);
    const newCategory = { id: Date.now().toString(), ...data };
    mockCategories.push(newCategory);
    sendResponse(res, 201, newCategory);
  },

  'PUT /api/categories/:id': async (req, res, id) => {
    const data = await getRequestData(req);
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    
    if (categoryIndex !== -1) {
      mockCategories[categoryIndex] = { ...mockCategories[categoryIndex], ...data };
      sendResponse(res, 200, mockCategories[categoryIndex]);
    } else {
      sendResponse(res, 404, { message: 'Category not found' });
    }
  },

  'DELETE /api/categories/:id': (req, res, id) => {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCategories.splice(index, 1);
      sendResponse(res, 200, { message: 'Category deleted' });
    } else {
      sendResponse(res, 404, { message: 'Category not found' });
    }
  },

  'GET /api/products/category/:categoryId': (req, res, categoryId) => {
    const filteredProducts = mockProducts.filter(p => p.categoryId === categoryId);
    sendResponse(res, 200, filteredProducts);
  }
};

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  console.log('📨 API Request:', req.method, req.url);

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
  const routeKey = req.method + ' ' + path;

  // Dynamic route matching
  let handler = routes[routeKey];
  let param = null;

  if (!handler) {
    // Check for dynamic routes
    for (const [pattern, routeHandler] of Object.entries(routes)) {
      const [method, routePath] = pattern.split(' ');
      const paramMatch = routePath.match(/:(\w+)/);
      
      if (paramMatch && method === req.method) {
        const basePath = routePath.replace(/:(\w+)/, '');
        if (path.startsWith(basePath)) {
          param = path.replace(basePath, '').replace('/', '');
          handler = routeHandler;
          break;
        }
      }
    }
  }

  if (handler) {
    try {
      if (param) {
        await handler(req, res, param);
      } else {
        await handler(req, res);
      }
    } catch (error) {
      console.error('Route error:', error);
      sendResponse(res, 500, { message: 'Internal server error' });
    }
  } else {
    sendResponse(res, 404, { message: 'Route not found' });
  }
});

server.listen(PORT, () => {
  console.log('🚀 API Server running at http://localhost:' + PORT);
  console.log('📡 Available endpoints:');
  Object.keys(routes).forEach(route => {
    console.log('   ' + route);
  });
});