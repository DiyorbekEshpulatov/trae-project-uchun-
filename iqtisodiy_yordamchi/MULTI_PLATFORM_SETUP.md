# 🚀 MULTI-PLATFORM SETUP GUIDE

## 🌍 **SMART SAVDO 3.0 - Web, Mobile, Desktop**

**Supported Platforms:**
- ✅ Web (Flask) - Windows, macOS, Linux
- ✅ Mobile (React Native) - iOS, Android
- ✅ Desktop (Electron) - Windows, macOS, Linux
- ✅ Languages: Uzbek, Russian, English

---

## 📋 **INSTALLATION GUIDE**

### **1. WEB APP (Flask)**

#### Windows
```bash
# Clone repository
git clone https://github.com/your-repo/smart-savdo.git
cd smart-savdo

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python app/main.py

# Run development server
python app/main.py
# Visit: http://localhost:5000
```

#### macOS/Linux
```bash
# Clone repository
git clone https://github.com/your-repo/smart-savdo.git
cd smart-savdo

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python app/main.py

# Run development server
python app/main.py
# Visit: http://localhost:5000
```

### **2. MOBILE APP (React Native)**

#### Prerequisites
```bash
# Install Node.js (https://nodejs.org)
# Install Xcode (for iOS) or Android Studio

# Install Expo CLI (easiest way)
npm install -g expo-cli
```

#### Setup
```bash
cd mobile

# Install dependencies
npm install

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Or use Expo Go app (scan QR code)
npm start
```

#### Build for Production
```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

### **3. DESKTOP APP (Electron)**

#### Prerequisites
```bash
# Install Node.js
# Install Python 3.11+
# Install git
```

#### Setup
```bash
cd desktop

# Install dependencies
npm install

# Run development
npm start

# Build for Windows
npm run build:windows

# Build for macOS
npm run build:macos

# Build for Linux
npm run build:linux
```

---

## 🛠️ **STRUCTURE**

```
smart-savdo/
├── app/                      # Flask Backend
│   ├── main.py
│   ├── excel_generator.py
│   ├── auto_form_filler.py
│   ├── routes_*.py
│   ├── i18n.py              # Localization
│   └── templates/
│       └── dashboard.html
├── mobile/                   # React Native App
│   ├── App.js               # Main app
│   ├── screens/
│   ├── components/
│   ├── locales/             # Language files
│   └── package.json
├── desktop/                 # Electron App
│   ├── main.js              # Main process
│   ├── preload.js
│   ├── src/
│   ├── public/
│   └── package.json
├── requirements.txt         # Python dependencies
├── package.json            # JavaScript dependencies
└── README.md
```

---

## 🌐 **MULTI-LANGUAGE SUPPORT**

### **Web (Flask)**
```python
from app.i18n import get_text, TRANSLATIONS

# In templates
<h1>{{ get_text('dashboard', session.get('lang', 'uz')) }}</h1>

# Switch language
<a href="/api/language/uz">O'zbek</a>
<a href="/api/language/ru">Русский</a>
<a href="/api/language/en">English</a>
```

### **Mobile (React Native)**
```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <View>
      <Text>{t('dashboard')}</Text>
      <Button onPress={() => i18n.changeLanguage('uz')} />
    </View>
  );
}
```

### **Desktop (Electron)**
```javascript
const { ipcRenderer } = require('electron');

// Get translations
const translations = await ipcRenderer.invoke('get-translations', 'uz');
document.title = translations['dashboard'];

// Change language from menu
// Automatically handled in main.js
```

### **Available Languages**
- 🇺🇿 **O'zbek** (uz)
- 🇷🇺 **Русский** (ru)
- 🇬🇧 **English** (en)

---

## 🔌 **API ENDPOINTS**

### **Language Switching**
```bash
# Web
GET /api/language/<lang>
# Example: /api/language/ru

# Mobile/Desktop (via i18next)
i18n.changeLanguage('ru')
```

### **Common Endpoints**
```bash
# Both mobile and web use same API

# Sales
POST /api/sales/create
GET /api/sales/list

# Excel
POST /api/excel/generate-sales-table
POST /api/excel/generate-complete-report

# Tax
POST /api/tax/send-all-reports
GET /api/tax/tax-status

# OCR
POST /api/ocr/extract-text
POST /api/ocr/batch-process
```

---

## 💾 **OFFLINE MODE**

### **Mobile (React Native)**
```javascript
// Automatically handles offline
import NetInfo from '@react-native-community/netinfo';

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setIsOnline(state.isConnected);
  });
}, []);

// Saves data locally
await AsyncStorage.setItem('sales_data', JSON.stringify(data));

// Syncs when online
if (isOnline) {
  await api.post('/api/sales/sync', localData);
}
```

### **Desktop (Electron)**
```javascript
// Checks connection every 5 seconds
// Auto-syncs when online
// Shows offline indicator in UI
```

---

## 📦 **PRODUCTION DEPLOYMENT**

### **Web (Docker)**
```bash
# Build image
docker build -t smart-savdo .

# Run container
docker run -p 5000:5000 -e DATABASE_URL=postgresql://... smart-savdo

# Docker Compose
docker-compose up -d
```

### **Mobile**
```bash
# iOS
1. Register app on Apple Developer
2. npm run build:ios
3. Upload to TestFlight / App Store

# Android
1. Create Google Play account
2. npm run build:android
3. Upload APK/AAB to Play Store
```

### **Desktop**
```bash
# Windows (NSIS installer)
npm run make

# macOS (DMG)
npm run make

# Linux (AppImage, deb, rpm)
npm run make
```

---

## 🧪 **TESTING**

### **Web**
```bash
# Unit tests
python -m pytest tests/

# Integration tests
python -m pytest tests/ -v

# Coverage
coverage run -m pytest tests/
coverage report
```

### **Mobile**
```bash
# Unit tests
cd mobile && npm test

# E2E tests
npm run test:e2e
```

### **Desktop**
```bash
# Unit tests
cd desktop && npm test

# E2E tests
npm run test:e2e
```

---

## 🔐 **SECURITY**

### **All Platforms**
- ✅ HTTPS in production
- ✅ Bearer token authentication
- ✅ CORS enabled
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (ORM)

### **Mobile Specific**
- ✅ Certificate pinning
- ✅ Secure storage (AsyncStorage)
- ✅ Biometric authentication (optional)

### **Desktop Specific**
- ✅ Sandbox process
- ✅ Context isolation
- ✅ CSP headers
- ✅ Auto-updates (Electron Updater)

---

## 📊 **PERFORMANCE**

### **Web**
- Load time: < 2 seconds
- API response: < 500ms
- Excel generation: < 5 seconds

### **Mobile**
- App size: ~50MB
- Memory usage: ~100MB
- Startup time: < 3 seconds

### **Desktop**
- App size: ~150MB (including Electron)
- Memory usage: ~200MB
- Startup time: < 2 seconds

---

## 🐛 **TROUBLESHOOTING**

### **Web**
```bash
# Port already in use
lsof -i :5000
kill -9 <PID>

# Database connection
python app/main.py --init-db

# Clear cache
rm -rf app/__pycache__
```

### **Mobile**
```bash
# Clear cache
npx react-native start --reset-cache

# Rebuild
rm -rf node_modules
npm install

# Emulator issues
# iOS: xcrun simctl erase all
# Android: emulator -avd <name> -wipe-data
```

### **Desktop**
```bash
# Clear cache
rm -rf ~/.config/smart-savdo

# Dev tools
Ctrl+Shift+I (Windows)
Cmd+Option+I (macOS)

# Check logs
~/Applications/Smart Savdo.app/Contents/Logs
```

---

## 📞 **SUPPORT**

- 📧 Email: support@smartsavdo.uz
- 💬 Telegram: @smartsavdo
- 🌐 Website: https://smartsavdo.uz
- 📚 Docs: https://docs.smartsavdo.uz

---

## 📈 **VERSION HISTORY**

### **v3.0.0** (Current)
- ✅ Multi-platform support (Web, Mobile, Desktop)
- ✅ 3 languages (Uzbek, Russian, English)
- ✅ Offline mode
- ✅ One-click tax filing
- ✅ Professional Excel generation
- ✅ AI Assistant
- ✅ OCR Integration

### **v2.0.1**
- ✅ Web app only
- ✅ Single language (Uzbek)
- ✅ Tax integration

### **v1.0.0**
- ✅ Basic ERP

---

## 📄 **LICENSE**

MIT License - Free for personal and commercial use

---

**Last Updated:** 2026-02-04  
**Maintained By:** Smart Savdo Team  
**Status:** ✅ Active Development
