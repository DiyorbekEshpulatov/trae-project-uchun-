# SMART SAVDO ILOVASI - To'liq ERP Tizimi

**Ishlab chiqildi:** 2026-yil Fevrali

## �️ Texnologik Stek

### **Backend**
- **Framework:** Flask (Python 3.11)
- **Database:** PostgreSQL (produksiya) / SQLite (development)
- **ORM:** SQLAlchemy + Flask-SQLAlchemy
- **Async:** Celery + Redis
- **AI:** OpenAI GPT-4 API
- **Validation:** jsonschema
- **Export:** openpyxl (Excel), reportlab (PDF)

### **Frontend**
- **UI:** HTML5, CSS3, JavaScript
- **Charts:** Chart.js
- **Responsive:** Bootstrap

### **DevOps**
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Web Server:** Gunicorn (production)

## 🔗 Integratsiyalar

Tizim quyidagi tashqi integratsiyalarni qo'llab-quvvatlaydi yoki ularga osongina ulanishi mumkin:

- **Telegram**: Bot webhook (`/api/integrations/telegram/webhook`) orqali xabarlar qabul qilinadi va sozlangan bo'lsa avtomatik javob yuboradi. Sozlash uchun `.env` fayliga `TELEGRAM_BOT_TOKEN` qo'shing.
- **To'lov tizimlari (Payments)**: To'lov gateway callback'larini `/api/integrations/payments/notify` orqali qabul qilib, `Payment` jadvalida saqlaydi. Endpoin't `X-API-KEY` bilan himoyalangan.
- **Mobile Push (FCM/APNs)**: `/api/integrations/mobile/push` stub endpoint orqali push yuborish integratsiyasini qo'llab-quvvatlaydi (hozircha stub/log). FCM yoki APNs integratsiyasini qo'shish tavsiya etiladi.
- **API**: Tashqi tizimlar uchun `X-API-KEY` asosida API kalitlari orqali autentifikatsiya (`API_KEYS` muhit o'zgaruvchisi bilan sozlanadi).
- **Real-time**: Oddiy development SSE stream `/api/realtime/stream` va `/api/realtime/publish` endpointlari orqali real-time hodisalarni olish va yuborish mumkin. Production uchun Socket.IO yoki message broker (Redis, RabbitMQ) taklif etiladi.

## �📋 Tavsifi
SMART SAVDO ILOVASI - zamonaviy, multi-platform ERP (Enterprise Resource Planning) tizimi. Sotuvlar, sotib olish, inventarizatsiya, bухgалтерия va kassa operatsiyalarini boshqarish uchun mo'ljallangan.

## 🌟 Asosiy Xususiyatlar

### 1. **Multi-Platform Support**
- ✅ Windows (Desktop)
- ✅ Android (Mobile)
- ✅ iOS (Mobile)

### 2. **Xavfsizlik**
- 🔐 OTP (One-Time Password) autentifikatsiya
- 🔐 SMS orqali kod yuborish
- 👤 Role-based Access Control (RBAC)
- 👤 Foydalanuvchi ruxsatnomalarini boshqarish

### 3. **Offline Rejim**
- 📱 Internet yo'qligida ishlash
- 📱 Avtomatik sinxronizatsiya
- 📱 Role asosida ma'lumotlarni filtrash

### 4. **AI Yordamchi**
- 🤖 Savol-Javob (Q&A) sistema
- 🤖 Biznes tavsiyalari
- 🤖 Tahlil va prognozlar
- 🤖 Feedback tizimi

### 5. **Hisobotlar va Export**
- 📊 Excel formatda export
- 📊 PDF formatda export
- 📊 CSV formatda export
- 📊 Diagrammalar va grafiklar
- 📊 Real-time ma'lumotlar

### 6. **Modullar**

#### **Savdo (Sales)**
- Sotuvlar buyurtmasi
- Hisob-fakturalar
- Mijozlar boshqarish

#### **Sotib olish (Procurement)**
- Sotib olish buyurtmasi
- Etkazuvchilar boshqarish
- Kiruvchi mahsulotlar

#### **Ombor (Inventory)**
- Mahsulot katalogi
- Qoldiq boshqarish
- Inventarizatsiya
- Minimal qoldiq warn

#### **Kassa (Cash Management)**
- Kassa operatsiyalari
- Balanslash
- Kirim/Chiqim

#### **Xarajatlar (Expenses)**
- Xarajat ro'yxati
- Kategoriya asosida tasnif
- Tasdiqlash tizimi

#### **Bухgалтерия (Accounting)**
- Journal entries
- Hisobi ledgers
- Moliyaviy hisobotlar

#### **Hisobotlar (Reports)**
- Sotuvlar hisoboti
- Sotib olish hisoboti
- Inventar hisoboti
- Moliyaviy hisobot
- Kassa oqimi

### 7. **Sozlamalar (Settings)**
- 👥 Foydalanuvchilar boshqarish
- 👥 Rollar va ruxsatnomalar
- ⚙️ Tizim sozlamalari
- ⚙️ Backup va Recovery

## 🚀 Ishni Boshlash

### Zaruriyat
- Python 3.8+
- Flask
- SQLAlchemy
- openpyxl
- reportlab

### O'rnatish

```bash
# Dependency o'rnatish
pip install -r requirements.txt

# Database yaratish
python app/main.py

# Serverni ishga tushirish
python app/main.py
```

Server quyidagi manzilanda ishga tushadi:
- **URL:** http://localhost:5000
- **API:** http://localhost:5000/api

## 📁 Loyihaning Tuzilishi

```
iqtisodiy_yordamchi/
├── app/
│   ├── main.py                 # Asosiy Flask app, modellar
│   ├── routes_auth.py          # Authentication routes
│   ├── routes_ai.py            # AI Assistant routes
│   ├── routes_reports.py       # Reports & Export routes
│   ├── routes_settings.py      # Settings & Offline routes
│   ├── routes_tax.py           # Tax Cabinet Integration routes
│   ├── tax_integration.py      # Soliq Kabenitiga Hisobotlarni Yuborish
│   ├── telegram_bot.py         # Telegram Bot Integration
│   ├── celery_tasks.py         # Asynchronous background tasks
│   └── celery_app.py           # Celery configuration
├── requirements.txt            # Python dependencies
└── README.md                   # Bu fayl
```

## 🏛️ SOLIQ KABENITIGA INTEGRATSIYA

### Vazifalar (Tasks)

ERP tizimi Uzbekiston Davlat Soliq Komitetasiga barcha hisobotlarni avtomatik yuborish imkoniyatini beradi. Bir tugma orqali quyidagi barcha hisobotlar yuboriladi:

#### **1. Savdo Hisoboti (Sales Report)**
- ✅ Barcha savdo buyurtmalarini yuborish
- ✅ Mijoz ma'lumotlari
- ✅ Mahsulot detallari va narxlari

#### **2. KDV (VAT) Hisoboti**
- ✅ Jami KDV miqdorini hisoblash
- ✅ KDV to'lamalari
- ✅ Hisob-fakturalar

#### **3. Oylik Hisoboti (Payroll)**
- ✅ Xodimlar oylik ma'lumotlari
- ✅ PIT (shaxsiy daromad solig'i)
- ✅ Hadya soliqlar va shunga o'xshash

#### **4. Soliq Deklaratsiyasi**
- ✅ Jami daromad
- ✅ Xarajatlar
- ✅ Foyda va soligiga taalluqli ma'lumotlar

### Foydalanish

#### **Dashboard dan**

1. **Hisobotni Yuborish Shaklini To'ldirish:**
   - Davriyni tanlang (masalan, "2026-02")
   - Qaysi hisobotlarni yuborish kerakligini tanlang
   - "📊 BARCHA HISOBOTLARNI YUBORISH" tugmasini bosing

2. **Avtomatik Jarayon:**
   - Tizim savdo, KDV, oylik va deklaratsiya hisobotlarini yaratadi
   - Soliq kabenitiga yuboradi
   - Natijani dashboard'da ko'rsatadi
   - Telegram bot orqali notifikatsiya yuboradi

#### **API orqali**

```bash
# Barcha hisobotlarni yuborish
POST /api/tax/send-all-reports
Content-Type: application/json

{
  "period": "2026-02",
  "include_sales": true,
  "include_vat": true,
  "include_payroll": true,
  "include_declaration": false
}

# Javob
{
  "timestamp": "2026-02-04T15:30:00",
  "period": "2026-02",
  "all_success": true,
  "reports": {
    "sales": { "success": true, "status_code": 200 },
    "vat": { "success": true, "status_code": 200 },
    "payroll": { "success": true, "status_code": 200 }
  }
}
```

#### **Celery Task orqali (Background Processing)**

```python
# Fonda hisobotlarni yuborish (long-running task)
from app.celery_tasks import send_tax_reports_async

task = send_tax_reports_async.delay(
    period='2026-02',
    include_sales=True,
    include_vat=True,
    include_payroll=True
)

# Holati tekshirish
task.status  # 'PENDING', 'PROGRESS', 'SUCCESS', 'FAILURE'
task.result  # Natija
```

### Konfiguratsiya

`.env` fayliga quyidagi parametrlarni qo'shing:

```bash
# Soliq Kabenitiga Ulanish
TAX_CABINET_URL=https://cabinet.soliq.uz/api
TAX_API_KEY=your-tax-api-key
COMPANY_TIN=123456789012
COMPANY_NAME=Kompaniya Nomi
USE_DEV_TAX_API=True  # True uchun fake API (test), False uchun haqiqiy API

# Telegram Bot (Notifikatsiyalar uchun)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Celery (Fonda ishlash uchun)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

### Telegram Notifikatsiyalari

Hisobotlar muvaffaqiyatli yuborilganda, Telegram bot sizga quyidagi xabar yuboradi:

```
📊 Oylik Soliq Xulosasi

📅 Davriy: 2026-02
💰 Savdo Jami: 5,000,000 UZS
🎯 KDV (10%): 500,000 UZS
📊 Foyda: 3,000,000 UZS
💳 Soliq: 360,000 UZS
✅ Holati: Yuborildi
```

## � HUJJATLARNI SKANERLASH (OCR)

### Vazifalar

ERP tizimi pytesseract (Tesseract-OCR) yordamida qogozi hujjatlardan matn va ma'lumotlarni avtomatik ajratib oladi:

#### **Qo'llab-quvvatlanuvchi Formatlar**
- 📷 JPG, JPEG
- 📷 PNG
- 📷 BMP
- 📄 PDF
- 📄 TIFF

#### **Xususiyatlar**
- ✅ Hisob-fakturadan avtomatik ma'lumot ajratish (raqam, sana, mijoz, summa)
- ✅ Matnni ajratib olish va saqlash
- ✅ Bir nechta hujjatlarni bir paytda qayta ishlash (batch processing)
- ✅ Excel/JSON formatida export
- ✅ Ishonchlilik foizini ko'rsatish

### Foydalanish

#### **Dashboard dan**

1. **Hisob-faktura Ajratish:**
   - Hisob-faktura rasmini tanlang
   - "📄 Hisob-fakturadan Ma'lumot Ajratish" tugmasini bosing
   - Avtomatik ma'lumotlar ajratiladi:
     - Hisob-faktura raqami
     - Sana
     - Mijoz nomi
     - Mahsulotlar ro'yxati
     - Jami summa

2. **Matnni Ajratish:**
   - Fayl tanlang
   - "📜 Matnni Ajratish" tugmasini bosing
   - Rasmdagi barcha matn ajratiladi

3. **Batch Processing:**
   - Bir nechta fayllarni tanlang
   - "📦 Bir nechta Fayllarni Yuklash" tugmasini bosing
   - Barcha fayllar bir paytda qayta ishlanadi

#### **API orqali**

```bash
# Rasmdan matn ajratish
POST /api/ocr/extract-text
Content-Type: multipart/form-data

File: invoice.jpg
lang: uzb+eng

# Javob
{
  "success": true,
  "text": "Ajratilgan matn...",
  "confidence": 0.95,
  "file": "upload_path"
}

# Hisob-fakturadan ma'lumot ajratish
POST /api/ocr/extract-invoice
Content-Type: multipart/form-data

File: invoice.jpg

# Javob
{
  "success": true,
  "data": {
    "invoice_number": "HF-2026-001",
    "invoice_date": "2026-02-04",
    "customer_name": "ABC Corp",
    "total_amount": 5000000,
    "items": [
      {
        "name": "Mahsulot 1",
        "quantity": 10,
        "price": 250000
      }
    ],
    "confidence": 0.92
  }
}

# Bir nechta hujjatlarni batch processing
POST /api/ocr/batch-process
Content-Type: multipart/form-data

Files: [invoice1.jpg, invoice2.jpg, ...]

# Javob
{
  "success": true,
  "total_processed": 5,
  "successful": 5,
  "failed": 0,
  "results": [...]
}
```

### Konfiguratsiya

**OCR ni ishga tushirish uchun Tesseract-OCR o'rnatish kerak:**

#### **Windows**
1. https://github.com/UB-Mannheim/tesseract/wiki dan yuklab oling
2. O'rnatish paytida default yo'li (`C:\Program Files (x86)\Tesseract-OCR`) dan o'z yo'lingizni tanlay olasiz
3. `.env` fayliga qo'shing:
```bash
TESSERACT_PATH=C:\Program Files (x86)\Tesseract-OCR\tesseract.exe
USE_DEV_OCR=False
```

#### **Linux (Ubuntu/Debian)**
```bash
sudo apt-get install tesseract-ocr
sudo apt-get install libtesseract-dev
```

`.env` ga:
```bash
TESSERACT_PATH=/usr/bin/tesseract
USE_DEV_OCR=False
```

#### **macOS**
```bash
brew install tesseract
```

`.env` ga:
```bash
TESSERACT_PATH=/usr/local/bin/tesseract
USE_DEV_OCR=False
```

#### **Demo Mode (Tesseract-OCR o'rnatilmaganda)**

```bash
USE_DEV_OCR=True
```

Bu holda, tizim test ma'lumotlar bilan ishga tushadi.

### Natijalarni Export Qilish

```bash
# Excel formatida
POST /api/ocr/export-results/excel
{
  "results": [...]
}

# JSON formatida
POST /api/ocr/export-results/json
{
  "results": [...]
}
```

## �🔐 Authentication

### Ro'yxatdan o'tish
```bash
POST /register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "phone": "+998901234567",
  "password": "secure_password"
}
```

### Kirish (Step 1 - Parol)
```bash
POST /login
Content-Type: application/json

{
  "username": "user123",
  "password": "secure_password"
}

# Javob: OTP kod SMS orqali yuboriladi
{
  "message": "OTP kod yuborildi",
  "user_id": 1,
  "otp_id": 5
}
```

### OTP Tasdiqlash (Step 2)
```bash
POST /verify-otp
Content-Type: application/json

{
  "user_id": 1,
  "otp_code": "123456"
}

# Javob: Kirish muvaffaqiyatli
```

## 🤖 AI Yordamchi API

### Savol Berish
```bash
GET /api/ai/ask
Content-Type: application/json

{
  "question": "Bugun necha dona mahsulot sotildi?",
  "category": "sales"
}

# Javob
{
  "question": "Bugun necha dona mahsulot sotildi?",
  "answer": "Bugun 250 dona mahsulot sotildi",
  "confidence": 0.95,
  "ai_id": 1
}
```

### Tavsiyalar Olish
```bash
GET /api/ai/recommendations
# AI tavsiyalari qaytariladi
```

### Fikr-mulohaza
```bash
POST /api/ai/feedback

{
  "ai_id": 1,
  "rating": 5,
  "comment": "Juda yaxshi javob"
}
```

## 📊 Hisobotlar va Export

### Excel Export
```bash
GET /api/reports/sales-excel?start_date=2024-01-01&end_date=2024-12-31
# Sotuvlar hisobotini Excel qilib download qiladi
```

### CSV Export
```bash
GET /api/reports/csv-export?type=sales
# CSV formatda export qiladi
```

### Diagrammalar
```bash
GET /api/reports/sales-chart?days=30
# Oxirgi 30 kunning sotuvlar diagrammasi

GET /api/reports/cash-flow-chart?days=30
# Kassa oqimining diagrammasi
```

### Umumiy Hisobot
```bash
GET /api/reports/summary
# Dashboard hisoboti
```

## 🔄 Offline Rejim

### Offline Ma'lumotlarni Olish
```bash
GET /api/offline/get-data?device_id=device123
# Offline ishlash uchun zarur ma'lumotlar qaytariladi
# (Role asosida filtrlangan)
```

### Sinxronizatsiya
```bash
POST /api/offline/sync

{
  "device_id": "device123",
  "data_snapshot": {...},
  "pending_changes": {...}
}
```

### O'zgarishlarni Jo'natish
```bash
POST /api/offline/push-changes

{
  "device_id": "device123",
  "changes": {...}
}
```

## 👥 Rollar va Ruxsatnomalar

### Mavjud Rollar
1. **Admin** - Butun tizimga kirish
2. **Manager** - Barcha modullarni boshqarish
3. **Cashier** - Kassa operatsiyalari
4. **Warehouse** - Ombor operatsiyalari
5. **User** - Foydalanuvchi (Cheklangan kirish)

### Ruxsatnomalar
```
sales: [read, create, edit, delete]
inventory: [read, create, edit, delete]
purchases: [read, create, edit, delete]
finance: [read, create, edit, delete]
reports: [read, export]
users: [read, create, edit, delete]
settings: [read, edit]
```

## 📱 REST API Endpoints

### Sotuvlar
- `POST /api/sales-orders` - Sotuvlar buyurtmasi qo'shish
- `GET /api/sales-orders` - Barcha sotuvlar
- `GET /api/sales-orders/<id>` - Bir sotuvlar
- `PUT /api/sales-orders/<id>` - Sotuvlar yangilash
- `DELETE /api/sales-orders/<id>` - Sotuvlar o'chirish

### Mahsulotlar
- `POST /api/products` - Mahsulot qo'shish
- `GET /api/products` - Barcha mahsulotlar
- `GET /api/products/<id>` - Bir mahsulot
- `PUT /api/products/<id>` - Mahsulot yangilash
- `DELETE /api/products/<id>` - Mahsulot o'chirish

### Inventarizatsiya
- `POST /api/inventory` - Inventarizatsiya yaratish
- `GET /api/inventory` - Barcha inventarizatsiyalar
- `POST /api/inventory/<id>/items` - Element qo'shish

### Kassa
- `GET /api/cash-registers` - Kasalar
- `POST /api/cash-transactions` - Operatsiya qo'shish

### Xarajatlar
- `GET /api/expenses` - Xarajat ro'yxati
- `POST /api/expenses` - Xarajat qo'shish

### Hisobotlar
- `GET /api/reports/dashboard` - Dashboard
- `GET /api/reports/sales` - Sotuvlar hisoboti
- `GET /api/reports/purchases` - Sotib olish hisoboti
- `GET /api/reports/financial` - Moliyaviy hisobot

## 🛠️ Texnologiya Stakı

- **Backend:** Flask, Python
- **Database:** SQLite (Ishlab chiqish) / PostgreSQL (Production)
- **Export:** openpyxl (Excel), reportlab (PDF)
- **Authentication:** OTP, Session Management
- **Realtime:** WebSocket (Future)
- **Cloud:** Firebase / AWS (Future)

## 📝 API So'rovlari Misolları

### Sotuvlar Buyurtmasi Qo'shish
```bash
curl -X POST http://localhost:5000/api/sales-orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "total_amount": 500000,
    "discount": 50000,
    "tax_amount": 75000,
    "status": "Yangi"
  }'
```

### Mahsulot Qo'shish
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PROD001",
    "name": "Mahsulot 1",
    "category": "Kategoriya A",
    "unit": "dona",
    "purchase_price": 10000,
    "sale_price": 15000,
    "quantity": 100,
    "minimum_quantity": 10
  }'
```

## 🐛 Troubleshooting

## 🚀 O'rnatish va Ishga Tushirish

### **Option 1: Local Development (SQLite)**
```bash
# Dependencies o'rnatish
pip install -r requirements.txt

# Enviroment variables'ni sozlash
cp .env.example .env

# Aplikatsiyani ishga tushirish
python app/main.py
```
Brauzerga kirish: `http://localhost:5000`

### **Option 2: Docker Compose (PostgreSQL + Redis)**
```bash
# Environment config
cp .env.example .env
# .env faylida OPENAI_API_KEY ni yangilang (ixtiyoriy)

# Docker containerlarni ishga tushirish
docker-compose up -d

# Database migratsiyasi
docker-compose exec web python app/main.py

# Logs ko'rish
docker-compose logs -f web
```
Brauzerga kirish: `http://localhost:5000`

### **Default Login**
- Username: `admin`
- Password: (birinchi marta register orqali yaratish kerak)

## ⚙️ Avtomatlashtirish va Prognozlash

Ushbu yangilanish rasmda ko'rsatilgan muammolarni hal qilish uchun kiritildi: qo'lda ma'lumot kiritish, xatolar, sekin qarorlar va noaniq prognozlar.

### **Ma'lumot Ingest (Avtomatik Import)**
- `/api/ingest` (POST): JSON payload qabul qiladi va ma'lumot snapshotini saqlaydi. Hujjatlarni avtomatik ingest qilish orqali qo'lda kiritishdan saqlaydi.
- `/api/ingest/async` (POST): Asinxron ingest - katta hajmda ma'lumotlar uchun

### **Validatsiya (Xatolarni Qisqartirish)**
- `/api/validate/<ingest_id>` (GET): Ingest qilingan ma'lumotlar uchun validatsiya hisobotini beradi (majburiy maydonlar, xatoliklar).
- `/api/validate-schema/<ingest_id>` (GET): JSON Schema asosida chuqur validatsiya.

### **Realtime Analytics (Real-time Ma'lumotlar)**
- `/api/analytics/realtime` (GET): So'nggi N kun ichidagi KPI'larni beradi (umumiy sotuvlar, buyurtma soni, top sotilgan mahsulotlar, ombordagi kam qoldiq ogohlantirishlari).

### **Prognozlash (Aniqroq Qarorlar)**
- `/api/forecast` (GET): Moving-average algoritmi asosida mahsulot bo'yicha talab prognozini qaytaradi.
- `/api/forecast_es` (GET): Eksponensial sillantirish (Exponential Smoothing) - aniqroq.
- `/api/forecast_hw` (GET): **Holt-Winters** algoritmi - trend va fasliy xususiyatlarni hisobga oladi.
- `/api/forecast/async` (POST): Asinxron prognozlash - katta hajmda ma'lumotlar uchun.

### **AI Assistant (Suniy Intellekt)**
- `/api/ai/ask` (GET/POST): GPT-4 asosida intellektual Q&A. OpenAI API kaliti yo'qligida fallback knowledge base ishlatiladi.
- `/dashboard`: Interactive dashboard - sales, tavsiyalar, AI chat.

### **Tavsiyalar (Avtomatsiya Sug'iyalari)**
- `/api/recommendations` (GET): Qayta zahira uchun tavsiyalar, chegirma sug'iyalari, avtomatsiya imkoniyatlari.

### **Asinxron Task Boshqarish (Async Tasks)**
- `/api/export/sales-report` (POST): Excel export asinxron.
- `/api/task/<task_id>` (GET): Task status va natijalarini kuzatish.

## 🔌 Integratsiyalar

### **OpenAI GPT-4**
AI chat yaxshilangan javoblar uchun:
1. OpenAI accountini yaratish: https://platform.openai.com
2. API key olish
3. `.env` faylida `OPENAI_API_KEY` ni sozlash

### **Redis + Celery**
Asinxron task'larni boshqarish:
```bash
# Docker orqali
docker-compose up redis

# Celery worker ishga tushirish
celery -A app.celery_app worker --loglevel=info

# Celery beat (scheduled tasks)
celery -A app.celery_app beat --loglevel=info
```

## 📊 API Misollari

### Login va OTP
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass123","email":"user@example.com","phone":"+998901234567"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass123"}' \
  -c cookies.txt

# OTP Verify
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"code":"123456"}'
```

### Ma'lumot Ingest
```bash
curl -X POST "http://localhost:5000/api/ingest?source=mobile" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "sales_orders": [
      {
        "number": "SO-001",
        "customer_id": 1,
        "order_date": "2024-02-01",
        "total_amount": 500000,
        "items": [
          {"product_id": 1, "quantity": 5, "unit_price": 100000}
        ]
      }
    ]
  }'
```

### AI Savol
```bash
curl "http://localhost:5000/api/ai/ask?question=Bugun%20necha%20dona%20sotildi" \
  -b cookies.txt
```

### Realtime Analytics
```bash
curl "http://localhost:5000/api/analytics/realtime?days=7" \
  -b cookies.txt
```

## 🐛 Troubleshooting

### Database xatoligi
```bash
# Database o'chirish va qayta yaratish
rm erp_system.db
python app/main.py
```

### OTP SMS yuborilmayapti
```
Bu joyda SMS service (Twilio, Vonage) qo'llanilishi kerak.
Hozircha console ga chiqariladi.
```

### Celery tasks ishlamayapti
```bash
# Redis ishlaydimi?
redis-cli ping  # PONG qaytarishi kerak

# Celery worker ishlaydimi?
celery -A app.celery_app inspect active
```

## 📝 Litsenziya
MIT License - Bepul ishlatish va o'zgartirish mumkin.

### Port band
```bash
# Boshqa portda ishga tushirish
python -m flask run --port 5001
```

## 📞 Qo'llab-quvvatlash

**Email:** support@smartsavdo.uz
**Hotline:** +998 (99) 123-45-67

## 📄 Litsenziya

MIT License - O'zbekiston, 2026

---

**Versiya:** 1.0.0  
**Oxirgi Yangilash:** 2026-yil Fevrali 4

