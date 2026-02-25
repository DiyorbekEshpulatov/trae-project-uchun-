/**
 * Internationalization - 3 til | 3 языка | 3 languages
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  uz: {
    translation: {
      // Asosiy | Основные | Basic
      appName: 'AI-ERP System',
      welcome: 'Xush kelibsiz',
      login: 'Kirish',
      logout: 'Chiqish',
      dashboard: 'Boshqaruv paneli',
      
      // Modullar | Модули | Modules
      inventory: 'Ombor',
      sales: 'Savdo',
      finance: 'Moliya',
      reports: 'Hisobotlar',
      aiAssistant: 'AI Yordamchi',
      
      // Standartlar | Стандарты | Standards
      standards: 'Standartlar',
      xbrl: 'XBRL Format',
      ifrs: 'IFRS',
      uzmsfo: 'UzMSFO',
      
      // Soliq | Налоги | Tax
      taxReports: 'Soliq hisobotlari',
      vat: 'QQS',
      profitTax: 'Foyda solig\'i',
      submitToSoliq: 'Soliq.uz ga yuborish',
      
      // AI | ИИ | AI
      askAI: 'AI dan so\'rang',
      analyzing: 'Tahlil qilmoqda...',
      forecast: 'Bashorat',
      
      // Xatoliklar | Ошибки | Errors
      error: 'Xatolik',
      loading: 'Yuklanmoqda...',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
    }
  },
  ru: {
    translation: {
      appName: 'ИИ-ERP Система',
      welcome: 'Добро пожаловать',
      login: 'Вход',
      logout: 'Выход',
      dashboard: 'Панель управления',
      
      inventory: 'Склад',
      sales: 'Продажи',
      finance: 'Финансы',
      reports: 'Отчеты',
      aiAssistant: 'ИИ Помощник',
      
      standards: 'Стандарты',
      xbrl: 'XBRL Формат',
      ifrs: 'IFRS',
      uzmsfo: 'UzMSFO',
      
      taxReports: 'Налоговые отчеты',
      vat: 'НДС',
      profitTax: 'Налог на прибыль',
      submitToSoliq: 'Отправить в Soliq.uz',
      
      askAI: 'Спросите ИИ',
      analyzing: 'Анализирую...',
      forecast: 'Прогноз',
      
      error: 'Ошибка',
      loading: 'Загрузка...',
      save: 'Сохранить',
      cancel: 'Отмена',
    }
  },
  en: {
    translation: {
      appName: 'AI-ERP System',
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      dashboard: 'Dashboard',
      
      inventory: 'Inventory',
      sales: 'Sales',
      finance: 'Finance',
      reports: 'Reports',
      aiAssistant: 'AI Assistant',
      
      standards: 'Standards',
      xbrl: 'XBRL Format',
      ifrs: 'IFRS',
      uzmsfo: 'UzMSFO',
      
      taxReports: 'Tax Reports',
      vat: 'VAT',
      profitTax: 'Profit Tax',
      submitToSoliq: 'Submit to Soliq.uz',
      
      askAI: 'Ask AI',
      analyzing: 'Analyzing...',
      forecast: 'Forecast',
      
      error: 'Error',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uz', // Default til
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
