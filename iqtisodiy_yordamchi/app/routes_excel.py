#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Excel Hisobotlari uchun Routes
Jadvallar, formulalar, avtomatik formalar va hisobotlar
"""

from flask import Blueprint, request, jsonify, session, send_file
from datetime import datetime
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_excel_routes(app, db, User, SalesOrder, Customer, Product, login_required):
    """Excel routes-ni qayd qilish"""
    
    excel_bp = Blueprint('excel', __name__, url_prefix='/api/excel')
    
    from app.excel_generator import ExcelTableGenerator
    from app.auto_form_filler import AutomaticFormFiller
    
    @excel_bp.route('/generate-sales-table', methods=['POST'])
    @login_required
    def generate_sales_table():
        """
        Savdo jadvalini yaratish
        
        Request body:
        {
            "period": "2026-02",
            "include_details": true
        }
        """
        try:
            user = db.session.query(User).filter_by(id=session['user_id']).first()
            if not user:
                return jsonify({'error': 'Foydalanuvchi topilmadi'}), 401
            
            data = request.get_json()
            period = data.get('period', datetime.now().strftime('%Y-%m'))
            
            # Sample sales data
            sales_data = [
                {
                    'date': '2026-02-01',
                    'order_id': 'ORD-001',
                    'customer': 'ABC Corp',
                    'product': 'Mahsulot 1',
                    'quantity': 10,
                    'unit_price': 100000,
                    'discount': 5,
                    'total': 950000
                },
                {
                    'date': '2026-02-02',
                    'order_id': 'ORD-002',
                    'customer': 'XYZ LLC',
                    'product': 'Mahsulot 2',
                    'quantity': 5,
                    'unit_price': 150000,
                    'discount': 0,
                    'total': 750000
                }
            ]
            
            generator = ExcelTableGenerator()
            output_file = f"reports/sales_table_{period.replace('-', '_')}.xlsx"
            os.makedirs('reports', exist_ok=True)
            
            result = generator.create_sales_table(sales_data, output_file)
            
            if result['success']:
                return jsonify({
                    'success': True,
                    'file': output_file,
                    'message': 'Savdo jadvali muvaffaqiyatli yaratildi',
                    'download_url': f'/api/excel/download/{output_file}'
                }), 200
            else:
                return jsonify(result), 500
        
        except Exception as e:
            logger.error(f"Savdo jadvali yaratishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/generate-purchase-table', methods=['POST'])
    @login_required
    def generate_purchase_table():
        """Sotib olish jadvalini yaratish"""
        try:
            data = request.get_json()
            period = data.get('period', datetime.now().strftime('%Y-%m'))
            
            # Sample purchase data
            purchase_data = [
                {
                    'date': '2026-02-01',
                    'po_id': 'PO-001',
                    'supplier': 'Supplier A',
                    'product': 'Mahsulot X',
                    'quantity': 50,
                    'unit_price': 80000,
                    'total': 4000000
                }
            ]
            
            generator = ExcelTableGenerator()
            output_file = f"reports/purchase_table_{period.replace('-', '_')}.xlsx"
            os.makedirs('reports', exist_ok=True)
            
            result = generator.create_purchase_table(purchase_data, output_file)
            
            return jsonify(result) if result['success'] else jsonify(result), 200 if result['success'] else 500
        
        except Exception as e:
            logger.error(f"Sotib olish jadvali yaratishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/generate-inventory-table', methods=['POST'])
    @login_required
    def generate_inventory_table():
        """Inventar jadvalini yaratish"""
        try:
            data = request.get_json()
            
            # Sample inventory data
            inventory_data = [
                {
                    'code': 'P001',
                    'name': 'Mahsulot 1',
                    'category': 'Kategoriya A',
                    'opening_stock': 100,
                    'purchase': 50,
                    'sales': 30,
                    'closing_stock': 120,
                    'unit_cost': 100000
                }
            ]
            
            generator = ExcelTableGenerator()
            output_file = f"reports/inventory_table_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            os.makedirs('reports', exist_ok=True)
            
            result = generator.create_inventory_table(inventory_data, output_file)
            
            return jsonify(result) if result['success'] else jsonify(result), 200 if result['success'] else 500
        
        except Exception as e:
            logger.error(f"Inventar jadvali yaratishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/generate-financial-report', methods=['POST'])
    @login_required
    def generate_financial_report():
        """Moliyaviy hisobotni yaratish"""
        try:
            user = db.session.query(User).filter_by(id=session['user_id']).first()
            if not user or user.role.name not in ['admin', 'manager']:
                return jsonify({'error': 'Huquq yo\'q'}), 403
            
            data = request.get_json()
            
            # Sample financial data
            financial_data = {
                'income': 5000000,
                'expenses': 2000000,
                'purchases': 1500000,
                'salary': 500000
            }
            
            generator = ExcelTableGenerator()
            output_file = f"reports/financial_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            os.makedirs('reports', exist_ok=True)
            
            result = generator.create_financial_report(financial_data, output_file)
            
            return jsonify(result) if result['success'] else jsonify(result), 200 if result['success'] else 500
        
        except Exception as e:
            logger.error(f"Moliyaviy hisobot yaratishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/generate-complete-report', methods=['POST'])
    @login_required
    def generate_complete_report():
        """
        To'liq hisobotni yaratish (Savdo, Sotib olish, Inventar, Moliyaviy)
        
        Request body:
        {
            "period": "2026-02"
        }
        """
        try:
            user = db.session.query(User).filter_by(id=session['user_id']).first()
            if not user or user.role.name not in ['admin', 'manager']:
                return jsonify({'error': 'Huquq yo\'q'}), 403
            
            data = request.get_json()
            period = data.get('period', datetime.now().strftime('%Y-%m'))
            
            # Sample data for all sheets
            data_dict = {
                'sales': [
                    {
                        'date': '2026-02-01',
                        'order_id': 'ORD-001',
                        'customer': 'ABC Corp',
                        'product': 'Product 1',
                        'quantity': 10,
                        'unit_price': 100000,
                        'total': 1000000
                    }
                ],
                'purchases': [
                    {
                        'date': '2026-02-01',
                        'po_id': 'PO-001',
                        'supplier': 'Supplier A',
                        'product': 'Product X',
                        'quantity': 50,
                        'unit_price': 80000,
                        'total': 4000000
                    }
                ],
                'inventory': [
                    {
                        'code': 'P001',
                        'name': 'Product 1',
                        'category': 'Category A',
                        'opening_stock': 100,
                        'purchase': 50,
                        'sales': 30,
                        'unit_cost': 100000
                    }
                ],
                'financial': {
                    'income': 5000000,
                    'expenses': 2000000,
                    'purchases': 1500000,
                    'salary': 500000,
                    'profit': 3000000
                }
            }
            
            generator = ExcelTableGenerator()
            output_file = f"reports/complete_report_{period.replace('-', '_')}.xlsx"
            os.makedirs('reports', exist_ok=True)
            
            result = generator.create_multi_sheet_workbook(data_dict, output_file)
            
            if result['success']:
                return jsonify({
                    'success': True,
                    'file': output_file,
                    'sheets': result['sheets'],
                    'message': 'To\'liq hisobot muvaffaqiyatli yaratildi',
                    'download_url': f'/api/excel/download/{output_file}'
                }), 200
            else:
                return jsonify(result), 500
        
        except Exception as e:
            logger.error(f"To'liq hisobot yaratishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/generate-auto-forms', methods=['POST'])
    @login_required
    def generate_auto_forms():
        """
        Avtomatik formalarni yaratish (Savdo, Sotib olish, Inventar, Moliyaviy, Soliq, KDV, Oylik)
        
        Request body:
        {
            "period": "2026-02",
            "include_tax_forms": true
        }
        """
        try:
            user = db.session.query(User).filter_by(id=session['user_id']).first()
            if not user or user.role.name not in ['admin', 'manager']:
                return jsonify({'error': 'Huquq yo\'q'}), 403
            
            data = request.get_json()
            period = data.get('period', datetime.now().strftime('%Y-%m'))
            
            filler = AutomaticFormFiller(db)
            
            company_data = {
                'employee_count': 10,
                'company_name': 'Kompaniya Nomi'
            }
            
            result = filler.generate_all_forms(period, db.session, company_data)
            
            logger.info(f"Avtomatik formalar yaratildi: {period}")
            
            return jsonify(result), 200 if result['success'] else 500
        
        except Exception as e:
            logger.error(f"Avtomatik formalar yaratishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/fill-tax-form', methods=['POST'])
    @login_required
    def fill_tax_form():
        """Soliq deklaratsiya formasi to'ldirish"""
        try:
            user = db.session.query(User).filter_by(id=session['user_id']).first()
            if not user or user.role.name != 'admin':
                return jsonify({'error': 'Admin huquqi kerak'}), 403
            
            data = request.get_json()
            period = data.get('period', datetime.now().strftime('%Y-%m'))
            
            financial_data = {
                'income': data.get('income', 0),
                'expenses': data.get('expenses', 0),
                'purchases': data.get('purchases', 0)
            }
            
            filler = AutomaticFormFiller(db)
            result = filler.fill_tax_form(period, financial_data)
            
            return jsonify(result), 200 if result['success'] else 500
        
        except Exception as e:
            logger.error(f"Soliq formasi to'ldirishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/fill-vat-form', methods=['POST'])
    @login_required
    def fill_vat_form():
        """KDV formasi to'ldirish"""
        try:
            user = db.session.query(User).filter_by(id=session['user_id']).first()
            if not user or user.role.name != 'admin':
                return jsonify({'error': 'Admin huquqi kerak'}), 403
            
            data = request.get_json()
            period = data.get('period', datetime.now().strftime('%Y-%m'))
            
            filler = AutomaticFormFiller(db)
            result = filler.fill_vat_form(
                period,
                data.get('sales_total', 0),
                data.get('purchases_total', 0)
            )
            
            return jsonify(result), 200 if result['success'] else 500
        
        except Exception as e:
            logger.error(f"KDV formasi to'ldirishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/fill-payroll-form', methods=['POST'])
    @login_required
    def fill_payroll_form():
        """Oylik formasi to'ldirish"""
        try:
            user = db.session.query(User).filter_by(id=session['user_id']).first()
            if not user or user.role.name != 'admin':
                return jsonify({'error': 'Admin huquqi kerak'}), 403
            
            data = request.get_json()
            period = data.get('period', datetime.now().strftime('%Y-%m'))
            
            filler = AutomaticFormFiller(db)
            result = filler.fill_payroll_form(
                period,
                data.get('employee_count', 0),
                data.get('total_salary', 0)
            )
            
            return jsonify(result), 200 if result['success'] else 500
        
        except Exception as e:
            logger.error(f"Oylik formasi to'ldirishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    @excel_bp.route('/download/<path:filename>', methods=['GET'])
    @login_required
    def download_file(filename):
        """Fayl yuklab olish"""
        try:
            file_path = filename
            
            if os.path.exists(file_path):
                return send_file(file_path, as_attachment=True)
            else:
                return jsonify({'error': 'Fayl topilmadi'}), 404
        
        except Exception as e:
            logger.error(f"Fayl yuklab olishda xato: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    app.register_blueprint(excel_bp)
    return excel_bp
