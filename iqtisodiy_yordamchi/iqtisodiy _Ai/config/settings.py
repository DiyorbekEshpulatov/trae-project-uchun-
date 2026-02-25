"""
AI-ERP System Settings
O'zbekiston standartlari | Стандарты Узбекистана | Uzbekistan Standards
"""

import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================================
# ASOSIY | ОСНОВНЫЕ | BASIC
# ==========================================

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

# ==========================================
# ILOVALAR | ПРИЛОЖЕНИЯ | APPS
# ==========================================

INSTALLED_APPS = [
    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',
    'corsheaders',
    'django_filters',
    'parler',  # Ko'p tilli
    
    # Local apps
    'apps.core',
    'apps.users',
    'apps.inventory',
    'apps.sales',
    'apps.finance',
    'apps.reports',
    'apps.ai',
    'apps.integrations',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'apps.core.middleware.LanguageMiddleware',  # Til middleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
            'apps.core.context_processors.i18n_context',
        ],
    },
}]

WSGI_APPLICATION = 'config.wsgi.application'

# ==========================================
# DATABASE | БАЗА ДАННЫХ | DATABASE
# ==========================================

DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600
    )
}

# ==========================================
# TILLAR | ЯЗЫКИ | LANGUAGES
# ==========================================

LANGUAGE_CODE = 'uz'

LANGUAGES = [
    ('uz', 'O\'zbek'),
    ('ru', 'Русский'),
    ('en', 'English'),
]

PARLER_LANGUAGES = {
    None: (
        {'code': 'uz'},
        {'code': 'ru'},
        {'code': 'en'},
    ),
    'default': {
        'code': 'uz',
        'fallbacks': ['uz', 'ru', 'en'],
        'hide_untranslated': False,
    }
}

LOCALE_PATHS = [BASE_DIR / 'locale']

TIME_ZONE = 'Asia/Tashkent'
USE_I18N = True
USE_TZ = True

# ==========================================
# GEMINI AI | ГЕМИНИ ИИ | GEMINI AI
# ==========================================

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-pro')

# ==========================================
# REDIS VA CELERY | REDIS И CELERY | REDIS AND CELERY
# ==========================================

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.getenv('REDIS_URL'),
        'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'}
    }
}

CELERY_BROKER_URL = os.getenv('REDIS_URL')
CELERY_RESULT_BACKEND = os.getenv('REDIS_URL')
CELERY_TIMEZONE = 'Asia/Tashkent'

# ==========================================
# STATIK FAYLLAR | СТАТИЧЕСКИЕ ФАЙЛЫ | STATIC FILES
# ==========================================

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==========================================
# XBRL VA HISOBOTLAR | XBRL И ОТЧЕТЫ | XBRL AND REPORTS
# ==========================================

XBRL_ENABLED = True
XBRL_TAXONOMY_VERSION = '2024'
IFRS_ENABLED = True

# O'zbekiston soliq kodeksi
UZ_TAX_VAT_RATE = 12  # QQS
UZ_TAX_PROFIT_RATE = 12  # Foyda solig'i
UZ_TAX_PIT_RATE = 12  # Daromad solig'i
