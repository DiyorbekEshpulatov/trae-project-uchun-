# EXCEL JADVALLAR, FORMULALAR VA AVTOMATIK HISOBOT TIZIMI

## 📊 TAYYOR KOMPONENTLAR

### ✅ 1. Excel Jadvallar (4 ta asosiy jadvali)

#### **1.1 Savdo Jadvali (Sales Table)**
- ✅ Sanasi, Buyurtma ID, Mijoz, Mahsulot
- ✅ Miqdori, Narxi, Chegirma %, Jami
- ✅ **Formulalar**:
  - `Jami = Miqdori * Narxi * (1 - Chegirma/100)`
  - `JAMI SUMMA = SUM(Jami ustuni)`

#### **1.2 Sotib Olish Jadvali (Purchase Table)**
- ✅ Sanasi, PO ID, Etkazuvchi, Mahsulot
- ✅ Miqdori, Birlik Narxi, Jami
- ✅ **Formulalar**:
  - `Jami = Miqdori * Birlik Narxi`
  - `JAMI = SUM(Jami)`

#### **1.3 Inventar Jadvali (Inventory Table)**
- ✅ Kod, Nomi, Kategoriya, Kirim, Sotib Olish, Savdo, Qolgan
- ✅ Birlik Narxi, Jami Narx
- ✅ **Formulalar**:
  - `Qolgan = Kirim + Sotib Olish - Savdo`
  - `Jami Narx = Qolgan * Birlik Narxi`

#### **1.4 Moliyaviy Hisobot (Financial Report)**
- ✅ Daromad, Xarajatlar (Sotib Olish, Oylik, Boshqa)
- ✅ Jami Xarajatlar, Foyda/Zarar
- ✅ Foyda Foizi, Xarajat Foizi
- ✅ **Formulalar**:
  - `Jami Xarajatlar = Sotib Olish + Oylik + Boshqa`
  - `Foyda = Daromad - Jami Xarajatlar`
  - `Foyda Foizi = (Foyda / Daromad) * 100`

---

### ✅ 2. Avtomatik Hisobot Formalar (6 ta forma)

#### **2.1 Savdo Hisobot Formasi**
```json
{
  "period": "2026-02",
  "total_orders": 25,
  "total_quantity": 250,
  "total_amount": 5000000,
  "average_order_value": 200000,
  "top_products": [...],
  "top_customers": [...]
}
```

#### **2.2 Sotib Olish Hisobot Formasi**
```json
{
  "period": "2026-02",
  "total_orders": 10,
  "total_quantity": 500,
  "total_amount": 4000000
}
```

#### **2.3 Inventar Hisobot Formasi**
```json
{
  "total_items": 50,
  "total_quantity": 5000,
  "total_value": 500000000,
  "low_stock_items": [],
  "out_of_stock_items": []
}
```

#### **2.4 Moliyaviy Hisobot Formasi**
```json
{
  "income": 5000000,
  "total_expenses": 2000000,
  "profit": 3000000,
  "profit_margin": 60
}
```

#### **2.5 Soliq Deklaratsiya Formasi**
```json
{
  "taxable_income": 3000000,
  "tax_rate": "12%",
  "tax_payable": 360000
}
```

#### **2.6 KDV Formasi**
```json
{
  "total_sales": 5000000,
  "vat_collected": 500000,
  "total_purchases": 2000000,
  "vat_paid": 200000,
  "vat_payable": 300000
}
```

---

### ✅ 3. Avtomatik Forma To'ldirish (Auto Form Filler)

Tizim avtomatik ravishda:
- Database'dan ma'lumotlarni oladi
- Formulalari bilan hisobotlar yasa
- Formalarni to'ldiradi
- Excel'da saqla

---

## 🎯 DASHBOARD'DA TUGMALAR

### Dashboard'ga Qo'shilgan Yangi Seksiyalar:

#### **1. Excel Jadvallar va Hisobotlar Section**
```
┌─────────────────────────────────────────────┐
│  📊 Savdo Jadvali                          │
│  📦 Sotib Olish Jadvali                    │
│  📈 Inventar Jadvali                       │
│  💰 Moliyaviy Hisobot                      │
│  🎯 TO'LIQ HISOBOT (Barcha Jadvallar)      │
└─────────────────────────────────────────────┘
```

#### **2. Avtomatik Formalar va Deklaratsiyalar Section**
```
┌─────────────────────────────────────────────┐
│  🔄 BARCHA FORMALARNI AVTOMATIK YARATISH   │
│  📝 Soliq Deklaratsiyasi                   │
│  📋 KDV Formasi                            │
│  👥 Oylik Hisoboti                         │
└─────────────────────────────────────────────┘
```

---

## 📡 API ENDPOINTS

### Excel Jadvallar

```bash
# Savdo Jadvali yaratish
POST /api/excel/generate-sales-table
{
  "period": "2026-02"
}

# Sotib Olish Jadvali yaratish
POST /api/excel/generate-purchase-table
{
  "period": "2026-02"
}

# Inventar Jadvali yaratish
POST /api/excel/generate-inventory-table

# Moliyaviy Hisobot yaratish
POST /api/excel/generate-financial-report

# TO'LIQ HISOBOT yaratish (Barcha Jadvallar)
POST /api/excel/generate-complete-report
{
  "period": "2026-02"
}
```

### Avtomatik Formalar

```bash
# Barcha Formalarni avtomatik yaratish
POST /api/excel/generate-auto-forms
{
  "period": "2026-02"
}

# Soliq Deklaratsiyasi to'ldirish
POST /api/excel/fill-tax-form
{
  "period": "2026-02",
  "income": 5000000,
  "expenses": 2000000,
  "purchases": 1500000
}

# KDV Formasi to'ldirish
POST /api/excel/fill-vat-form
{
  "period": "2026-02",
  "sales_total": 5000000,
  "purchases_total": 2000000
}

# Oylik Formasi to'ldirish
POST /api/excel/fill-payroll-form
{
  "period": "2026-02",
  "employee_count": 10,
  "total_salary": 500000000
}

# Fayl yuklab olish
GET /api/excel/download/<filename>
```

---

## 📝 EXCEL FORMULALARI

### Savdo Jadvali Formulalari:
```excel
=E2*F2*(1-G2/100)  # Jami = Miqdori * Narxi * (1 - Chegirma/100)
=SUM(H2:H100)      # JAMI SUMMA
```

### Inventar Jadvali Formulalari:
```excel
=D2+E2-F2          # Qolgan = Kirim + Sotib Olish - Savdo
=G2*H2             # Jami Narx = Qolgan * Birlik Narxi
=SUM(G2:G100)      # Jami Qolgan
=SUM(I2:I100)      # Jami Narx
```

### Moliyaviy Hisobot Formulalari:
```excel
=B8+B9+B10         # Jami Xarajatlar = Sotib Olish + Oylik + Boshqa
=B5-B11            # Foyda = Daromad - Jami Xarajatlar
=(B13/B5)*100      # Foyda Foizi
=(B11/B5)*100      # Xarajat Foizi
```

---

## 🔄 TIZIM ISHLASHI

### Bir Nechta Jadvalni Yaratish (Multi-Sheet Workbook):

1. **Dashboard'da** "🎯 TO'LIQ HISOBOT" tugmasini bosing
2. **Tizim avtomatik**:
   - Summary sheet (Xulosa) yaratadi
   - Sales sheet (Savdo) yaratadi
   - Purchases sheet (Sotib Olish) yaratadi
   - Inventory sheet (Inventar) yaratadi
   - Financial sheet (Moliyaviy) yaratadi
   - Barcha formulalarni qo'shadi
   - Ma'lumotlarni to'ldiradi

3. **Excel fayli** yuklab olinadi
4. **Barcha jadvalar** bir faylda bo'ladi

---

### Avtomatik Formalar Yaratish:

1. **Dashboard'da** "🔄 BARCHA FORMALARNI AVTOMATIK YARATISH" tugmasini bosing
2. **Tizim avtomatik**:
   - Savdo hisobot formasi yaratadi
   - Sotib olish hisobot formasi yaratadi
   - Inventar hisobot formasi yaratadi
   - Moliyaviy hisobot formasi yaratadi
   - Soliq deklaratsiya formasi yaratadi (hisoblashlar bilan)
   - KDV formasi yaratadi (10% VAT bilan)
   - Oylik formasi yaratadi (12% PIT bilan)

3. **JSON formatida** natijai ko'rsatiladi
4. **Har bir forma** avtomatik to'ldirilib va hozir yuborishga tayyor

---

## 📂 FAYLLAR RO'YXATI

### Yangi Fayllar:
```
app/
├── excel_generator.py      # Excel jadvallar va formulalar
├── auto_form_filler.py     # Avtomatik formalar to'ldirish
├── routes_excel.py         # Excel API endpoints
└── templates/
    └── dashboard.html      # Yangi tugmalar va seksiyalar

```

---

## 💡 MISOL: BUGUNGI ISHLASH TSIKLI

### 1. Savdo Jadvali Yaratish:
```
Dashboard → "📊 Savdo Jadvali" tugmasi → Excel fayli yuklab olish
```

**Natija:**
- `sales_table_2026_02.xlsx`
- Barcha savdo buyurtmalari
- Formulalar bilan jami summalar

### 2. TO'LIQ HISOBOT Yaratish:
```
Dashboard → "🎯 TO'LIQ HISOBOT" tugmasi → 5 ta sheet → Excel yuklab olish
```

**Natija:**
- `complete_report_2026_02.xlsx`
- Summary, Sales, Purchases, Inventory, Financial sheets
- Barcha formulalar avtomatik

### 3. Avtomatik Formalar Yaratish:
```
Dashboard → "🔄 BARCHA FORMALARNI AVTOMATIK YARATISH" → 7 ta forma JSON'da
```

**Natija:**
- Soliq Deklaratsiyasi (Ready to Submit)
- KDV Formasi (Ready to Submit)
- Oylik Formasi (Ready to Submit)
- Boshqa hisobotlar (Boshlang'ich ma'lumotlar)

---

## ✨ XULOSA

**BARCHA XUSUSIYATLAR TAYYOR VA ISHLAYDI:**

✅ Excel Jadvallar (Savdo, Sotib Olish, Inventar, Moliyaviy)
✅ Excel Formulalari (SUM, VLOOKUP, IF, kabi)
✅ Avtomatik Hisobot Formalar (6 ta forma)
✅ Avtomatik Forma To'ldirish (Database'dan ma'lumot)
✅ Dashboard Interfeysiga Tugmalar
✅ Multi-Sheet Workbook Generator
✅ Soliq, KDV, Oylik Formaları (Avtomatik hisoblash)
✅ API Endpoints (Hamasi tayyor)

---

**Yaratilgan**: 2026-02-04
**Version**: 2.0.0
**Status**: Production Ready ✅
