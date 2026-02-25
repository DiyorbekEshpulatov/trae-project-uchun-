#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Telegram Bot - Soliq hisobotlari va ERP notifikatsiyalari uchun
"""

import os
import logging
from datetime import datetime
from dotenv import load_dotenv
import requests
import json

load_dotenv()
logger = logging.getLogger(__name__)

class TelegramBot:
    """Telegram Bot API bilan ishlovchi klass"""
    
    def __init__(self):
        self.token = os.getenv('TELEGRAM_BOT_TOKEN', '')
        self.chat_id = os.getenv('TELEGRAM_CHAT_ID', '')
        self.base_url = f'https://api.telegram.org/bot{self.token}'
        
        if not self.token or not self.chat_id:
            logger.warning("Telegram bot token yoki chat_id konfiguratsiyasi etishmaydi")
    
    def send_message(self, text: str, parse_mode: str = 'HTML') -> bool:
        """Oddiy xabar yuborish"""
        if not self.token or not self.chat_id:
            logger.warning("Telegram bot konfiguratsiyasi etishmaydi")
            return False
        
        try:
            url = f'{self.base_url}/sendMessage'
            data = {
                'chat_id': self.chat_id,
                'text': text,
                'parse_mode': parse_mode
            }
            
            response = requests.post(url, json=data, timeout=10)
            
            if response.status_code == 200:
                logger.info("Telegram xabari yuborildi")
                return True
            else:
                logger.error(f"Telegram xabari yuborishda xato: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"Telegram xabari yuborishda exception: {str(e)}")
            return False
    
    def send_tax_report_notification(self, report_type: str, status: str, details: dict = None) -> bool:
        """Soliq hisoboti haqida notifikatsiya yuborish"""
        
        status_emoji = '✅' if status == 'success' else '❌'
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        report_names = {
            'sales': 'Savdo Hisoboti',
            'vat': 'KDV (QQS) Hisoboti',
            'payroll': 'Oylik Hisoboti',
            'declaration': 'Soliq Deklaratsiyasi'
        }
        
        message = f"""
{status_emoji} <b>Soliq Hisoboti Yuborildi</b>

📋 <b>Hisobot Turi:</b> {report_names.get(report_type, report_type)}
📊 <b>Holati:</b> {'Muvaffaqiyatli' if status == 'success' else 'Xato'}
⏰ <b>Vaqti:</b> {timestamp}
"""
        
        if details:
            if details.get('period'):
                message += f"📅 <b>Davriy:</b> {details['period']}\n"
            if details.get('amount'):
                message += f"💰 <b>Summa:</b> {details['amount']:,} UZS\n"
            if details.get('error'):
                message += f"⚠️ <b>Xato:</b> {details['error']}\n"
        
        return self.send_message(message)
    
    def send_dashboard_alert(self, alert_type: str, message: str, severity: str = 'info') -> bool:
        """Dashboard haqida xabar yuborish"""
        
        severity_emoji = {
            'info': 'ℹ️',
            'warning': '⚠️',
            'error': '❌',
            'success': '✅'
        }
        
        emoji = severity_emoji.get(severity, 'ℹ️')
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        full_message = f"""
{emoji} <b>Dashboard Xabari</b>

📢 <b>Turi:</b> {alert_type}
💬 <b>Xabar:</b> {message}
⏰ <b>Vaqti:</b> {timestamp}
"""
        
        return self.send_message(full_message)
    
    def send_sales_alert(self, customer_name: str, amount: float, product_count: int) -> bool:
        """Yangi savdo haqida xabar yuborish"""
        
        message = f"""
🛍️ <b>Yangi Savdo</b>

👤 <b>Mijoz:</b> {customer_name}
💰 <b>Summa:</b> {amount:,} UZS
📦 <b>Mahsulotlar:</b> {product_count} ta
⏰ <b>Vaqti:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        return self.send_message(message)
    
    def send_inventory_alert(self, product_name: str, stock_level: float, min_stock: float) -> bool:
        """Inventar haqida xabariyla yuborish"""
        
        if stock_level < min_stock:
            status = "KRITIK"
            emoji = "🚨"
        else:
            status = "PAST"
            emoji = "⚠️"
        
        message = f"""
{emoji} <b>Inventar Haqida Xabari</b>

📦 <b>Mahsulot:</b> {product_name}
📊 <b>Holati:</b> {status}
📈 <b>Hozirgi Qolgan:</b> {stock_level}
📍 <b>Minimal:</b> {min_stock}
⏰ <b>Vaqti:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        return self.send_message(message)
    
    def send_file(self, file_path: str, caption: str = '') -> bool:
        """Faylni Telegramga yuborish"""
        
        try:
            if not os.path.exists(file_path):
                logger.error(f"Fayl topilmadi: {file_path}")
                return False
            
            url = f'{self.base_url}/sendDocument'
            
            with open(file_path, 'rb') as f:
                files = {'document': f}
                data = {
                    'chat_id': self.chat_id,
                    'caption': caption
                }
                
                response = requests.post(url, data=data, files=files, timeout=30)
            
            if response.status_code == 200:
                logger.info(f"Fayl yuborildi: {file_path}")
                return True
            else:
                logger.error(f"Fayl yuborishda xato: {response.status_code}")
                return False
        
        except Exception as e:
            logger.error(f"Fayl yuborishda exception: {str(e)}")
            return False
    
    def send_tax_summary(self, summary_data: dict) -> bool:
        """Oylik soliq xulosasini yuborish"""
        
        message = f"""
📊 <b>Oylik Soliq Xulosasi</b>

📅 <b>Davriy:</b> {summary_data.get('period', 'N/A')}

💰 <b>Savdo Jami:</b> {summary_data.get('total_sales', 0):,} UZS
🎯 <b>KDV (10%):</b> {summary_data.get('vat_amount', 0):,} UZS
📊 <b>Foyda:</b> {summary_data.get('profit', 0):,} UZS
💳 <b>Soliq:</b> {summary_data.get('tax_amount', 0):,} UZS

✅ <b>Holati:</b> Yuborildi
⏰ <b>Vaqti:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        return self.send_message(message)


# Demo/Dev uchun fake implementation
class TelegramBotDev(TelegramBot):
    """Test uchun demo version"""
    
    def send_message(self, text: str, parse_mode: str = 'HTML') -> bool:
        logger.info(f"[DEV] Telegram xabar: {text[:100]}...")
        return True
    
    def send_file(self, file_path: str, caption: str = '') -> bool:
        logger.info(f"[DEV] Fayl yuborildi: {file_path}")
        return True


# Global instance
USE_DEV_TELEGRAM = os.getenv('USE_DEV_TELEGRAM', 'False').lower() == 'true'
telegram_bot = TelegramBotDev() if USE_DEV_TELEGRAM else TelegramBot()
