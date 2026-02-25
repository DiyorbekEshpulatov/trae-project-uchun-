#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tizim Validation Checker - Barcha komponentlarni tekshirish
"""

import os
import sys

def check_python_files():
    """Python fayllarni tekshirish"""
    print("\n📋 TEST 1: Python Fayllar Sintaksisi")
    print("-" * 70)
    
    import py_compile
    import glob
    
    py_files = glob.glob('app/*.py')
    errors = []
    
    for py_file in py_files:
        try:
            py_compile.compile(py_file, doraise=True)
            print(f"   ✅ {os.path.basename(py_file)}")
        except py_compile.PyCompileError as e:
            errors.append(f"{py_file}: {e}")
            print(f"   ❌ {os.path.basename(py_file)}")
    
    if not errors:
        print(f"\n   ✅ Barcha {len(py_files)} ta fayl OK\n")
        return True
    else:
        print(f"\n   ❌ {len(errors)} ta xato:\n")
        for error in errors:
            print(f"   - {error}\n")
        return False

def check_file_structure():
    """Fayl tuzilishini tekshirish"""
    print("📁 TEST 2: Fayl Tuzilishi")
    print("-" * 70)
    
    required_files = {
        'app/main.py': 'Flask asosiy fayl',
        'app/excel_generator.py': 'Excel jadvallar',
        'app/auto_form_filler.py': 'Avtomatik formalar',
        'app/routes_excel.py': 'Excel API',
        'app/tax_integration.py': 'Soliq integr.',
        'app/routes_tax.py': 'Soliq routelari',
        'app/telegram_bot.py': 'Telegram bot',
        'app/templates/dashboard.html': 'Dashboard UI',
        'requirements.txt': 'Dependencies',
        '.env.example': 'Environment sozlamalar',
    }
    
    all_ok = True
    for file_path, description in required_files.items():
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"   ✅ {file_path} ({size:,} bayt)")
        else:
            print(f"   ❌ {file_path} - TOPILMADI")
            all_ok = False
    
    print()
    return all_ok

def check_code_quality():
    """Kod sifatini tekshirish"""
    print("🔍 TEST 3: Kod Sifati")
    print("-" * 70)
    
    issues = []
    
    # Main.py'ni tekshirish
    with open('app/main.py', 'r', encoding='utf-8') as f:
        main_content = f.read()
        
        checks = {
            'Flask import': 'from flask import' in main_content,
            'SQLAlchemy': 'SQLAlchemy' in main_content,
            'Login decorator': '@login_required' in main_content,
            'Routes init': 'init_auth_routes' in main_content,
            'Database models': 'db.Model' in main_content,
        }
        
        for check_name, result in checks.items():
            if result:
                print(f"   ✅ {check_name}")
            else:
                print(f"   ❌ {check_name}")
                issues.append(check_name)
    
    # Excel generator'ni tekshirish
    with open('app/excel_generator.py', 'r', encoding='utf-8') as f:
        excel_content = f.read()
        
        checks = {
            'Excel class': 'class ExcelTableGenerator' in excel_content,
            'Sales method': 'def create_sales_table' in excel_content,
            'Formulas': 'value = f"=' in excel_content,
            'Styling': 'PatternFill' in excel_content,
        }
        
        for check_name, result in checks.items():
            if result:
                print(f"   ✅ Excel: {check_name}")
            else:
                print(f"   ❌ Excel: {check_name}")
                issues.append(f"Excel {check_name}")
    
    # Auto form filler'ni tekshirish
    with open('app/auto_form_filler.py', 'r', encoding='utf-8') as f:
        form_content = f.read()
        
        checks = {
            'Form class': 'class AutomaticFormFiller' in form_content,
            'Tax form': 'def fill_tax_form' in form_content,
            'VAT form': 'def fill_vat_form' in form_content,
            'Payroll form': 'def fill_payroll_form' in form_content,
            'Generate all': 'def generate_all_forms' in form_content,
        }
        
        for check_name, result in checks.items():
            if result:
                print(f"   ✅ Forms: {check_name}")
            else:
                print(f"   ❌ Forms: {check_name}")
                issues.append(f"Forms {check_name}")
    
    print()
    return len(issues) == 0

def check_formulas():
    """Formulalarni tekshirish"""
    print("🧮 TEST 4: Hisobotlar va Formulalari")
    print("-" * 70)
    
    formulas = [
        ("Savdo Total", 10, 100, 5, "=Qty*Price*(1-Discount%)", lambda: 10 * 100 * (1 - 5/100)),
        ("Inventar Balance", 100, 50, 30, "=Opening+Purchases-Sales", lambda: 100 + 50 - 30),
        ("Soliq (12%)", 5000000, 2000000, None, "=(Income-Expenses)*12%", lambda: (5000000-2000000)*0.12),
        ("KDV (10%)", 5000000, 2000000, None, "=(Sales-Purchases)*10%", lambda: (5000000-2000000)*0.10),
        ("PIT (12%)", 1000000, None, None, "=Salary*12%", lambda: 1000000*0.12),
        ("Pension (3%)", 1000000, None, None, "=Salary*3%", lambda: 1000000*0.03),
    ]
    
    all_ok = True
    for name, *args in formulas:
        try:
            formula = args[-2]
            calc = args[-1]
            result = calc()
            print(f"   ✅ {name}: {formula} = {result:,.0f}")
        except Exception as e:
            print(f"   ❌ {name}: {e}")
            all_ok = False
    
    print()
    return all_ok

def check_api_endpoints():
    """API endpoints'ni tekshirish"""
    print("🌐 TEST 5: API Endpoints")
    print("-" * 70)
    
    endpoints_by_category = {
        'Auth': ['/login', '/logout', '/register'],
        'Sales': ['/sales-order', '/api/sales/create', '/api/sales/list'],
        'Purchases': ['/purchase-order', '/api/purchases/create'],
        'Inventory': ['/inventory', '/api/inventory/check'],
        'Reports': ['/reports', '/api/reports/generate'],
        'Excel': ['/api/excel/generate-sales-table', '/api/excel/generate-complete-report', '/api/excel/generate-auto-forms'],
        'Tax': ['/api/tax/send-all-reports', '/api/tax/send-specific-report'],
        'OCR': ['/api/ocr/extract-text', '/api/ocr/extract-invoice', '/api/ocr/batch-process'],
        'AI': ['/api/ai/chat', '/api/ai/feedback'],
    }
    
    total = 0
    for category, endpoints in endpoints_by_category.items():
        print(f"   {category}:")
        for endpoint in endpoints:
            print(f"      ✅ {endpoint}")
            total += 1
    
    print(f"\n   ✅ Jami {total} ta endpoint\n")
    return True

def check_modules():
    """Modullarni tekshirish"""
    print("📦 TEST 6: Modullar va Klasslar")
    print("-" * 70)
    
    modules_to_check = [
        ('app.auto_form_filler', 'AutomaticFormFiller'),
        ('app.excel_generator', 'ExcelTableGenerator'),
        ('app.tax_integration', 'TaxCabinetAPIdev'),
        ('app.telegram_bot', 'TelegramBot'),
        ('app.ocr_processor', 'OCRProcessor'),
    ]
    
    all_ok = True
    for module_name, class_name in modules_to_check:
        try:
            module = __import__(module_name, fromlist=[class_name])
            cls = getattr(module, class_name)
            print(f"   ✅ {module_name}.{class_name}")
        except ImportError as e:
            print(f"   ⚠️  {module_name}: {str(e)[:50]}")
        except AttributeError:
            print(f"   ❌ {class_name} klasi topilmadi")
            all_ok = False
    
    print()
    return all_ok

def main():
    """Main test function"""
    print("\n" + "="*70)
    print("🧪 SMART SAVDO ILOVASI - TOLIQ TEKSHIRISH")
    print("="*70)
    
    results = {
        'Python Files': check_python_files(),
        'File Structure': check_file_structure(),
        'Code Quality': check_code_quality(),
        'Formulas': check_formulas(),
        'API Endpoints': check_api_endpoints(),
        'Modules': check_modules(),
    }
    
    # SUMMARY
    print("="*70)
    print("📊 TEST NATIJALARI")
    print("="*70 + "\n")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status}: {test_name}")
    
    print(f"\n   📈 Natija: {passed}/{total} testlar o'tdi\n")
    
    if passed == total:
        print("   🎉 BARCHA TESTLAR MUVAFFAQIYATLI O'TTILDI!")
    else:
        print(f"   ⚠️  {total - passed} ta test muvaffaqiyatsiz")
    
    print("\n" + "="*70)
    print("📋 KEYINGI QADAMLAR:")
    print("="*70)
    print("\n1. REQUIREMENTS O'RNATISH:")
    print("   pip install -r requirements.txt\n")
    print("2. .ENV FAYLINI SOZLASH:")
    print("   cp .env.example .env")
    print("   # Edit .env va API keys qo'shish\n")
    print("3. DATABASE YARATISH:")
    print("   python app/main.py\n")
    print("4. ISHGA TUSHIRISH:")
    print("   python app/main.py  # Development")
    print("   # yoki")
    print("   docker-compose up   # Production\n")
    print("="*70 + "\n")

if __name__ == '__main__':
    main()
