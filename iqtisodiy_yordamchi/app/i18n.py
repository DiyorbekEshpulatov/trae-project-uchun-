#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Multi-Language Localization Setup
Uzbek, Russian, English qo'llab-quvvatlash
"""

from flask import Flask, request, session
from flask_babel import Babel, gettext, ngettext, lazy_gettext

# Babel initialization
babel = Babel()

LANGUAGES = {
    'uz': 'O\'zbekcha',
    'ru': 'Русский',
    'en': 'English'
}

def init_i18n(app):
    """I18n initialize qilish"""
    babel.init_app(app)
    
    @babel.localeselector
    def get_locale():
        # URL parametridan
        if request.args.get('lang'):
            lang = request.args.get('lang')
            if lang in LANGUAGES:
                session['lang'] = lang
                return lang
        
        # Session'dan
        if 'lang' in session:
            return session['lang']
        
        # Browser default'dan
        return request.accept_languages.best_match(LANGUAGES.keys()) or 'uz'
    
    return babel

# Localization strings
TRANSLATIONS = {
    'uz': {
        # Header
        'dashboard': 'Bosh sahifa',
        'sales': 'Savdo',
        'purchases': 'Sotib olish',
        'inventory': 'Inventar',
        'reports': 'Hisobotlar',
        'settings': 'Sozlamalar',
        'logout': 'Chiqish',
        
        # Forms
        'login': 'Kirish',
        'password': 'Parol',
        'username': 'Foydalanuvchi nomi',
        'email': 'Email',
        'phone': 'Telefon',
        
        # Excel
        'generate_sales_table': 'Savdo Jadvali Yaratish',
        'generate_purchase_table': 'Sotib Olish Jadvali Yaratish',
        'generate_inventory_table': 'Inventar Jadvali Yaratish',
        'generate_financial_report': 'Moliyaviy Hisobot',
        'generate_auto_forms': 'Avtomatik Formalar',
        
        # Tax
        'send_tax_report': 'Soliq Hisoboti Yuborish',
        'tax_status': 'Soliq Xolati',
        'vat_report': 'KDV Formasi',
        'payroll_report': 'Oylik Hisoboti',
        
        # Messages
        'success': 'Muvaffaqiyatli',
        'error': 'Xato',
        'loading': 'Yuklanmoqda...',
        'save': 'Saqlash',
        'cancel': 'Bekor qilish',
        'delete': 'O\'chirish',
        'edit': 'Tahrirlash',
        'add': 'Qo\'shish',
    },
    'ru': {
        # Header
        'dashboard': 'Главная панель',
        'sales': 'Продажи',
        'purchases': 'Закупки',
        'inventory': 'Инвентарь',
        'reports': 'Отчеты',
        'settings': 'Настройки',
        'logout': 'Выход',
        
        # Forms
        'login': 'Вход',
        'password': 'Пароль',
        'username': 'Имя пользователя',
        'email': 'Email',
        'phone': 'Телефон',
        
        # Excel
        'generate_sales_table': 'Создать таблицу продаж',
        'generate_purchase_table': 'Создать таблицу закупок',
        'generate_inventory_table': 'Создать таблицу инвентаря',
        'generate_financial_report': 'Финансовый отчет',
        'generate_auto_forms': 'Автоматические формы',
        
        # Tax
        'send_tax_report': 'Отправить налоговый отчет',
        'tax_status': 'Статус налога',
        'vat_report': 'Отчет НДС',
        'payroll_report': 'Расчетный лист',
        
        # Messages
        'success': 'Успешно',
        'error': 'Ошибка',
        'loading': 'Загрузка...',
        'save': 'Сохранить',
        'cancel': 'Отмена',
        'delete': 'Удалить',
        'edit': 'Редактировать',
        'add': 'Добавить',
    },
    'en': {
        # Header
        'dashboard': 'Dashboard',
        'sales': 'Sales',
        'purchases': 'Purchases',
        'inventory': 'Inventory',
        'reports': 'Reports',
        'settings': 'Settings',
        'logout': 'Logout',
        
        # Forms
        'login': 'Login',
        'password': 'Password',
        'username': 'Username',
        'email': 'Email',
        'phone': 'Phone',
        
        # Excel
        'generate_sales_table': 'Generate Sales Table',
        'generate_purchase_table': 'Generate Purchase Table',
        'generate_inventory_table': 'Generate Inventory Table',
        'generate_financial_report': 'Generate Financial Report',
        'generate_auto_forms': 'Generate Auto Forms',
        
        # Tax
        'send_tax_report': 'Send Tax Report',
        'tax_status': 'Tax Status',
        'vat_report': 'VAT Report',
        'payroll_report': 'Payroll Report',
        
        # Messages
        'success': 'Success',
        'error': 'Error',
        'loading': 'Loading...',
        'save': 'Save',
        'cancel': 'Cancel',
        'delete': 'Delete',
        'edit': 'Edit',
        'add': 'Add',
    }
}

def get_text(key, lang='uz'):
    """Tarjimasini olish"""
    if lang in TRANSLATIONS and key in TRANSLATIONS[lang]:
        return TRANSLATIONS[lang][key]
    return key

def switch_language_route(app):
    """Language switch route"""
    @app.route('/api/language/<lang>')
    def switch_language(lang):
        if lang in LANGUAGES:
            session['lang'] = lang
            return {'status': 'ok', 'language': lang}
        return {'error': 'Invalid language'}, 400
