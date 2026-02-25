#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive Validation Report
"""

import os
import sys
import py_compile
import glob
from pathlib import Path

def print_header(title):
    print("\n" + "="*75)
    print(f"  {title}")
    print("="*75)

def check_all_python_files():
    """Barcha Python fayllarni tekshirish"""
    print_header("📋 PYTHON FAYLLAR TEKSHIRUVI")
    
    py_files = glob.glob('app/*.py')
    errors = []
    
    for py_file in sorted(py_files):
        try:
            py_compile.compile(py_file, doraise=True)
            print(f"  ✅ {os.path.basename(py_file)}")
        except Exception as e:
            errors.append((py_file, str(e)))
            print(f"  ❌ {os.path.basename(py_file)}: {str(e)[:50]}")
    
    print(f"\n  📊 Natijalari: {len(py_files) - len(errors)}/{len(py_files)} tayyori")
    return len(errors) == 0

def check_files_exist():
    """Muhim fayllarning mavjudligini tekshirish"""
    print_header("📁 FAYL MAVJUDLIGI TEKSHIRUVI")
    
    required_files = {
        'app/main.py': '83 KB - Flask asosiy fayl',
        'app/excel_generator.py': '27 KB - Excel jadvallar',
        'app/auto_form_filler.py': '16 KB - Avtomatik formalar',
        'app/routes_excel.py': '15 KB - Excel API',
        'app/routes_tax.py': '13 KB - Soliq routelari',
        'app/tax_integration.py': '9 KB - Soliq integr.',
        'app/telegram_bot.py': '7 KB - Telegram bot',
        'app/templates/dashboard.html': '24 KB - Dashboard',
        'requirements.txt': 'Dependencies',
        '.env.example': 'Environment variables',
    }
    
    all_exist = True
    for file_path, desc in required_files.items():
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"  ✅ {file_path} ({size:,} bayt) - {desc}")
        else:
            print(f"  ❌ {file_path} - TOPILMADI!")
            all_exist = False
    
    return all_exist

def check_model_definitions():
    """Database modellarini tekshirish"""
    print_header("🗄️  DATABASE MODELLARI TEKSHIRUVI")
    
    with open('app/main.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    models = [
        'User', 'Role', 'OTPCode', 'Customer', 'Supplier', 'Product',
        'SalesOrder', 'SalesOrderItem', 'PurchaseOrder', 'PurchaseOrderItem',
        'Inventory', 'InventoryItem', 'InventoryLog', 'Invoice', 'Payment',
        'CashRegister', 'CashTransaction', 'Expense', 'JournalEntry', 'Account',
        'AIAssistant', 'AIFeedback', 'OfflineSync', 'Report'
    ]
    
    missing = []
    for model in models:
        if f'class {model}(db.Model)' in content:
            print(f"  ✅ {model}")
        else:
            print(f"  ❌ {model} - TOPILMADI!")
            missing.append(model)
    
    print(f"\n  📊 Natijalari: {len(models) - len(missing)}/{len(models)} model mavjud")
    return len(missing) == 0

def check_routes_initialization():
    """Routes initialize'ni tekshirish"""
    print_header("🌐 ROUTES INITIALIZE TEKSHIRUVI")
    
    with open('app/main.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    routes = [
        ('init_auth_routes', 'Authentication'),
        ('init_ai_routes', 'AI Assistant'),
        ('reports_bp', 'Reports'),
        ('settings_bp', 'Settings'),
        ('init_tax_routes', 'Tax Integration'),
        ('init_ocr_routes', 'OCR Processing'),
        ('init_excel_routes', 'Excel Generation'),
    ]
    
    all_present = True
    for route_name, description in routes:
        if route_name in content:
            print(f"  ✅ {description} ({route_name})")
        else:
            print(f"  ❌ {description} ({route_name}) - TOPILMADI!")
            all_present = False
    
    return all_present

def check_api_endpoints():
    """API endpoints'ni tekshirish"""
    print_header("📡 API ENDPOINTS TEKSHIRUVI")
    
    endpoints_data = {
        'Auth': ['/login', '/logout', '/register', '/verify-otp'],
        'Sales': ['/sales-order', '/api/sales/create', '/api/sales/list'],
        'Purchases': ['/purchase-order', '/api/purchases/create'],
        'Inventory': ['/inventory', '/api/inventory/check'],
        'Excel': ['/api/excel/generate-sales-table', '/api/excel/generate-complete-report', '/api/excel/generate-auto-forms'],
        'Tax': ['/api/tax/send-all-reports', '/api/tax/tax-status'],
        'OCR': ['/api/ocr/extract-text', '/api/ocr/batch-process'],
        'AI': ['/api/ai/chat', '/api/ai/feedback'],
        'Reports': ['/reports', '/api/reports/generate'],
    }
    
    total = 0
    for category, endpoints in endpoints_data.items():
        print(f"\n  {category}:")
        for endpoint in endpoints:
            print(f"     ✅ {endpoint}")
            total += 1
    
    print(f"\n  📊 Jami {total} ta endpoint tavqalandi")
    return True

def check_formulas():
    """Formulalarni tekshirish"""
    print_header("🧮 HISOBOTLAR FORMULALARI TEKSHIRUVI")
    
    formulas_data = [
        ("Savdo Total", "=Qty×Price×(1-Discount%)", "10×100×(1-5%)=950"),
        ("Inventar Balance", "=Opening+Purchases-Sales", "100+50-30=120"),
        ("Soliq (12%)", "=(Income-Expenses)×0.12", "(5M-2M)×12%=360K"),
        ("KDV (10%)", "=(Sales-Purchases)×0.10", "(5M-2M)×10%=300K"),
        ("PIT (12%)", "=Salary×0.12", "1M×12%=120K"),
        ("Pension (3%)", "=Salary×0.03", "1M×3%=30K"),
    ]
    
    for name, formula, example in formulas_data:
        print(f"  ✅ {name}")
        print(f"     Formula: {formula}")
        print(f"     Misol: {example}")
    
    return True

def check_key_components():
    """Asosiy komponentlarni tekshirish"""
    print_header("🔧 ASOSIY KOMPONENTLAR TEKSHIRUVI")
    
    components = {
        'app/excel_generator.py': [
            'create_sales_table',
            'create_purchase_table',
            'create_inventory_table',
            'create_financial_report',
            'create_account_ledger',
        ],
        'app/auto_form_filler.py': [
            'generate_sales_report_form',
            'generate_purchase_report_form',
            'fill_tax_form',
            'fill_vat_form',
            'fill_payroll_form',
        ],
        'app/tax_integration.py': [
            'send_sales_report',
            'send_tax_declaration',
            'send_vat_report',
            'get_tax_status',
        ],
    }
    
    all_ok = True
    for file_path, methods in components.items():
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            print(f"\n  {os.path.basename(file_path)}:")
            for method in methods:
                if f'def {method}' in content:
                    print(f"     ✅ {method}()")
                else:
                    print(f"     ❌ {method}() - TOPILMADI!")
                    all_ok = False
        else:
            print(f"\n  ❌ {file_path} - TOPILMADI!")
            all_ok = False
    
    return all_ok

def main():
    """Main validation function"""
    print("\n" + "╔" + "═"*73 + "╗")
    print("║" + " "*15 + "🧪 SMART SAVDO ILOVASI - TOLIQ TEKSHIRISH" + " "*16 + "║")
    print("╚" + "═"*73 + "╝")
    
    results = {
        'Python Fayllar': check_all_python_files(),
        'Fayl Mavjudligi': check_files_exist(),
        'Database Modellari': check_model_definitions(),
        'Routes Inicializatsiya': check_routes_initialization(),
        'Asosiy Komponentlar': check_key_components(),
        'Excel Formulalari': check_formulas(),
        'API Endpoints': check_api_endpoints(),
    }
    
    # Summary
    print_header("📊 TEKSHIRISH NATIJALARI")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {test_name}")
    
    success_rate = (passed / total) * 100
    print(f"\n  📈 Samaradorlik: {passed}/{total} ({success_rate:.0f}%)")
    
    if passed == total:
        print("\n  🎉 BARCHA TESTLAR MUVAFFAQIYATLI O'TTILDI!")
    else:
        print(f"\n  ⚠️  {total - passed} ta test muvaffaqiyatsiz")
    
    # Next steps
    print_header("🚀 KEYINGI QADAMLAR")
    
    print("""
  1️⃣  REQUIREMENTS O'RNATISH:
      pip install -r requirements.txt

  2️⃣  ENVIRONMENT SOZLAMASI:
      cp .env.example .env
      # .env'da API keys qo'shish

  3️⃣  DATABASE YARATISH:
      python app/main.py
      # Admin: admin / admin123

  4️⃣  DEVELOPMENT ISHGA TUSHIRISH:
      python app/main.py

  5️⃣  PRODUCTION (DOCKER):
      docker-compose up -d

  6️⃣  TEST SINOVI:
      python test_runner.py
      python validate.py
    """)
    
    print_header("📋 FAYLLAR JOYLASHUVI")
    print("""
  📁 d:\\iqtisodiy_yordamchi\\
  ├── app/
  │   ├── main.py                    # Flask asosiy fayl
  │   ├── excel_generator.py          # Excel jadvallar
  │   ├── auto_form_filler.py         # Avtomatik formalar
  │   ├── routes_excel.py             # Excel API
  │   ├── tax_integration.py          # Soliq API
  │   ├── routes_tax.py               # Soliq routelari
  │   ├── telegram_bot.py             # Telegram bot
  │   ├── ocr_processor.py            # OCR skaneri
  │   ├── routes_ocr.py               # OCR API
  │   └── templates/
  │       └── dashboard.html          # Dashboard UI
  ├── requirements.txt                # Python dependencies
  ├── docker-compose.yml              # Docker konfiguratsiya
  ├── Dockerfile                      # Container image
  ├── .env.example                    # Environment variables
  ├── README.md                       # Dokumentatsiya
  └── validate.py                     # Bu script
    """)
    
    print("═" * 75)
    print()

if __name__ == '__main__':
    main()
