#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Soliq Kabenitiga Hisobotlarni Yuborish Moduli
Uzbekiston Davlat Soliq Komitetasining API-si bilan integratsiya
"""
import requests
import json
from datetime import datetime
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaxCabinetAPI:
    """Soliq kabenitining API-si bilan ishlovchi klass"""
    
    def __init__(self):
        self.base_url = os.getenv('TAX_CABINET_URL', 'https://cabinet.soliq.uz/api')
        self.api_key = os.getenv('TAX_API_KEY', '')
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }
    
    @staticmethod
    def _get_db_config(key):
        """Database'dan sozlamani olish (SystemConfig)"""
        try:
            from flask import has_app_context
            if has_app_context():
                from app.main import SystemConfig
                config = SystemConfig.query.filter_by(key=key).first()
                if config and config.value:
                    return config.value
        except Exception:
            pass
        return None

    @property
    def company_tin(self):
        return self._get_db_config('tax_tin') or os.getenv('COMPANY_TIN', '')

    @property
    def company_name(self):
        return self._get_db_config('company_name') or os.getenv('COMPANY_NAME', '')
    
    def send_sales_report(self, sales_data: List[Dict]) -> Dict:
        """
        Savdo hisobotini soliq kabenitiga yuborish
        
        Args:
            sales_data: [{
                'date': '2026-02-04',
                'customer_name': 'ABC Corp',
                'customer_tin': '123456789012',
                'products': [{'code': 'P001', 'quantity': 5, 'price': 100000}],
                'total_amount': 500000,
                'vat_amount': 50000
            }]
        """
        try:
            payload = {
                'report_type': 'sales',
                'company_tin': self.company_tin,
                'company_name': self.company_name,
                'report_date': datetime.now().isoformat(),
                'sales_data': sales_data,
                'total_sales': sum(s.get('total_amount', 0) for s in sales_data),
                'total_vat': sum(s.get('vat_amount', 0) for s in sales_data)
            }
            
            response = requests.post(
                f'{self.base_url}/sales-report',
                json=payload,
                headers=self.headers,
                timeout=30
            )
            
            logger.info(f"Savdo hisoboti yuborildi: {response.status_code}")
            return {
                'success': response.status_code == 200,
                'status_code': response.status_code,
                'data': response.json() if response.status_code == 200 else {'error': response.text}
            }
        except Exception as e:
            logger.error(f"Savdo hisoboti yuborishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_tax_declaration(self, declaration_data: Dict) -> Dict:
        """
        Soliq deklaratsiyasini yuborish
        
        Args:
            declaration_data: {
                'period': '2026-01',
                'income': 5000000,
                'expenses': 2000000,
                'profit': 3000000,
                'tax_amount': 360000
            }
        """
        try:
            payload = {
                'declaration_type': 'monthly',
                'company_tin': self.company_tin,
                'company_name': self.company_name,
                'submission_date': datetime.now().isoformat(),
                **declaration_data
            }
            
            response = requests.post(
                f'{self.base_url}/tax-declaration',
                json=payload,
                headers=self.headers,
                timeout=30
            )
            
            logger.info(f"Soliq deklaratsiyasi yuborildi: {response.status_code}")
            return {
                'success': response.status_code == 200,
                'status_code': response.status_code,
                'data': response.json() if response.status_code == 200 else {'error': response.text}
            }
        except Exception as e:
            logger.error(f"Soliq deklaratsiyasi yuborishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_vat_report(self, vat_data: Dict) -> Dict:
        """
        KDV (QQS) hisobotini yuborish
        
        Args:
            vat_data: {
                'period': '2026-Q1',
                'total_vat_collected': 500000,
                'vat_paid': 200000,
                'vat_to_pay': 300000,
                'invoices': [...]
            }
        """
        try:
            payload = {
                'report_type': 'vat',
                'company_tin': self.company_tin,
                'company_name': self.company_name,
                'submission_date': datetime.now().isoformat(),
                **vat_data
            }
            
            response = requests.post(
                f'{self.base_url}/vat-report',
                json=payload,
                headers=self.headers,
                timeout=30
            )
            
            logger.info(f"KDV hisoboti yuborildi: {response.status_code}")
            return {
                'success': response.status_code == 200,
                'status_code': response.status_code,
                'data': response.json() if response.status_code == 200 else {'error': response.text}
            }
        except Exception as e:
            logger.error(f"KDV hisoboti yuborishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_employee_payroll(self, payroll_data: Dict) -> Dict:
        """
        Xodim oylik hisobotini yuborish (PIT va hadya soliqlar)
        """
        try:
            payload = {
                'report_type': 'payroll',
                'company_tin': self.company_tin,
                'company_name': self.company_name,
                'submission_date': datetime.now().isoformat(),
                **payroll_data
            }
            
            response = requests.post(
                f'{self.base_url}/payroll-report',
                json=payload,
                headers=self.headers,
                timeout=30
            )
            
            logger.info(f"Oylik hisoboti yuborildi: {response.status_code}")
            return {
                'success': response.status_code == 200,
                'status_code': response.status_code,
                'data': response.json() if response.status_code == 200 else {'error': response.text}
            }
        except Exception as e:
            logger.error(f"Oylik hisoboti yuborishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def get_tax_status(self) -> Dict:
        """Soliq holati haqida ma'lumot olish"""
        try:
            response = requests.get(
                f'{self.base_url}/status/{self.company_tin}',
                headers=self.headers,
                timeout=30
            )
            
            return {
                'success': response.status_code == 200,
                'data': response.json() if response.status_code == 200 else {}
            }
        except Exception as e:
            logger.error(f"Soliq holati olishda xato: {str(e)}")
            return {'success': False, 'error': str(e)}


# Fake/Demo uchun vaqtinchalik implementation
class TaxCabinetAPIDev(TaxCabinetAPI):
    """Test uchun demo version - haqiqiy API o'rniga local simulation"""
    
    def send_sales_report(self, sales_data: List[Dict]) -> Dict:
        logger.info(f"[DEV] Savdo hisoboti: {len(sales_data)} ta element")
        return {
            'success': True,
            'status_code': 200,
            'data': {
                'report_id': f'RPT_{datetime.now().timestamp()}',
                'status': 'accepted',
                'message': 'Savdo hisoboti qabul qilindi'
            }
        }
    
    def send_tax_declaration(self, declaration_data: Dict) -> Dict:
        logger.info(f"[DEV] Soliq deklaratsiyasi: {declaration_data.get('period')}")
        return {
            'success': True,
            'status_code': 200,
            'data': {
                'declaration_id': f'DCL_{datetime.now().timestamp()}',
                'status': 'accepted',
                'message': 'Deklaratsiya qabul qilindi'
            }
        }
    
    def send_vat_report(self, vat_data: Dict) -> Dict:
        logger.info(f"[DEV] KDV hisoboti: {vat_data.get('period')}")
        return {
            'success': True,
            'status_code': 200,
            'data': {
                'vat_report_id': f'VAT_{datetime.now().timestamp()}',
                'status': 'accepted',
                'message': 'KDV hisoboti qabul qilindi'
            }
        }
    
    def get_tax_status(self) -> Dict:
        logger.info(f"[DEV] Soliq holati: {self.company_tin}")
        return {
            'success': True,
            'data': {
                'tin': self.company_tin,
                'company_name': self.company_name,
                'registration_date': '2020-01-15',
                'status': 'active',
                'next_filing_date': '2026-03-10'
            }
        }
