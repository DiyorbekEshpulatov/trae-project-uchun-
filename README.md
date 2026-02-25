# SmartAccounting AI - MVP Versiyasi

## Loyiha haqida
SmartAccounting AI - zamonaviy buxgalteriya va inventarizatsiya boshqaruv tizimi. Ushbu loyiha bir nechta kompaniyalarni boshqarish, mahsulotlar inventarizatsiyasi va real-time hisobotlar yaratish imkonini beradi.

## Texnologik Stack

### Backend
- **NestJS 10** - Node.js framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Ma'lumotlar bazasi
- **JWT** - Authentication
- **TypeScript** - Programming language

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Programming language
- **TailwindCSS** - CSS framework

### DevOps
- **Docker** - Containerization
- **Turborepo** - Monorepo build system
- **npm** - Package manager

## Loyiha Strukturasi

```
Fintell/
├── apps/
│   ├── api/           # NestJS backend
│   └── web/           # Next.js frontend
├── packages/
│   ├── database/      # Prisma ORM va database
│   ├── eslint-config/ # ESLint konfiguratsiyasi
│   └── ui/           # UI komponentlar
├── docker-compose.dev.yml  # Development muhit
├── docker-compose.prod.yml # Production muhit
├── turbo.json        # Turborepo konfiguratsiyasi
└── package.json      # Monorepo asosiy fayl
```

## 📖 Foydalanuvchi Qo'llanmasi

### Boshlang'ich Sozlash

1. **Login**
   - Browserda http://localhost:8080 oching
   - Email: `demo@company.com`
   - Parol: `demo123`
   - Login tugmasini bosing

2. **Dashboard**
   - Umumiy statistika ko'rish
   - Oxirgi hisobotlar
   - Tezkor harakatlar paneli

3. **Kompaniyalar**
   - Yangi kompaniya qo'shish
   - Mavjud kompaniyalar ro'yxati
   - Kompaniya ma'lumotlarini tahrirlash

4. **Mahsulotlar**
   - Mahsulot qo'shish
   - Inventarizatsiya boshqaruvi
   - Minimal miqdor sozlash

### Kundalik Foydalanish

**Mahsulot Qo'shish:**
1. "Mahsulotlar" sahifasiga o'ting
2. "Yangi Mahsulot" tugmasini bosing
3. Mahsulot ma'lumotlarini kiriting:
   - Nomi
   - Kompaniya
   - Miqdori
   - Narxi
   - Minimal miqdor
4. "Saqlash" tugmasini bosing

**Hisobot Olish:**
1. Dashboard sahifasiga o'ting
2. Kerakli hisobot turini tanlang
3. Sana oralig'ini belgilang
4. "Hisobot Yaratish" tugmasini bosing

**Kompaniya Boshqaruvi:**
1. "Kompaniyalar" sahifasiga o'ting
2. Yangi kompaniya qo'shish yoki mavjudini tahrirlash
3. Kontakt ma'lumotlarini yangilang
4. Statusni aktiv/inactive qiling

## O'rnatish va Ishga Tushurish

### Tezkor Mock Versiya (Hozir Ishlayotgan)

#### 1. Standalone Serverlarni Ishga Tushurish
```bash
# API Server (port 3001)
node standalone-api.js

# Frontend Server (port 8080) 
node standalone-server.js
```

#### 2. Browserda ochish
- Frontend: http://localhost:8080
- API: http://localhost:3001

#### To'liq Versiya (PostgreSQL + Prisma)

### Talablar
- Node.js 18+
- PostgreSQL 14+
- Docker (ixtiyoriy)

### 1. Dependency'larni o'rnatish
```bash
npm install
```

### 2. Ma'lumotlar bazasini sozlash
```bash
# Prisma client generatsiya qilish
npx prisma generate

# Ma'lumotlar bazasini yaratish
npx prisma migrate dev
```

### 3. Environment o'zgaruvchilari

#### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/smartaccounting"
JWT_SECRET="your-secret-key"
PORT=3001
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 4. Loyihani ishga tushurish

#### Development muhitida
```bash
# Barcha servislarni ishga tushurish
npm run dev

# Yoki alohida
npm run dev:api  # Backend
npm run dev:web  # Frontend
```

#### Docker orqali
```bash
docker-compose -f docker-compose.dev.yml up
```

## API Endpoint'lar

### Authentication
- `POST /auth/login` - Kirish
- `GET /auth/profile` - Profil ma'lumotlari

### Companies
- `GET /companies` - Barcha kompaniyalar
- `POST /companies` - Kompaniya yaratish
- `GET /companies/:id` - Kompaniya ma'lumotlari
- `PATCH /companies/:id` - Kompaniyani yangilash
- `DELETE /companies/:id` - Kompaniyani o'chirish

### Products
- `GET /products` - Barcha mahsulotlar
- `POST /products` - Mahsulot yaratish
- `GET /products/:id` - Mahsulot ma'lumotlari
- `PATCH /products/:id` - Mahsulotni yangilash
- `DELETE /products/:id` - Mahsulotni o'chirish

### Reports
- `GET /reports/dashboard` - Dashboard ma'lumotlari
- `GET /reports/inventory` - Inventarizatsiya hisoboti
- `GET /reports/financial` - Moliyaviy hisobot

## Frontend Sahifalari

- `/` - Bosh sahifa
- `/login` - Kirish sahifasi
- `/dashboard` - Dashboard
- `/companies` - Kompaniyalar
- `/products` - Mahsulotlar
- `/reports` - Hisobotlar

## Xususiyatlar

✅ **Authentication** - JWT asosidagi kirish tizimi
✅ **Multi-company** - Bir nechta kompaniyalarni boshqarish
✅ **Product Management** - Mahsulotlar inventarizatsiyasi
✅ **Real-time Reports** - Real-time hisobotlar va analitika
✅ **Responsive Design** - Mobil qurilmalarga moslashgan
✅ **TypeScript** - Ishonchli kod tizimi
✅ **Docker Support** - Konteynerlash muhitida ishga tushurish

## MVP Statusi

### ✅ Ishga Tushgan Funksiyalar (Mock Versiya)

**Authentication & User Management**
- ✅ Login/Authentication sistema (JWT mock)
- ✅ User session management
- ✅ Role-based access (admin/user)

**Company Management**
- ✅ Kompaniya ro'yxati
- ✅ Kompaniya ma'lumotlari
- ✅ Kompaniya holati (active/inactive)

**Product Management**
- ✅ Mahsulotlar ro'yxati
- ✅ Inventarizatsiya boshqaruvi
- ✅ Minimal miqdor monitoringi
- ✅ Narx va miqdor kiritish

**Dashboard & Analytics**
- ✅ Umumiy statistika
- ✅ Real-time hisobotlar
- ✅ Mahsulot va kompaniya soni
- ✅ Umumiy qiymat hisoboti

**Frontend Features**
- ✅ Responsive design
- ✅ Multi-page navigation
- ✅ Form validation
- ✅ Error handling

**API Integration**
- ✅ RESTful API endpoints
- ✅ CORS support
- ✅ JSON data exchange
- ✅ HTTP status codes

### 🔄 Kelayotgi Xususiyatlar

**Database Integration**
- 🔄 PostgreSQL ulanish
- 🔄 Prisma ORM integratsiyasi
- 🔄 Real database migration

**Advanced Features**
- 📊 Advanced hisobotlar va grafiklar
- 📧 Email notifications
- 📄 PDF hisobotlar generatsiyasi
- 🤖 AI asosidagi analitika
- 📱 Mobil ilova versiyasi

**DevOps & Deployment**
- 🔄 Docker containerization
- 🔄 CI/CD pipeline
- 🔄 Cloud deployment (AWS/Vercel)
- 🔄 Production monitoring

## Kelayotgi Xususiyatlar

### 📋 Development Roadmap

**Phase 1: Database Integration (1-2 hafta)**
- [ ] PostgreSQL ulanish va sozlash
- [ ] Prisma ORM to'liq integratsiyasi
- [ ] Real database migration
- [ ] User authentication haqiqiy DB bilan

**Phase 2: Advanced Features (2-3 hafta)**
- [ ] Advanced hisobotlar va grafiklar (Chart.js)
- [ ] Mahsulot kategoriyalari va filtratsiya
- [ ] Import/Export funksiyalari (Excel, CSV)
- [ ] User profile management

**Phase 3: AI & Analytics (3-4 hafta)**
- [ ] AI asosidagi analitika va prognozlar
- [ ] Smart inventory alerts
- [ ] Automatic reorder suggestions
- [ ] Trend analysis va hisobotlar

**Phase 4: Communication & Notifications (2-3 hafta)**
- [ ] Email notifications (low stock, reports)
- [ ] SMS/xabar xizmatlari
- [ ] PDF hisobotlar generatsiyasi
- [ ] Scheduled report delivery

**Phase 5: Mobile & Multi-language (3-4 hafta)**
- [ ] Mobil ilova versiyasi (React Native)
- [ ] Multi-language support (O'zbek, Rus, Ingliz)
- [ ] Offline mode va sync
- [ ] Push notifications

**Phase 6: Integration & API (2-3 hafta)**
- [ ] Third-party integrations (1C, Excel)
- [ ] REST API documentation (Swagger)
- [ ] Webhook support
- [ ] External accounting systems

**Phase 7: DevOps & Production (1-2 hafta)**
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Cloud deployment (AWS/Vercel)
- [ ] Production monitoring va logging

### 📊 Future Enhancements
- 🚀 Advanced AI analytics
- 📱 Native mobile apps (iOS/Android)
- 🔐 Advanced security features
- 📈 Business intelligence dashboard
- 🤝 Multi-user collaboration
- 🌐 API marketplace

## Kelayotgi Xususiyatlar (Original)

- 📊 Advanced hisobotlar
- 📱 Mobil ilova
- 🤖 AI asosidagi analitika
- 🌐 Multi-language support
- 📧 Email notifications
- 📄 PDF hisobotlar
- 🔗 Third-party integrations

## Qo'llab-quvvatlash

Agar muammo yuzaga kelsa yoki savollaringiz bo'lsa, iltimos issue yaratib yoki telegram orqali bog'laning.

## Litsenziya

MIT License - Bepul va ochiq manba