// Smart Savdo Desktop App - Electron Setup (Windows, macOS, Linux)

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const Store = require('electron-store');
const i18next = require('i18next');

// ============== I18N SETUP ==============
const Backend = require('i18next-fs-backend');
const initReactI18next = require('i18next-react');

const store = new Store({
  defaults: {
    language: 'uz',
    theme: 'light',
    autoStart: false,
    apiUrl: 'http://localhost:5000',
  }
});

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: store.get('language'),
    fallbackLng: 'uz',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: path.join(__dirname, 'locales', '{{lng}}.json'),
    },
  });

// ============== TRANSLATIONS ==============
const translations = {
  uz: {
    'dashboard': 'Bosh sahifa',
    'sales': 'Savdo',
    'purchases': 'Sotib olish',
    'inventory': 'Inventar',
    'reports': 'Hisobotlar',
    'settings': 'Sozlamalar',
    'generate_sales_table': 'Savdo Jadvali Yaratish',
    'generate_purchase_table': 'Sotib Olish Jadvali Yaratish',
    'generate_inventory_table': 'Inventar Jadvali Yaratish',
    'send_tax_report': 'Soliq Hisoboti Yuborish',
    'success': 'Muvaffaqiyatli',
    'error': 'Xato',
    'offline_mode': 'Offline rejim',
  },
  ru: {
    'dashboard': 'Главная',
    'sales': 'Продажи',
    'purchases': 'Закупки',
    'inventory': 'Инвентарь',
    'reports': 'Отчеты',
    'settings': 'Настройки',
    'generate_sales_table': 'Создать таблицу продаж',
    'generate_purchase_table': 'Создать таблицу закупок',
    'generate_inventory_table': 'Создать таблицу инвентаря',
    'send_tax_report': 'Отправить налоговый отчет',
    'success': 'Успешно',
    'error': 'Ошибка',
    'offline_mode': 'Автономный режим',
  },
  en: {
    'dashboard': 'Dashboard',
    'sales': 'Sales',
    'purchases': 'Purchases',
    'inventory': 'Inventory',
    'reports': 'Reports',
    'settings': 'Settings',
    'generate_sales_table': 'Generate Sales Table',
    'generate_purchase_table': 'Generate Purchase Table',
    'generate_inventory_table': 'Generate Inventory Table',
    'send_tax_report': 'Send Tax Report',
    'success': 'Success',
    'error': 'Error',
    'offline_mode': 'Offline Mode',
  }
};

// ============== MAIN WINDOW ==============
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000'); // React dev server
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============== MENU ==============
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'Language / Til',
      submenu: [
        {
          label: "O'zbekcha",
          click: () => {
            store.set('language', 'uz');
            mainWindow.webContents.send('language-changed', 'uz');
          },
        },
        {
          label: 'Русский',
          click: () => {
            store.set('language', 'ru');
            mainWindow.webContents.send('language-changed', 'ru');
          },
        },
        {
          label: 'English',
          click: () => {
            store.set('language', 'en');
            mainWindow.webContents.send('language-changed', 'en');
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ============== APP EVENTS ==============
app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ============== IPC HANDLERS ==============

// API call handler
ipcMain.handle('api-call', async (event, { method, endpoint, data }) => {
  try {
    const apiUrl = store.get('apiUrl');
    const response = await axios({
      method,
      url: `${apiUrl}${endpoint}`,
      data,
      timeout: 10000,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get translations
ipcMain.handle('get-translations', (event, language) => {
  return translations[language] || translations['uz'];
});

// Get stored settings
ipcMain.handle('get-settings', (event) => {
  return {
    language: store.get('language'),
    theme: store.get('theme'),
    apiUrl: store.get('apiUrl'),
  };
});

// Save settings
ipcMain.handle('save-settings', (event, settings) => {
  Object.keys(settings).forEach(key => {
    store.set(key, settings[key]);
  });
  return { success: true };
});

// Get cached data
ipcMain.handle('get-cache', (event, key) => {
  return store.get(`cache.${key}`);
});

// Save cache
ipcMain.handle('save-cache', (event, key, data) => {
  store.set(`cache.${key}`, data);
  return { success: true };
});

// Export Excel
ipcMain.handle('export-excel', async (event, { type, data }) => {
  try {
    const XLSX = require('xlsx');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    const filePath = path.join(
      app.getPath('downloads'),
      `${type}_${Date.now()}.xlsx`
    );
    
    XLSX.writeFile(wb, filePath);
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ============== OFFLINE SUPPORT ==============
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
  isOnline = true;
  mainWindow.webContents.send('online-status-changed', true);
});

window.addEventListener('offline', () => {
  isOnline = false;
  mainWindow.webContents.send('online-status-changed', false);
});

// Check internet every 5 seconds
setInterval(() => {
  axios.get('http://localhost:5000/api/health')
    .then(() => {
      if (!isOnline) {
        isOnline = true;
        mainWindow.webContents.send('online-status-changed', true);
      }
    })
    .catch(() => {
      if (isOnline) {
        isOnline = false;
        mainWindow.webContents.send('online-status-changed', false);
      }
    });
}, 5000);
