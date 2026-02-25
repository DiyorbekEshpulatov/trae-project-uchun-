// Standalone Categories Management Server
// Mahsulot kategoriyalari boshqarish uchun alohida server

const http = require('http');
const url = require('url');

const PORT = 8084;

// Mock data
let categories = [
  { id: '1', name: 'Elektronika', description: 'Kompyuterlar va elektron qurilmalar', color: '#FF6B6B', productCount: 2 },
  { id: '2', name: 'Ofis jihozlari', description: 'Printerlar va ofis uskunalari', color: '#4ECDC4', productCount: 1 },
  { id: '3', name: 'Mebel', description: 'Stol-stul va mebellar', color: '#45B7D1', productCount: 0 },
  { id: '4', name: 'Program taminoti', description: 'Dasturiy taminot va litsenziyalar', color: '#96CEB4', productCount: 0 }
];

let products = [
  { id: '1', name: 'Kompyuter', code: 'PC001', categoryId: '1', quantity: 15 },
  { id: '2', name: 'Monitor', code: 'MN001', categoryId: '1', quantity: 25 },
  { id: '3', name: 'Printer', code: 'PR001', categoryId: '2', quantity: 5 }
];

// Helper functions
function sendResponse(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function updateCategoryCounts() {
  categories.forEach(cat => {
    cat.productCount = products.filter(p => p.categoryId === cat.id).length;
  });
}

// HTML sahifa
function generateHTML() {
  updateCategoryCounts();
  
  return `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mahsulot Kategoriyalari - Smart Accounting</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        .header { background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .nav-links { display: flex; gap: 15px; margin-bottom: 20px; }
        .nav-links a { color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 20px; transition: background 0.3s; }
        .nav-links a:hover { background: rgba(255,255,255,0.3); }
        .card { background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .category-card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .category-card:hover { transform: translateY(-5px); }
        .category-header { display: flex; align-items: center; margin-bottom: 15px; }
        .category-color { width: 20px; height: 20px; border-radius: 50%; margin-right: 10px; }
        .category-info h3 { color: #333; margin-bottom: 5px; }
        .category-info p { color: #666; font-size: 14px; }
        .category-stats { display: flex; justify-content: space-between; margin-top: 15px; }
        .stat { text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
        .stat-label { font-size: 12px; color: #666; }
        .btn { padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s; margin: 5px; }
        .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: 600; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; }
        .color-picker { display: flex; gap: 10px; margin-top: 5px; }
        .color-option { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; }
        .color-option.selected { border-color: #333; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; }
        .modal-content { background: white; border-radius: 15px; padding: 30px; max-width: 500px; margin: 50px auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close { font-size: 24px; cursor: pointer; color: #666; }
        .close:hover { color: #333; }
        .filter-section { display: flex; gap: 15px; margin-bottom: 20px; align-items: center; }
        .filter-select { padding: 10px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav-links">
            <a href="http://localhost:3000">Bosh sahifa</a>
            <a href="http://localhost:8081">Import/Export</a>
            <a href="http://localhost:8082">Hisobotlar</a>
            <a href="http://localhost:8083/profile">User Profile</a>
            <a href="http://localhost:8084/categories">Kategoriyalar</a>
            <a href="http://localhost:8085/notifications">Email Notifications</a>
        </div>
        
        <div class="header">
            <h1>📂 Mahsulot Kategoriyalari</h1>
            <p>Mahsulot kategoriyalarini boshqarish va filtratsiya</p>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Kategoriyalar ro'yxati</h2>
                <button class="btn btn-primary" onclick="openAddModal()">➕ Yangi kategoriya</button>
            </div>
            
            <div class="filter-section">
                <label>Filtr:</label>
                <select class="filter-select" id="filterSelect" onchange="filterCategories()">
                    <option value="all">Barcha kategoriyalar</option>
                    <option value="with-products">Mahsulot bor</option>
                    <option value="empty">Bo'sh kategoriyalar</option>
                </select>
                <button class="btn btn-secondary" onclick="resetFilter()">🔄 Tozalash</button>
            </div>

            <div class="category-grid" id="categoryGrid">
                ${categories.map(cat => `
                    <div class="category-card" data-category-id="${cat.id}" data-product-count="${cat.productCount}">
                        <div class="category-header">
                            <div class="category-color" style="background-color: ${cat.color}"></div>
                            <div class="category-info">
                                <h3>${cat.name}</h3>
                                <p>${cat.description}</p>
                            </div>
                        </div>
                        <div class="category-stats">
                            <div class="stat">
                                <div class="stat-value">${cat.productCount}</div>
                                <div class="stat-label">Mahsulotlar</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">${cat.color}</div>
                                <div class="stat-label">Rang</div>
                            </div>
                        </div>
                        <div style="margin-top: 15px;">
                            <button class="btn btn-success" onclick="editCategory('${cat.id}')">✏️ Tahrirlash</button>
                            <button class="btn btn-danger" onclick="deleteCategory('${cat.id}')">🗑️ O'chirish</button>
                            <button class="btn btn-primary" onclick="viewProducts('${cat.id}')">👁️ Mahsulotlar</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div class="modal" id="categoryModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">Yangi kategoriya qo'shish</h2>
                    <span class="close" onclick="closeModal()">&times;</span>
                </div>
                <form id="categoryForm">
                    <div class="form-group">
                        <label for="categoryName">Kategoriya nomi:</label>
                        <input type="text" id="categoryName" required>
                    </div>
                    <div class="form-group">
                        <label for="categoryDescription">Tavsif:</label>
                        <textarea id="categoryDescription" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Rang tanlang:</label>
                        <div class="color-picker">
                            <div class="color-option" style="background-color: #FF6B6B" onclick="selectColor('#FF6B6B')"></div>
                            <div class="color-option" style="background-color: #4ECDC4" onclick="selectColor('#4ECDC4')"></div>
                            <div class="color-option" style="background-color: #45B7D1" onclick="selectColor('#45B7D1')"></div>
                            <div class="color-option" style="background-color: #96CEB4" onclick="selectColor('#96CEB4')"></div>
                            <div class="color-option" style="background-color: #FECA57" onclick="selectColor('#FECA57')"></div>
                            <div class="color-option" style="background-color: #FF9FF3" onclick="selectColor('#FF9FF3')"></div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">💾 Saqlash</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">❌ Bekor qilish</button>
                </form>
            </div>
        </div>

        <!-- Products Modal -->
        <div class="modal" id="productsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="productsModalTitle">Kategoriya mahsulotlari</h2>
                    <span class="close" onclick="closeProductsModal()">&times;</span>
                </div>
                <div id="productsList"></div>
                <button class="btn btn-secondary" onclick="closeProductsModal()">❌ Yopish</button>
            </div>
        </div>
    </div>

    <script>
        let selectedColor = '#FF6B6B';
        let currentEditingId = null;

        function selectColor(color) {
            selectedColor = color;
            document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
            event.target.classList.add('selected');
        }

        function openAddModal() {
            currentEditingId = null;
            document.getElementById('modalTitle').textContent = 'Yangi kategoriya qo\'shish';
            document.getElementById('categoryName').value = '';
            document.getElementById('categoryDescription').value = '';
            document.getElementById('categoryModal').style.display = 'block';
        }

        function editCategory(id) {
            currentEditingId = id;
            const category = ${JSON.stringify(categories)}.find(c => c.id === id);
            if (category) {
                document.getElementById('modalTitle').textContent = 'Kategoriyani tahrirlash';
                document.getElementById('categoryName').value = category.name;
                document.getElementById('categoryDescription').value = category.description;
                selectedColor = category.color;
                document.querySelectorAll('.color-option').forEach(el => {
                    el.classList.remove('selected');
                    if (el.style.backgroundColor === category.color) {
                        el.classList.add('selected');
                    }
                });
                document.getElementById('categoryModal').style.display = 'block';
            }
        }

        function closeModal() {
            document.getElementById('categoryModal').style.display = 'none';
        }

        function closeProductsModal() {
            document.getElementById('productsModal').style.display = 'none';
        }

        function filterCategories() {
            const filter = document.getElementById('filterSelect').value;
            const cards = document.querySelectorAll('.category-card');
            
            cards.forEach(card => {
                const productCount = parseInt(card.dataset.productCount);
                let show = true;
                
                if (filter === 'with-products' && productCount === 0) show = false;
                if (filter === 'empty' && productCount > 0) show = false;
                
                card.style.display = show ? 'block' : 'none';
            });
        }

        function resetFilter() {
            document.getElementById('filterSelect').value = 'all';
            document.querySelectorAll('.category-card').forEach(card => {
                card.style.display = 'block';
            });
        }

        function viewProducts(categoryId) {
            const category = ${JSON.stringify(categories)}.find(c => c.id === categoryId);
            const categoryProducts = ${JSON.stringify(products)}.filter(p => p.categoryId === categoryId);
            
            document.getElementById('productsModalTitle').textContent = category.name + ' - Mahsulotlar';
            
            let productsHTML = '<div style="margin-bottom: 20px;">';
            if (categoryProducts.length === 0) {
                productsHTML += '<p style="color: #666; text-align: center;">Bu kategoriyada hozircha mahsulotlar mavjud emas.</p>';
            } else {
                productsHTML += '<table style="width: 100%; border-collapse: collapse;">';
                productsHTML += '<thead><tr style="background: #f8f9fa;"><th style="padding: 10px; border: 1px solid #ddd;">Nomi</th><th style="padding: 10px; border: 1px solid #ddd;">Kodi</th><th style="padding: 10px; border: 1px solid #ddd;">Miqdor</th></tr></thead>';
                productsHTML += '<tbody>';
                categoryProducts.forEach(product => {
                    productsHTML += '<tr>';
                    productsHTML += '<td style="padding: 10px; border: 1px solid #ddd;">' + product.name + '</td>';
                    productsHTML += '<td style="padding: 10px; border: 1px solid #ddd;">' + product.code + '</td>';
                    productsHTML += '<td style="padding: 10px; border: 1px solid #ddd;">' + product.quantity + '</td>';
                    productsHTML += '</tr>';
                });
                productsHTML += '</tbody></table>';
            }
            productsHTML += '</div>';
            
            document.getElementById('productsList').innerHTML = productsHTML;
            document.getElementById('productsModal').style.display = 'block';
        }

        function deleteCategory(id) {
            if (confirm('Haqiqatan ham bu kategoriyani o\'chirmoqchimisiz?')) {
                fetch('/api/categories/' + id, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Category deleted') {
                        location.reload();
                    } else {
                        alert('Xatolik yuz berdi: ' + data.message);
                    }
                })
                .catch(error => {
                    alert('Tarmoq xatosi: ' + error.message);
                });
            }
        }

        document.getElementById('categoryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                name: document.getElementById('categoryName').value,
                description: document.getElementById('categoryDescription').value,
                color: selectedColor
            };

            const url = currentEditingId ? '/api/categories/' + currentEditingId : '/api/categories';
            const method = currentEditingId ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    location.reload();
                } else {
                    alert('Xatolik yuz berdi: ' + data.message);
                }
            })
            .catch(error => {
                alert('Tarmoq xatosi: ' + error.message);
            });
        });

        // Initialize color picker
        document.querySelector('.color-option').classList.add('selected');
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

  console.log('📨 Categories Server Request:', req.method, req.url);

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
  if (path === '/categories' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateHTML());
    return;
  }

  // API endpointlar
  if (path === '/api/categories' && req.method === 'GET') {
    updateCategoryCounts();
    sendResponse(res, 200, categories);
    return;
  }

  if (path === '/api/categories' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const newCategory = { 
          id: Date.now().toString(), 
          name: data.name || 'New Category',
          description: data.description || '',
          color: data.color || '#FF6B6B',
          productCount: 0
        };
        categories.push(newCategory);
        sendResponse(res, 201, newCategory);
      } catch (error) {
        sendResponse(res, 400, { message: 'Invalid data' });
      }
    });
    return;
  }

  const categoryIdMatch = path.match(/^\/api\/categories\/([^\/]+)$/);
  if (categoryIdMatch && req.method === 'PUT') {
    const categoryId = categoryIdMatch[1];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        
        if (categoryIndex !== -1) {
          categories[categoryIndex] = { 
            ...categories[categoryIndex], 
            name: data.name || categories[categoryIndex].name,
            description: data.description !== undefined ? data.description : categories[categoryIndex].description,
            color: data.color || categories[categoryIndex].color
          };
          sendResponse(res, 200, categories[categoryIndex]);
        } else {
          sendResponse(res, 404, { message: 'Category not found' });
        }
      } catch (error) {
        sendResponse(res, 400, { message: 'Invalid data' });
      }
    });
    return;
  }

  if (categoryIdMatch && req.method === 'DELETE') {
    const categoryId = categoryIdMatch[1];
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex !== -1) {
      categories.splice(categoryIndex, 1);
      sendResponse(res, 200, { message: 'Category deleted' });
    } else {
      sendResponse(res, 404, { message: 'Category not found' });
    }
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Sahifa topilmadi</h1>');
});

server.listen(PORT, () => {
  console.log(`🚀 Categories Management Server running at http://localhost:${PORT}`);
  console.log(`📂 Categories page: http://localhost:${PORT}/categories`);
});