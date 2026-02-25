"""
AI-ERP Telegram Bot | Телеграм бот ИИ-ERP | AI-ERP Telegram Bot
3 til qo'llab-quvvatlaydi | Поддерживает 3 языка | Supports 3 languages
"""

import asyncio
import os
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command, CommandStart
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from dotenv import load_dotenv

load_dotenv()

# Til tugmalari | Языковые кнопки | Language buttons
def get_main_menu(language: str = 'uz'):
    menus = {
        'uz': [
            [KeyboardButton(text='📊 Hisobotlar'), KeyboardButton(text='🤖 AI Yordam')],
            [KeyboardButton(text='📦 Ombor'), KeyboardButton(text='💰 Savdo')],
            [KeyboardButton(text='⚙️ Sozlamalar')]
        ],
        'ru': [
            [KeyboardButton(text='📊 Отчеты'), KeyboardButton(text='🤖 ИИ Помощь')],
            [KeyboardButton(text='📦 Склад'), KeyboardButton(text='💰 Продажи')],
            [KeyboardButton(text='⚙️ Настройки')]
        ],
        'en': [
            [KeyboardButton(text='📊 Reports'), KeyboardButton(text='🤖 AI Help')],
            [KeyboardButton(text='📦 Inventory'), KeyboardButton(text='💰 Sales')],
            [KeyboardButton(text='⚙️ Settings')]
        ]
    }
    return ReplyKeyboardMarkup(keyboard=menus.get(language, menus['uz']), resize_keyboard=True)

# Bot initialization
bot = Bot(token=os.getenv('TELEGRAM_BOT_TOKEN'))
dp = Dispatcher()

# Foydalanuvchi tillari | Языки пользователей | User languages
user_languages = {}

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    """Boshlash | Старт | Start"""
    await message.answer(
        "🤖 AI-ERP Bot\n\n"
        "Tilni tanlang | Выберите язык | Choose language:",
        reply_markup=ReplyKeyboardMarkup(keyboard=[
            [KeyboardButton(text='🇺🇿 O\'zbek'), KeyboardButton(text='🇷🇺 Русский'), KeyboardButton(text='🇬🇧 English')]
        ], resize_keyboard=True)
    )

@dp.message(F.text.in_(['🇺🇿 O\'zbek', '🇷🇺 Русский', '🇬🇧 English']))
async def set_language(message: types.Message):
    """Til sozlash | Установка языка | Set language"""
    lang_map = {
        '🇺🇿 O\'zbek': 'uz',
        '🇷🇺 Русский': 'ru',
        '🇬🇧 English': 'en'
    }
    user_languages[message.from_user.id] = lang_map[message.text]
    
    texts = {
        'uz': "✅ Til o'zgartirildi: O'zbek\n\nAsosiy menyudan tanlang:",
        'ru': "✅ Язык изменен: Русский\n\nВыберите из главного меню:",
        'en': "✅ Language changed: English\n\nChoose from main menu:"
    }
    
    lang = user_languages[message.from_user.id]
    await message.answer(texts[lang], reply_markup=get_main_menu(lang))

@dp.message(F.text.in_(['📊 Hisobotlar', '📊 Отчеты', '📊 Reports']))
async def show_reports(message: types.Message):
    """Hisobotlar | Отчеты | Reports"""
    lang = user_languages.get(message.from_user.id, 'uz')
    
    texts = {
        'uz': "📊 Hisobotlar:\n\n1. Moliyaviy balans\n2. Daromadlar xarajatlar\n3. Soliq hisobotlari\n4. XBRL formatda eksport",
        'ru': "📊 Отчеты:\n\n1. Финансовый баланс\n2. Доходы и расходы\n3. Налоговые отчеты\n4. Экспорт в XBRL",
        'en': "📊 Reports:\n\n1. Financial balance\n2. Income expenses\n3. Tax reports\n4. XBRL export"
    }
    
    await message.answer(texts[lang])

@dp.message(F.text.in_(['🤖 AI Yordam', '🤖 ИИ Помощь', '🤖 AI Help']))
async def ai_help(message: types.Message):
    """AI Yordam | ИИ Помощь | AI Help"""
    lang = user_languages.get(message.from_user.id, 'uz')
    
    texts = {
        'uz': "🤖 AI Yordamchi\n\nSavolingizni yozing. Men quyidagilarda yordam beraman:\n• Moliyaviy tahlil\n• Soliq hisoblash\n• Savdo bashorati\n• Standartlar izohi",
        'ru': "🤖 ИИ Помощник\n\nНапишите ваш вопрос. Я помогу с:\n• Финансовым анализом\n• Налоговым расчетом\n• Прогнозом продаж\n• Разъяснением стандартов",
        'en': "🤖 AI Assistant\n\nType your question. I can help with:\n• Financial analysis\n• Tax calculation\n• Sales forecast\n• Standards explanation"
    }
    
    await message.answer(texts[lang])

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
