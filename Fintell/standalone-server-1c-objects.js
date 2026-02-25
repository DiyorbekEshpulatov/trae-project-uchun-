// 1C Objects and Categories Management System
// Bu server 1C dagi barcha obyektlar va kategoriyalarni boshqarish funksiyalarini taklif qiladi

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8088;

// 1C dagi obyekt turlari
const OBJECT_TYPES = {
  PRODUCT: 'product',          // Mahsulot
  SERVICE: 'service',          // Xizmat
  CUSTOMER: 'customer',        // Mijoz
  SUPPLIER: 'supplier',        // Yetkazib beruvchi
  EMPLOYEE: 'employee',        // Xodim
  WAREHOUSE: 'warehouse',      // Ombor
  DEPARTMENT: 'department',    // Bo'lim
  PROJECT: 'project',          // Loyiha
  CONTRACT: 'contract',        // Shartnoma
  ASSET: 'asset'               // Aktiv
};

// 1C dagi kategoriya turlari
const CATEGORY_TYPES = {
  PRODUCT_CATEGORY: 'product_category',    // Mahsulot kategoriyasi
  CUSTOMER_GROUP: 'customer_group',       // Mijoz guruhi
  SUPPLIER_GROUP: 'supplier_group',     // Yetkazib beruvchi guruhi
  EXPENSE_CATEGORY: 'expense_category', // Xarajat kategoriyasi
  INCOME_CATEGORY: 'income_category',   // Daromad kategoriyasi
  ASSET_CATEGORY: 'asset_category'       // Aktiv kategoriyasi
};

// Obyektlar bazasi (1C dagi Objects)
let OBJECTS = {
  products: [
    {
      id: 'P001',
      code: 'COMP-001',
      name: 'Kompyuter Lenovo ThinkPad',
      type: OBJECT_TYPES.PRODUCT,
      category: 'ELEKTRONIKA',
      unit: 'dona',
      price: 1500,
      cost: 1200,
      quantity: 50,
      minQuantity: 10,
      maxQuantity: 100,
      barcode: '1234567890123',
      supplier: 'SUP-001',
      warehouse: 'WH-001',
      status: 'active',
      createdDate: '2024-01-01',
      modifiedDate: '2024-01-15',
      attributes: {
        brand: 'Lenovo',
        model: 'ThinkPad X1',
        cpu: 'Intel i7',
        ram: '16GB',
        storage: '512GB SSD',
        color: 'Black'
      }
    },
    {
      id: 'P002',
      code: 'PHN-001',
      name: 'Smartphone iPhone 15',
      type: OBJECT_TYPES.PRODUCT,
      category: 'ELEKTRONIKA',
      unit: 'dona',
      price: 1200,
      cost: 1000,
      quantity: 25,
      minQuantity: 5,
      maxQuantity: 50,
      barcode: '1234567890124',
      supplier: 'SUP-002',
      warehouse: 'WH-001',
      status: 'active',
      createdDate: '2024-01-02',
      modifiedDate: '2024-01-20',
      attributes: {
        brand: 'Apple',
        model: 'iPhone 15',
        storage: '256GB',
        color: 'Blue',
        os: 'iOS 17'
      }
    }
  ],
  customers: [
    {
      id: 'C001',
      code: 'CUST-001',
      name: 'Ozbekiston Respublikasi Vazirlar Mahkamasi',
      type: OBJECT_TYPES.CUSTOMER,
      category: 'GOVERNMENT',
      inn: '123456789',
      phone: '+998712345678',
      email: 'info@gov.uz',
      address: 'Toshkent shahri, Navoiy kochasi 1',
      contactPerson: 'Aliyev Vali',
      creditLimit: 100000,
      paymentTerms: '30 kun',
      status: 'active',
      createdDate: '2024-01-01',
      attributes: {
        organizationType: 'Davlat',
        industry: 'Hukumat',
        region: 'Toshkent'
      }
    },
    {
      id: 'C002',
      code: 'CUST-002',
      name: 'Global Tech Solutions',
      type: OBJECT_TYPES.CUSTOMER,
      category: 'CORPORATE',
      inn: '987654321',
      phone: '+998712345679',
      email: 'info@globaltech.uz',
      address: 'Toshkent shahri, Amir Temur kochasi 100',
      contactPerson: 'John Smith',
      creditLimit: 50000,
      paymentTerms: '15 kun',
      status: 'active',
      createdDate: '2024-01-05',
      attributes: {
        organizationType: 'Xususiy',
        industry: 'IT',
        region: 'Toshkent'
      }
    }
  ],
  suppliers: [
    {
      id: 'S001',
      code: 'SUP-001',
      name: 'Tech Distribution Ltd',
      type: OBJECT_TYPES.SUPPLIER,
      category: 'ELECTRONICS',
      inn: '111222333',
      phone: '+998712345680',
      email: 'orders@techdist.uz',
      address: 'Toshkent shahri, Chilonzor 50',
      contactPerson: 'Bob Johnson',
      paymentTerms: '45 kun',
      status: 'active',
      createdDate: '2024-01-01',
      attributes: {
        country: 'Ozbekiston',
        rating: 'A',
        deliveryTime: '7 kun'
      }
    }
  ],
  employees: [
    {
      id: 'E001',
      code: 'EMP-001',
      name: 'Aliyev Vali Rahmonovich',
      type: OBJECT_TYPES.EMPLOYEE,
      department: 'SALES',
      position: 'Sotuv menejeri',
      phone: '+998901234567',
      email: 'vali@company.uz',
      salary: 5000,
      hireDate: '2023-01-01',
      status: 'active',
      attributes: {
        birthDate: '1990-05-15',
        passport: 'AA1234567',
        address: 'Toshkent shahri',
        education: 'Oliy',
        experience: '5 yil'
      }
    }
  ],
  warehouses: [
    {
      id: 'W001',
      code: 'WH-001',
      name: 'Asosiy ombor',
      type: OBJECT_TYPES.WAREHOUSE,
      address: 'Toshkent shahri, Sergeli 25',
      manager: 'E001',
      capacity: 10000,
      currentLoad: 6500,
      status: 'active',
      createdDate: '2024-01-01',
      attributes: {
        area: '2000 m²',
        temperature: 'Odatiy',
        security: '24/7',
        type: 'Umumiy'
      }
    }
  ]
};

// Kategoriyalar bazasi (1C dagi Categories)
let CATEGORIES = {
  product_categories: [
    {
      id: 'PC001',
      code: 'ELEKTRONIKA',
      name: 'Elektronika va texnika',
      type: CATEGORY_TYPES.PRODUCT_CATEGORY,
      parent: null,
      level: 1,
      description: 'Kompyuterlar, telefonlar, printerlar va boshqalar',
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'PC002',
      code: 'KOMPYUTER',
      name: 'Kompyuterlar',
      type: CATEGORY_TYPES.PRODUCT_CATEGORY,
      parent: 'PC001',
      level: 2,
      description: 'Noutbuklar, desktoplar, serverlar',
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'PC003',
      code: 'TELEFON',
      name: 'Telefonlar',
      type: CATEGORY_TYPES.PRODUCT_CATEGORY,
      parent: 'PC001',
      level: 2,
      description: 'Smartfonlar, mobil telefonlar',
      status: 'active',
      createdDate: '2024-01-01'
    }
  ],
  customer_groups: [
    {
      id: 'CG001',
      code: 'GOVERNMENT',
      name: 'Davlat muassasalari',
      type: CATEGORY_TYPES.CUSTOMER_GROUP,
      description: 'Vazirliklar, idoralar, davlat korxonalar',
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'CG002',
      code: 'CORPORATE',
      name: 'Korporativ mijozlar',
      type: CATEGORY_TYPES.CUSTOMER_GROUP,
      description: 'Katta va orta biznes korxonalar',
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'CG003',
      code: 'INDIVIDUAL',
      name: 'Jismoniy shaxslar',
      type: CATEGORY_TYPES.CUSTOMER_GROUP,
      description: 'Oddiy istemolchilar',
      status: 'active',
      createdDate: '2024-01-01'
    }
  ]
};

// Obyektni qidirish (1C dagi Object Search)
function searchObjects(query, type = null, category = null) {
  let results = [];
  
  // Barcha obyektlarni birlashtirish
  const allObjects = [
    ...OBJECTS.products.map(obj => ({ ...obj, objectType: 'product' })),
    ...OBJECTS.customers.map(obj => ({ ...obj, objectType: 'customer' })),
    ...OBJECTS.suppliers.map(obj => ({ ...obj, objectType: 'supplier' })),
    ...OBJECTS.employees.map(obj => ({ ...obj, objectType: 'employee' })),
    ...OBJECTS.warehouses.map(obj => ({ ...obj, objectType: 'warehouse' }))
  ];
  
  results = allObjects.filter(obj => {
    const matchesQuery = !query || 
      obj.name.toLowerCase().includes(query.toLowerCase()) ||
      obj.code.toLowerCase().includes(query.toLowerCase()) ||
      (obj.barcode && obj.barcode.includes(query));
    
    const matchesType = !type || obj.type === type;
    const matchesCategory = !category || obj.category === category;
    
    return matchesQuery && matchesType && matchesCategory;
  });
  
  return results;
}

// Obyektni yaratish (1C dagi Create Object)
function createObject(objectData) {
  const newObject = {
    id: generateObjectId(objectData.type),
    code: objectData.code || generateObjectCode(objectData.type),
    ...objectData,
    createdDate: new Date().toISOString().split('T')[0],
    modifiedDate: new Date().toISOString().split('T')[0],
    status: objectData.status || 'active'
  };
  
  // Obyektni tegishli guruhga qo'shish
  switch (objectData.type) {
    case OBJECT_TYPES.PRODUCT:
      OBJECTS.products.push(newObject);
      break;
    case OBJECT_TYPES.CUSTOMER:
      OBJECTS.customers.push(newObject);
      break;
    case OBJECT_TYPES.SUPPLIER:
      OBJECTS.suppliers.push(newObject);
      break;
    case OBJECT_TYPES.EMPLOYEE:
      OBJECTS.employees.push(newObject);
      break;
    case OBJECT_TYPES.WAREHOUSE:
      OBJECTS.warehouses.push(newObject);
      break;
  }
  
  return newObject;
}

// Obyektni yangilash (1C dagi Update Object)
function updateObject(objectId, updates) {
  let objectFound = false;
  let updatedObject = null;
  
  // Barcha obyektlarni tekshirish
  const allObjects = [
    ...OBJECTS.products,
    ...OBJECTS.customers,
    ...OBJECTS.suppliers,
    ...OBJECTS.employees,
    ...OBJECTS.warehouses
  ];
  
  for (let obj of allObjects) {
    if (obj.id === objectId) {
      Object.assign(obj, updates, { modifiedDate: new Date().toISOString().split('T')[0] });
      objectFound = true;
      updatedObject = obj;
      break;
    }
  }
  
  return updatedObject;
}

// Obyektni o'chirish (1C dagi Delete Object)
function deleteObject(objectId) {
  let deleted = false;
  
  // Barcha obyektlarni tekshirish va o'chirish
  for (let key in OBJECTS) {
    const initialLength = OBJECTS[key].length;
    OBJECTS[key] = OBJECTS[key].filter(obj => obj.id !== objectId);
    if (OBJECTS[key].length < initialLength) {
      deleted = true;
    }
  }
  
  return deleted;
}

// Kategoriyalarni boshqarish
function getCategories(type = null, parent = null) {
  let categories = [];
  
  // Barcha kategoriyalarni birlashtirish
  for (let key in CATEGORIES) {
    categories = [...categories, ...CATEGORIES[key]];
  }
  
  return categories.filter(cat => {
    const matchesType = !type || cat.type === type;
    const matchesParent = parent === null || cat.parent === parent;
    return matchesType && matchesParent;
  });
}

// Kategoriya yaratish
function createCategory(categoryData) {
  const newCategory = {
    id: generateCategoryId(categoryData.type),
    code: categoryData.code || generateCategoryCode(categoryData.type),
    ...categoryData,
    createdDate: new Date().toISOString().split('T')[0],
    status: categoryData.status || 'active'
  };
  
  // Kategoriyani tegishli guruhga qo'shish
  switch (categoryData.type) {
    case CATEGORY_TYPES.PRODUCT_CATEGORY:
      CATEGORIES.product_categories.push(newCategory);
      break;
    case CATEGORY_TYPES.CUSTOMER_GROUP:
      CATEGORIES.customer_groups.push(newCategory);
      break;
    case CATEGORY_TYPES.SUPPLIER_GROUP:
      if (!CATEGORIES.supplier_groups) CATEGORIES.supplier_groups = [];
      CATEGORIES.supplier_groups.push(newCategory);
      break;
    case CATEGORY_TYPES.EXPENSE_CATEGORY:
      if (!CATEGORIES.expense_categories) CATEGORIES.expense_categories = [];
      CATEGORIES.expense_categories.push(newCategory);
      break;
  }
  
  return newCategory;
}

// ID va kod generatsiyasi
function generateObjectId(type) {
  const prefix = type.substring(0, 1).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${timestamp}`;
}

function generateObjectCode(type) {
  const prefixes = {
    [OBJECT_TYPES.PRODUCT]: 'PROD',
    [OBJECT_TYPES.CUSTOMER]: 'CUST',
    [OBJECT_TYPES.SUPPLIER]: 'SUP',
    [OBJECT_TYPES.EMPLOYEE]: 'EMP',
    [OBJECT_TYPES.WAREHOUSE]: 'WH',
    [OBJECT_TYPES.DEPARTMENT]: 'DEPT',
    [OBJECT_TYPES.PROJECT]: 'PROJ',
    [OBJECT_TYPES.CONTRACT]: 'CONT',
    [OBJECT_TYPES.ASSET]: 'ASSET'
  };
  
  const prefix = prefixes[type] || 'OBJ';
  const count = getObjectCount(type) + 1;
  return `${prefix}-${String(count).padStart(3, '0')}`;
}

function generateCategoryId(type) {
  const prefix = type.substring(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-5);
  return `${prefix}${timestamp}`;
}

function generateCategoryCode(type) {
  const prefixes = {
    [CATEGORY_TYPES.PRODUCT_CATEGORY]: 'PC',
    [CATEGORY_TYPES.CUSTOMER_GROUP]: 'CG',
    [CATEGORY_TYPES.SUPPLIER_GROUP]: 'SG',
    [CATEGORY_TYPES.EXPENSE_CATEGORY]: 'EC',
    [CATEGORY_TYPES.INCOME_CATEGORY]: 'IC',
    [CATEGORY_TYPES.ASSET_CATEGORY]: 'AC'
  };
  
  const prefix = prefixes[type] || 'CAT';
  const count = getCategoryCount(type) + 1;
  return `${prefix}${String(count).padStart(3, '0')}`;
}

function getObjectCount(type) {
  switch (type) {
    case OBJECT_TYPES.PRODUCT:
      return OBJECTS.products.length;
    case OBJECT_TYPES.CUSTOMER:
      return OBJECTS.customers.length;
    case OBJECT_TYPES.SUPPLIER:
      return OBJECTS.suppliers.length;
    case OBJECT_TYPES.EMPLOYEE:
      return OBJECTS.employees.length;
    case OBJECT_TYPES.WAREHOUSE:
      return OBJECTS.warehouses.length;
    default:
      return 0;
  }
}

function getCategoryCount(type) {
  switch (type) {
    case CATEGORY_TYPES.PRODUCT_CATEGORY:
      return CATEGORIES.product_categories.length;
    case CATEGORY_TYPES.CUSTOMER_GROUP:
      return CATEGORIES.customer_groups.length;
    case CATEGORY_TYPES.SUPPLIER_GROUP:
      return CATEGORIES.supplier_groups ? CATEGORIES.supplier_groups.length : 0;
    case CATEGORY_TYPES.EXPENSE_CATEGORY:
      return CATEGORIES.expense_categories ? CATEGORIES.expense_categories.length : 0;
    default:
      return 0;
  }
}

// HTML sahifa
function generateHTML() {
  return `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📦 1C Obyektlar va Kategoriyalar</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #059669 0%, #0d9488 100%); 
            min-height: 100vh; 
            color: #333;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 20px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            text-align: center;
        }
        .header h1 { color: #059669; margin-bottom: 10px; }
        .nav { 
            display: flex; 
            gap: 15px; 
            margin-bottom: 20px; 
            flex-wrap: wrap;
            justify-content: center;
        }
        .nav a { 
            color: white; 
            text-decoration: none; 
            padding: 10px 20px; 
            background: rgba(255,255,255,0.2); 
            border-radius: 5px; 
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        .nav a:hover { 
            background: rgba(255,255,255,0.3); 
            transform: translateY(-2px);
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
            gap: 20px; 
        }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
        }
        .card h2 { 
            color: #059669; 
            margin-bottom: 15px; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 10px;
        }
        .btn { 
            background: #059669; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 5px;
            transition: all 0.3s ease;
        }
        .btn:hover { 
            background: #047857; 
            transform: translateY(-1px);
        }
        .btn-success { background: #10b981; }
        .btn-success:hover { background: #059669; }
        .btn-warning { background: #f59e0b; }
        .btn-warning:hover { background: #d97706; }
        .btn-danger { background: #ef4444; }
        .btn-danger:hover { background: #dc2626; }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 15px; 
            margin: 20px 0;
        }
        .stat-item { 
            background: #f0fdfa; 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center;
        }
        .stat-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #059669; 
        }
        .stat-label { 
            color: #6b7280; 
            font-size: 14px; 
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px;
        }
        .table th, .table td { 
            border: 1px solid #e5e7eb; 
            padding: 8px; 
            text-align: left; 
        }
        .table th { 
            background: #f0fdfa; 
            font-weight: bold; 
            color: #059669;
        }
        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        .search-box input, .search-box select {
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            flex: 1;
        }
        .object-type-tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .tab-button {
            padding: 8px 16px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .tab-button.active {
            background: #059669;
            color: white;
            border-color: #059669;
        }
        .tab-button:hover {
            background: #f0fdfa;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #374151;
        }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 5px;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: black;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 1C Obyektlar va Kategoriyalar</h1>
            <p>Professional obyektlar va kategoriyalar boshqaruv tizimi</p>
        </div>
        
        <div class="nav">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="http://localhost:8080/dashboard">📈 Dashboard</a>
            <a href="http://localhost:8081/import-export">📊 Import/Export</a>
            <a href="http://localhost:8082/reports">📋 Hisobotlar</a>
            <a href="http://localhost:8083/profile">👤 Profil</a>
            <a href="http://localhost:8084/categories">📂 Kategoriyalar</a>
            <a href="http://localhost:8085/notifications">📧 Xabarnomalar</a>
            <a href="http://localhost:8086/accounting">💰 Buxgalteriya</a>
            <a href="http://localhost:8087/excel">📊 Excel</a>
        </div>

        <div class="grid">
            <div class="card">
                <h2>🔍 Obyektlarni Qidirish</h2>
                <div class="search-box">
                    <input type="text" id="searchQuery" placeholder="Nomi yoki kodi bo'yicha qidirish...">
                    <select id="searchType">
                        <option value="">Barcha turlar</option>
                        <option value="product">Mahsulot</option>
                        <option value="customer">Mijoz</option>
                        <option value="supplier">Yetkazib beruvchi</option>
                        <option value="employee">Xodim</option>
                        <option value="warehouse">Ombor</option>
                    </select>
                    <button class="btn btn-success" onclick="searchObjects()">🔍 Qidirish</button>
                </div>
                <div id="searchResults"></div>
            </div>

            <div class="card">
                <h2>📊 Statistika</h2>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value" id="productCount">0</div>
                        <div class="stat-label">Mahsulotlar</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="customerCount">0</div>
                        <div class="stat-label">Mijozlar</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="supplierCount">0</div>
                        <div class="stat-label">Yetkazib beruvchilar</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="employeeCount">0</div>
                        <div class="stat-label">Xodimlar</div>
                    </div>
                </div>
                <button class="btn" onclick="updateStatistics()">🔄 Yangilash</button>
            </div>

            <div class="card">
                <h2>➕ Yangi Obyekt Qo'shish</h2>
                <div class="form-group">
                    <label>Obyekt turi:</label>
                    <select id="newObjectType">
                        <option value="product">Mahsulot</option>
                        <option value="customer">Mijoz</option>
                        <option value="supplier">Yetkazib beruvchi</option>
                        <option value="employee">Xodim</option>
                        <option value="warehouse">Ombor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nomi:</label>
                    <input type="text" id="newObjectName" placeholder="Obyekt nomi...">
                </div>
                <div class="form-group">
                    <label>Kodi:</label>
                    <input type="text" id="newObjectCode" placeholder="Obyekt kodi...">
                </div>
                <button class="btn btn-success" onclick="createObject()">➕ Qo'shish</button>
            </div>

            <div class="card">
                <h2>📂 Kategoriyalar</h2>
                <div class="object-type-tabs">
                    <button class="tab-button active" onclick="loadCategories('product_category')">Mahsulotlar</button>
                    <button class="tab-button" onclick="loadCategories('customer_group')">Mijozlar</button>
                    <button class="tab-button" onclick="loadCategories('supplier_group')">Yetkazib beruvchilar</button>
                    <button class="tab-button" onclick="loadCategories('expense_category')">Xarajatlar</button>
                </div>
                <div id="categoriesList"></div>
                <button class="btn btn-warning" onclick="showCategoryModal()">➕ Kategoriya qo'shish</button>
            </div>
        </div>

        <div class="card">
            <h2>📋 Obyektlar Ro'yxati</h2>
            <div class="object-type-tabs">
                <button class="tab-button active" onclick="loadObjects('products')">Mahsulotlar</button>
                <button class="tab-button" onclick="loadObjects('customers')">Mijozlar</button>
                <button class="tab-button" onclick="loadObjects('suppliers')">Yetkazib beruvchilar</button>
                <button class="tab-button" onclick="loadObjects('employees')">Xodimlar</button>
                <button class="tab-button" onclick="loadObjects('warehouses')">Omborlar</button>
            </div>
            <div id="objectsList"></div>
        </div>
    </div>

    <!-- Modal for Category Creation -->
    <div id="categoryModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeCategoryModal()">&times;</span>
            <h2>➕ Yangi Kategoriya</h2>
            <div class="form-group">
                <label>Kategoriya turi:</label>
                <select id="newCategoryType">
                    <option value="product_category">Mahsulot kategoriyasi</option>
                    <option value="customer_group">Mijoz guruhi</option>
                    <option value="supplier_group">Yetkazib beruvchi guruhi</option>
                    <option value="expense_category">Xarajat kategoriyasi</option>
                </select>
            </div>
            <div class="form-group">
                <label>Nomi:</label>
                <input type="text" id="newCategoryName" placeholder="Kategoriya nomi...">
            </div>
            <div class="form-group">
                <label>Kodi:</label>
                <input type="text" id="newCategoryCode" placeholder="Kategoriya kodi...">
            </div>
            <div class="form-group">
                <label>Tavsif:</label>
                <textarea id="newCategoryDescription" placeholder="Kategoriya haqida..." rows="3"></textarea>
            </div>
            <button class="btn btn-success" onclick="createCategory()">💾 Saqlash</button>
            <button class="btn" onclick="closeCategoryModal()">❌ Bekor qilish</button>
        </div>
    </div>

    <script>
        let currentObjectType = 'products';
        let currentCategoryType = 'product_category';

        // Statistikani yangilash
        function updateStatistics() {
            fetch('/api/objects/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('productCount').textContent = data.products;
                    document.getElementById('customerCount').textContent = data.customers;
                    document.getElementById('supplierCount').textContent = data.suppliers;
                    document.getElementById('employeeCount').textContent = data.employees;
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                });
        }

        // Obyektlarni qidirish
        function searchObjects() {
            const query = document.getElementById('searchQuery').value;
            const type = document.getElementById('searchType').value;
            
            const url = new URL('/api/objects/search', window.location.origin);
            if (query) url.searchParams.set('query', query);
            if (type) url.searchParams.set('type', type);
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const resultsDiv = document.getElementById('searchResults');
                    if (data.length === 0) {
                        resultsDiv.innerHTML = '<p>❌ Hech narsa topilmadi</p>';
                    } else {
                        resultsDiv.innerHTML = \`
                            <h4>🔍 Topilgan obyektlar (\${data.length}):</h4>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Kodi</th>
                                        <th>Nomi</th>
                                        <th>Turi</th>
                                        <th>Kategoriyasi</th>
                                        <th>Holati</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${data.map(obj => \`
                                        <tr>
                                            <td>\${obj.code}</td>
                                            <td>\${obj.name}</td>
                                            <td>\${obj.type}</td>
                                            <td>\${obj.category}</td>
                                            <td>
                                                <span style="padding: 2px 6px; border-radius: 3px; background: \${
                                                    obj.status === 'active' ? '#dcfce7' : '#fee2e2'
                                                }; color: \${
                                                    obj.status === 'active' ? '#166534' : '#991b1b'
                                                };">
                                                    \${obj.status}
                                                </span>
                                            </td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        \`;
                    }
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Qidirishda xatolik yuz berdi!');
                });
        }

        // Obyektlarni yuklash
        function loadObjects(type) {
            currentObjectType = type;
            
            // Tab tugmalarini yangilash
            document.querySelectorAll('.object-type-tabs .tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            fetch(\`/api/objects/\${type}\`)
                .then(response => response.json())
                .then(data => {
                    const listDiv = document.getElementById('objectsList');
                    if (data.length === 0) {
                        listDiv.innerHTML = '<p>❌ Hech narsa topilmadi</p>';
                    } else {
                        // Har bir tur uchun maxsus jadval ko'rsatish
                        let tableHTML = '';
                        
                        switch (type) {
                            case 'products':
                                tableHTML = \`
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Kodi</th>
                                                <th>Nomi</th>
                                                <th>Kategoriyasi</th>
                                                <th>Narxi</th>
                                                <th>Soni</th>
                                                <th>Holati</th>
                                                <th>Amallar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            \${data.map(obj => \`
                                                <tr>
                                                    <td>\${obj.code}</td>
                                                    <td>\${obj.name}</td>
                                                    <td>\${obj.category}</td>
                                                    <td>\${obj.price.toLocaleString()}</td>
                                                    <td>\${obj.quantity}</td>
                                                    <td>
                                                        <span style="padding: 2px 6px; border-radius: 3px; background: \${
                                                            obj.status === 'active' ? '#dcfce7' : '#fee2e2'
                                                        }; color: \${
                                                            obj.status === 'active' ? '#166534' : '#991b1b'
                                                        };">
                                                            \${obj.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button class="btn btn-warning" onclick="editObject('\${obj.id}')">✏️ Tahrirlash</button>
                                                        <button class="btn btn-danger" onclick="deleteObject('\${obj.id}')">🗑️ O'chirish</button>
                                                    </td>
                                                </tr>
                                            \`).join('')}
                                        </tbody>
                                    </table>
                                \`;
                                break;
                                
                            case 'customers':
                                tableHTML = \`
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Kodi</th>
                                                <th>Nomi</th>
                                                <th>INN</th>
                                                <th>Telefon</th>
                                                <th>Kredit limiti</th>
                                                <th>Holati</th>
                                                <th>Amallar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            \${data.map(obj => \`
                                                <tr>
                                                    <td>\${obj.code}</td>
                                                    <td>\${obj.name}</td>
                                                    <td>\${obj.inn}</td>
                                                    <td>\${obj.phone}</td>
                                                    <td>\${obj.creditLimit.toLocaleString()}</td>
                                                    <td>
                                                        <span style="padding: 2px 6px; border-radius: 3px; background: \${
                                                            obj.status === 'active' ? '#dcfce7' : '#fee2e2'
                                                        }; color: \${
                                                            obj.status === 'active' ? '#166534' : '#991b1b'
                                                        };">
                                                            \${obj.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button class="btn btn-warning" onclick="editObject('\${obj.id}')">✏️ Tahrirlash</button>
                                                        <button class="btn btn-danger" onclick="deleteObject('\${obj.id}')">🗑️ O'chirish</button>
                                                    </td>
                                                </tr>
                                            \`).join('')}
                                        </tbody>
                                    </table>
                                \`;
                                break;
                                
                            default:
                                tableHTML = \`
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Kodi</th>
                                                <th>Nomi</th>
                                                <th>Turi</th>
                                                <th>Kategoriyasi</th>
                                                <th>Holati</th>
                                                <th>Amallar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            \${data.map(obj => \`
                                                <tr>
                                                    <td>\${obj.code}</td>
                                                    <td>\${obj.name}</td>
                                                    <td>\${obj.type}</td>
                                                    <td>\${obj.category}</td>
                                                    <td>
                                                        <span style="padding: 2px 6px; border-radius: 3px; background: \${
                                                            obj.status === 'active' ? '#dcfce7' : '#fee2e2'
                                                        }; color: \${
                                                            obj.status === 'active' ? '#166534' : '#991b1b'
                                                        };">
                                                            \${obj.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button class="btn btn-warning" onclick="editObject('\${obj.id}')">✏️ Tahrirlash</button>
                                                        <button class="btn btn-danger" onclick="deleteObject('\${obj.id}')">🗑️ O'chirish</button>
                                                    </td>
                                                </tr>
                                            \`).join('')}
                                        </tbody>
                                    </table>
                                \`;
                        }
                        
                        listDiv.innerHTML = tableHTML;
                    }
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Obyektlarni yuklashda xatolik yuz berdi!');
                });
        }

        // Kategoriyalarni yuklash
        function loadCategories(type) {
            currentCategoryType = type;
            
            // Tab tugmalarini yangilash
            document.querySelectorAll('.object-type-tabs .tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            fetch(\`/api/categories?type=\${type}\`)
                .then(response => response.json())
                .then(data => {
                    const listDiv = document.getElementById('categoriesList');
                    if (data.length === 0) {
                        listDiv.innerHTML = '<p>❌ Hech narsa topilmadi</p>';
                    } else {
                        listDiv.innerHTML = \`
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Kodi</th>
                                        <th>Nomi</th>
                                        <th>Darajasi</th>
                                        <th>Holati</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${data.map(cat => \`
                                        <tr>
                                            <td>\${cat.code}</td>
                                            <td>\${cat.name}</td>
                                            <td>\${cat.level}</td>
                                            <td>
                                                <span style="padding: 2px 6px; border-radius: 3px; background: \${
                                                    cat.status === 'active' ? '#dcfce7' : '#fee2e2'
                                                }; color: \${
                                                    cat.status === 'active' ? '#166534' : '#991b1b'
                                                };">
                                                    \${cat.status}
                                                </span>
                                            </td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        \`;
                    }
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Kategoriyalarni yuklashda xatolik yuz berdi!');
                });
        }

        // Yangi obyekt yaratish
        function createObject() {
            const type = document.getElementById('newObjectType').value;
            const name = document.getElementById('newObjectName').value;
            const code = document.getElementById('newObjectCode').value;
            
            if (!name) {
                alert('Iltimos, obyekt nomini kiriting!');
                return;
            }
            
            const objectData = {
                type: type,
                name: name,
                code: code,
                category: 'DEFAULT',
                status: 'active'
            };
            
            fetch('/api/objects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objectData)
            })
            .then(response => response.json())
            .then(data => {
                alert('✅ Obyekt muvaffaqiyatli yaratildi!');
                document.getElementById('newObjectName').value = '';
                document.getElementById('newObjectCode').value = '';
                loadObjects(currentObjectType);
                updateStatistics();
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Obyekt yaratishda xatolik yuz berdi!');
            });
        }

        // Kategoriya modal oynasini ko'rsatish
        function showCategoryModal() {
            document.getElementById('categoryModal').style.display = 'block';
        }

        // Kategoriya modal oynasini yopish
        function closeCategoryModal() {
            document.getElementById('categoryModal').style.display = 'none';
        }

        // Yangi kategoriya yaratish
        function createCategory() {
            const type = document.getElementById('newCategoryType').value;
            const name = document.getElementById('newCategoryName').value;
            const code = document.getElementById('newCategoryCode').value;
            const description = document.getElementById('newCategoryDescription').value;
            
            if (!name) {
                alert('Iltimos, kategoriya nomini kiriting!');
                return;
            }
            
            const categoryData = {
                type: type,
                name: name,
                code: code,
                description: description,
                level: 1,
                status: 'active'
            };
            
            fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            })
            .then(response => response.json())
            .then(data => {
                alert('✅ Kategoriya muvaffaqiyatli yaratildi!');
                document.getElementById('newCategoryName').value = '';
                document.getElementById('newCategoryCode').value = '';
                document.getElementById('newCategoryDescription').value = '';
                loadCategories(currentCategoryType);
                closeCategoryModal();
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Kategoriya yaratishda xatolik yuz berdi!');
            });
        }

        // Obyektni tahrirlash
        function editObject(objectId) {
            alert(\`Obyekt tahrirlashi: \${objectId}\`);
            // Bu yerda tahrirlash formasi ko'rsatilishi mumkin
        }

        // Obyektni o'chirish
        function deleteObject(objectId) {
            if (confirm('Haqiqatan ham bu obyektni o\'chirmoqchimisiz?')) {
                fetch(\`/api/objects/\${objectId}\`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('✅ Obyekt muvaffaqiyatli o\'chirildi!');
                        loadObjects(currentObjectType);
                        updateStatistics();
                    } else {
                        alert('❌ Obyektni o\'chirishda xatolik yuz berdi!');
                    }
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Obyektni o\'chirishda xatolik yuz berdi!');
                });
            }
        }

        // Sahifa yuklanganda
        document.addEventListener('DOMContentLoaded', function() {
            updateStatistics();
            loadObjects('products');
            loadCategories('product_category');
        });

        // Modal oynani yopish uchun
        window.onclick = function(event) {
            const modal = document.getElementById('categoryModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>`;
}

// Server sozlamalari
const server = http.createServer((req, res) => {
  console.log('📦 1C Objects & Categories Request:', req.method, req.url);

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
  if (cleanUrl === '/' || cleanUrl === '/objects') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateHTML());
    return;
  }

  // API endpointlar
  if (cleanUrl === '/api/objects/search') {
    const url = new URL(req.url, 'http://localhost:8088');
    const query = url.searchParams.get('query');
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    
    const results = searchObjects(query, type, category);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
    return;
  }

  if (cleanUrl === '/api/objects/stats') {
    const stats = {
      products: OBJECTS.products.length,
      customers: OBJECTS.customers.length,
      suppliers: OBJECTS.suppliers.length,
      employees: OBJECTS.employees.length,
      warehouses: OBJECTS.warehouses.length
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  if (cleanUrl.startsWith('/api/objects/')) {
    const parts = cleanUrl.split('/');
    const objectType = parts[3];
    
    if (objectType && OBJECTS[objectType]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(OBJECTS[objectType]));
      return;
    }
    
    // Maxsus obyekt ID bilan ishlash
    const objectId = parts[3];
    if (req.method === 'DELETE') {
      const deleted = deleteObject(objectId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: deleted }));
      return;
    }
  }

  if (cleanUrl === '/api/objects' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const objectData = JSON.parse(body);
        const newObject = createObject(objectData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newObject));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid object data' }));
      }
    });
    return;
  }

  if (cleanUrl === '/api/categories') {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost:8088');
      const type = url.searchParams.get('type');
      const parent = url.searchParams.get('parent');
      
      const categories = getCategories(type, parent);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(categories));
      return;
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const categoryData = JSON.parse(body);
          const newCategory = createCategory(categoryData);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newCategory));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid category data' }));
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
  console.log('📦 1C Objects & Categories Server running at http://localhost:' + PORT);
  console.log('📋 Available endpoints:');
  console.log('   GET  /api/objects/search');
  console.log('   GET  /api/objects/stats');
  console.log('   GET  /api/objects/{type}');
  console.log('   POST /api/objects');
  console.log('   DELETE /api/objects/{id}');
  console.log('   GET  /api/categories');
  console.log('   POST /api/categories');
});