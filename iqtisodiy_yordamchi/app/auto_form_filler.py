#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Avtomatik Hisobot Forma To'ldirish
Hisobotlarni avtomatik yaratish va to'ldirish tizimi
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AutomaticFormFiller:
    """Hisobotlarni avtomatik yaratish va to'ldirish"""
    
    def __init__(self, db=None):
        self.db = db
    
    @staticmethod
    def generate_sales_report_form(period: str, db_session) -> Dict:
        """
        Savdo hisobot formasi yaratish va to'ldirish
        
        Args:
            period: '2026-02' format
            db_session: SQLAlchemy session
        
        Returns:
            Savdo hisoboti ma'lumotlari bilan to'ldirilgan forma
        """
        try:
            from datetime import datetime as dt
            
            start_date = datetime.strptime(f"{period}-01", "%Y-%m-%d")
            
            # End of month
            if period.endswith('-12'):
                end_date = datetime(int(period[:4]) + 1, 1, 1) - timedelta(days=1)
            else:
                next_month = int(period.split('-')[1]) + 1
                end_date = datetime(int(period[:4]), next_month, 1) - timedelta(days=1)
            
            # Database'dan savdo ma'lumotlarini olish
            # Bu yerda SalesOrder modeli ishlatiladi
            sales_orders = []
            total_sales = 0
            total_quantity = 0
            
            # Sample data (haqiqiy database bilan o'zlashtirish kerak)
            sales_data = {
                'period': period,
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'total_orders': 0,
                'total_quantity': 0,
                'total_amount': 0,
                'average_order_value': 0,
                'top_products': [],
                'top_customers': [],
                'daily_sales': [],
                'form_fields': {
                    'report_date': datetime.now().strftime('%Y-%m-%d'),
                    'reporting_period': period,
                    'report_type': 'Sales Report',
                    'total_transactions': 0,
                    'total_value': 0,
                    'currency': 'UZS'
                }
            }
            
            logger.info(f"Savdo hisobot formasi yaratildi: {period}")
            
            return {
                'success': True,
                'report_type': 'sales',
                'form_data': sales_data
            }
        except Exception as e:
            logger.error(f"Savdo hisobot formasi yaratishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}

    def generate_purchase_report_form(self, period: str, db_session) -> Dict:
        """Sotib olish hisobot formasi yaratish"""
        try:
            start_date = datetime.strptime(f"{period}-01", "%Y-%m-%d")
            
            if period.endswith('-12'):
                end_date = datetime(int(period[:4]) + 1, 1, 1) - timedelta(days=1)
            else:
                next_month = int(period.split('-')[1]) + 1
                end_date = datetime(int(period[:4]), next_month, 1) - timedelta(days=1)
            
            purchase_data = {
                'period': period,
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'total_orders': 0,
                'total_quantity': 0,
                'total_amount': 0,
                'form_fields': {
                    'report_date': datetime.now().strftime('%Y-%m-%d'),
                    'reporting_period': period,
                    'report_type': 'Purchase Report',
                    'total_transactions': 0,
                    'total_value': 0,
                    'currency': 'UZS'
                }
            }
            
            logger.info(f"Sotib olish hisobot formasi yaratildi: {period}")
            
            return {
                'success': True,
                'report_type': 'purchase',
                'form_data': purchase_data
            }
        except Exception as e:
            logger.error(f"Sotib olish hisobot formasi yaratishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}

    def generate_inventory_report_form(self, db_session) -> Dict:
        """Inventar hisobot formasi yaratish"""
        try:
            inventory_data = {
                'report_date': datetime.now().strftime('%Y-%m-%d'),
                'total_items': 0,
                'total_quantity': 0,
                'total_value': 0,
                'low_stock_items': [],
                'out_of_stock_items': [],
                'form_fields': {
                    'report_date': datetime.now().strftime('%Y-%m-%d'),
                    'report_type': 'Inventory Report',
                    'total_products': 0,
                    'categories': []
                }
            }
            
            logger.info("Inventar hisobot formasi yaratildi")
            
            return {
                'success': True,
                'report_type': 'inventory',
                'form_data': inventory_data
            }
        except Exception as e:
            logger.error(f"Inventar hisobot formasi yaratishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}

    def generate_financial_report_form(self, period: str, db_session) -> Dict:
        """Moliyaviy hisobot formasi yaratish"""
        try:
            financial_data = {
                'period': period,
                'report_date': datetime.now().strftime('%Y-%m-%d'),
                'income': 0,
                'total_expenses': 0,
                'purchases': 0,
                'salary': 0,
                'utilities': 0,
                'other_expenses': 0,
                'profit': 0,
                'profit_margin': 0,
                'form_fields': {
                    'report_date': datetime.now().strftime('%Y-%m-%d'),
                    'period': period,
                    'report_type': 'Financial Report',
                    'currency': 'UZS',
                    'accounting_method': 'Accrual'
                }
            }
            
            logger.info(f"Moliyaviy hisobot formasi yaratildi: {period}")
            
            return {
                'success': True,
                'report_type': 'financial',
                'form_data': financial_data
            }
        except Exception as e:
            logger.error(f"Moliyaviy hisobot formasi yaratishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}

    def generate_cash_flow_report_form(self, period: str, db_session) -> Dict:
        """Pul oqimi hisobot formasi yaratish"""
        try:
            cash_flow_data = {
                'period': period,
                'report_date': datetime.now().strftime('%Y-%m-%d'),
                'opening_balance': 0,
                'cash_inflows': {
                    'sales': 0,
                    'loans': 0,
                    'other': 0
                },
                'cash_outflows': {
                    'purchases': 0,
                    'salary': 0,
                    'utilities': 0,
                    'other': 0
                },
                'closing_balance': 0,
                'form_fields': {
                    'report_date': datetime.now().strftime('%Y-%m-%d'),
                    'period': period,
                    'report_type': 'Cash Flow Report'
                }
            }
            
            logger.info(f"Pul oqimi hisobot formasi yaratildi: {period}")
            
            return {
                'success': True,
                'report_type': 'cash_flow',
                'form_data': cash_flow_data
            }
        except Exception as e:
            logger.error(f"Pul oqimi hisobot formasi yaratishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}

    def fill_tax_form(self, period: str, financial_data: Dict) -> Dict:
        """Soliq deklaratsiya formasi to'ldirish"""
        try:
            tax_form = {
                'period': period,
                'submission_date': datetime.now().strftime('%Y-%m-%d'),
                'form_type': 'Monthly Tax Declaration',
                'form_number': f"TAX-{period.replace('-', '')}-001",
                'sections': {
                    'general_info': {
                        'period': period,
                        'submitted_by': 'Accounting Department',
                        'submission_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    },
                    'income_section': {
                        'gross_income': financial_data.get('income', 0),
                        'allowances': 0,
                        'total_income': financial_data.get('income', 0)
                    },
                    'deduction_section': {
                        'cost_of_goods': financial_data.get('purchases', 0),
                        'operating_expenses': financial_data.get('expenses', 0) - financial_data.get('purchases', 0),
                        'total_deductions': financial_data.get('expenses', 0)
                    },
                    'taxable_income': {
                        'taxable_income': financial_data.get('income', 0) - financial_data.get('expenses', 0),
                        'tax_rate': '12%',
                        'tax_payable': (financial_data.get('income', 0) - financial_data.get('expenses', 0)) * 0.12
                    }
                }
            }
            
            logger.info(f"Soliq formasi to'ldirildi: {period}")
            
            return {
                'success': True,
                'form_type': 'tax_declaration',
                'form_data': tax_form
            }
        except Exception as e:
            logger.error(f"Soliq formasi to'ldirishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}

    @staticmethod
    def fill_vat_form(period: str, sales_total: float, purchases_total: float) -> Dict:
        """KDV formasi to'ldirish"""
        try:
            vat_rate = 0.12  # Default 12%
            
            # SystemConfig dan QQS foizini olish
            try:
                from app.main import SystemConfig
                config = SystemConfig.query.filter_by(key='vat_rate').first()
                if config and config.value:
                    vat_rate = float(config.value) / 100
            except Exception:
                pass
            
            vat_form = {
                'period': period,
                'submission_date': datetime.now().strftime('%Y-%m-%d'),
                'form_type': 'VAT Return',
                'form_number': f"VAT-{period.replace('-', '')}-001",
                'sections': {
                    'general_info': {
                        'period': period,
                        'submitted_by': 'Finance Department',
                        'submission_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    },
                    'sales_vat': {
                        'total_sales': sales_total,
                        'vat_collected': sales_total * vat_rate,
                    'rate': f"{vat_rate * 100}%"
                },
                'purchase_vat': {
                    'total_purchases': purchases_total,
                    'vat_paid': purchases_total * vat_rate,
                    'rate': f"{vat_rate * 100}%"
                },
                'net_vat': {
                    'vat_payable': (sales_total - purchases_total) * vat_rate,
                    'status': 'Due'
                }
            }
        }
        
        logger.info(f"KDV formasi to'ldirildi: {period}")
        
        return {
            'success': True,
            'form_type': 'vat_return',
            'form_data': vat_form
        }
    except Exception as e:
        logger.error(f"KDV formasi to'ldirishda xato: {str(e)}")
        return {'success': False, 'error': str(e)}
        
        @staticmethod
        def fill_payroll_form(period: str, employee_count: int, total_salary: float) -> Dict:
    """Oylik formasi to'ldirish"""
    try:
        pit_rate = 0.12  # 12% PIT
        pension_rate = 0.03  # 3% Pension
        
        payroll_form = {
            'period': period,
            'submission_date': datetime.now().strftime('%Y-%m-%d'),
            'form_type': 'Payroll Report',
            'form_number': f"PAYROLL-{period.replace('-', '')}-001",
            'sections': {
                'employee_info': {
                    'total_employees': employee_count,
                    'report_date': datetime.now().strftime('%Y-%m-%d')
                },
                'salary_section': {
                    'gross_salary': total_salary,
                    'employee_count': employee_count,
                    'average_salary': total_salary / employee_count if employee_count > 0 else 0
                },
                'deductions': {
                    'pit_amount': total_salary * pit_rate,
                    'pit_rate': f"{pit_rate * 100}%",
                    'pension_amount': total_salary * pension_rate,
                    'pension_rate': f"{pension_rate * 100}%",
                        'total_deductions': (total_salary * pit_rate) + (total_salary * pension_rate)
                    },
                    'net_payable': {
                        'net_amount': total_salary - (total_salary * pit_rate) - (total_salary * pension_rate)
                    }
                }
            }
            
            logger.info(f"Oylik formasi to'ldirildi: {period}")
            
            return {
                'success': True,
                'form_type': 'payroll_report',
                'form_data': payroll_form
            }
        except Exception as e:
            logger.error(f"Oylik formasi to'ldirishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def generate_all_forms(self, period: str, db_session, company_data: Dict = None) -> Dict:
        """Barcha formalarni bir paytda yaratish va to'ldirish"""
        try:
            forms = {
                'sales_report': self.generate_sales_report_form(period, db_session),
                'purchase_report': self.generate_purchase_report_form(period, db_session),
                'inventory_report': self.generate_inventory_report_form(db_session),
                'financial_report': self.generate_financial_report_form(period, db_session),
                'cash_flow_report': self.generate_cash_flow_report_form(period, db_session)
            }
            
            # Moliyaviy ma'lumotlar bilan taxJform to'ldirish
            if forms['financial_report']['success']:
                financial = forms['financial_report']['form_data']
                forms['tax_form'] = self.fill_tax_form(period, financial)
                forms['vat_form'] = self.fill_vat_form(
                    period, 
                    financial.get('income', 0),
                    financial.get('purchases', 0)
                )
                forms['payroll_form'] = self.fill_payroll_form(
                    period,
                    company_data.get('employee_count', 0) if company_data else 0,
                    financial.get('salary', 0)
                )
            
            logger.info(f"Barcha formalar yaratildi: {period}")
            
            return {
                'success': True,
                'period': period,
                'forms': forms,
                'generated_at': datetime.now().isoformat(),
                'total_forms': len([f for f in forms.values() if f.get('success')])
            }
        except Exception as e:
            logger.error(f"Barcha formalar yaratishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}
