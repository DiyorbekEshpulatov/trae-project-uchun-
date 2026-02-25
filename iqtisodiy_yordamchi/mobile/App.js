// Smart Savdo Mobile App - React Native Setup
// iOS, Android, Windows qo'llab-quvvatlash

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  AppState,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import i18n from 'i18next';

// ============== I18N SETUP ==============
import { initReactI18next } from 'react-i18next';

const resources = {
  uz: {
    translation: {
      'dashboard': "Bosh sahifa",
      'sales': "Savdo",
      'purchases': "Sotib olish",
      'inventory': "Inventar",
      'reports': "Hisobotlar",
      'settings': "Sozlamalar",
      'logout': "Chiqish",
      'generate_sales_table': "Savdo Jadvali",
      'generate_purchase_table': "Sotib Olish Jadvali",
      'generate_inventory_table': "Inventar Jadvali",
      'send_tax_report': "Soliq Hisoboti",
      'success': "Muvaffaqiyatli",
      'error': "Xato",
      'loading': "Yuklanmoqda...",
      'offline_mode': "Offline rejim"
    }
  },
  ru: {
    translation: {
      'dashboard': "Главная",
      'sales': "Продажи",
      'purchases': "Закупки",
      'inventory': "Инвентарь",
      'reports': "Отчеты",
      'settings': "Настройки",
      'logout': "Выход",
      'generate_sales_table': "Таблица продаж",
      'generate_purchase_table': "Таблица закупок",
      'generate_inventory_table': "Таблица инвентаря",
      'send_tax_report': "Налоговый отчет",
      'success': "Успешно",
      'error': "Ошибка",
      'loading': "Загрузка...",
      'offline_mode': "Автономный режим"
    }
  },
  en: {
    translation: {
      'dashboard': "Dashboard",
      'sales': "Sales",
      'purchases': "Purchases",
      'inventory': "Inventory",
      'reports': "Reports",
      'settings': "Settings",
      'logout': "Logout",
      'generate_sales_table': "Sales Table",
      'generate_purchase_table': "Purchase Table",
      'generate_inventory_table': "Inventory Table",
      'send_tax_report': "Tax Report",
      'success': "Success",
      'error': "Error",
      'loading': "Loading...",
      'offline_mode': "Offline Mode"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uz',
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false
    }
  });

// ============== API SETUP ==============
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - token qo'shish
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============== OFFLINE STORAGE ==============
const offlineStorage = {
  async saveData(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  async getData(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },

  async clearData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};

// ============== SCREENS ==============

// Dashboard Screen
function DashboardScreen({ navigation }) {
  const { t } = i18n;
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });
    return unsubscribe;
  }, []);

  const buttons = [
    { title: t('generate_sales_table'), action: 'sales', icon: '📊' },
    { title: t('generate_purchase_table'), action: 'purchases', icon: '📦' },
    { title: t('generate_inventory_table'), action: 'inventory', icon: '📈' },
    { title: t('send_tax_report'), action: 'tax', icon: '💰' },
    { title: 'Excel Jadvallar', action: 'excel', icon: '📄' },
    { title: 'OCR Skaneri', action: 'ocr', icon: '🖼️' },
  ];

  const handlePress = async (action) => {
    if (!isOnline) {
      Alert.alert(t('offline_mode'), 'Internet kerak');
      return;
    }

    setLoading(true);
    try {
      let response;
      switch (action) {
        case 'sales':
          response = await api.post('/api/excel/generate-sales-table');
          break;
        case 'purchases':
          response = await api.post('/api/excel/generate-purchase-table');
          break;
        case 'inventory':
          response = await api.post('/api/excel/generate-inventory-table');
          break;
        case 'tax':
          response = await api.post('/api/tax/send-all-reports');
          break;
        case 'excel':
          response = await api.post('/api/excel/generate-complete-report');
          break;
        case 'ocr':
          navigation.navigate('OCR');
          return;
        default:
          break;
      }

      if (response.data.success) {
        Alert.alert(t('success'), `${action} muvaffaqiyatli`);
        // Offline save
        await offlineStorage.saveData(`${action}_data`, response.data);
      }
    } catch (error) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusBar, { backgroundColor: isOnline ? '#4CAF50' : '#FF5252' }]}>
        <Text style={styles.statusText}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>{t('dashboard')}</Text>

        {loading && <ActivityIndicator size="large" color="#2196F3" />}

        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handlePress(btn.action)}
            disabled={loading}
          >
            <Text style={styles.buttonIcon}>{btn.icon}</Text>
            <Text style={styles.buttonText}>{btn.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// Sales Screen
function SalesScreen() {
  const { t } = i18n;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('sales')}</Text>
      {/* Sales implementation */}
    </View>
  );
}

// Settings Screen
function SettingsScreen() {
  const { t, i18n } = i18n;
  const [language, setLanguage] = useState('uz');

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    AsyncStorage.setItem('language', lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>

      <View style={styles.settingGroup}>
        <Text style={styles.settingLabel}>Til tanlang / Выберите язык</Text>

        {['uz', 'ru', 'en'].map(lang => (
          <TouchableOpacity
            key={lang}
            style={[styles.settingOption, language === lang && styles.settingOptionActive]}
            onPress={() => changeLanguage(lang)}
          >
            <Text style={styles.settingOptionText}>
              {lang === 'uz' ? "O'zbek" : lang === 'ru' ? 'Русский' : 'English'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Navigation Setup
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { t } = i18n;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: t('dashboard') }} />
      <Tab.Screen name="Sales" component={SalesScreen} options={{ title: t('sales') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings') }} />
    </Tab.Navigator>
  );
}

// Main App
export default function App() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    initializeApp();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to foreground
      console.log('App has come to foreground');
    }
    setAppState(nextAppState);
  };

  const initializeApp = async () => {
    try {
      // Load stored language
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
      setInitializing(false);
    } catch (error) {
      console.error('Initialization error:', error);
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============== STYLES ==============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusBar: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  settingGroup: {
    marginTop: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  settingOption: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  settingOptionActive: {
    borderLeftColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  settingOptionText: {
    fontSize: 14,
    color: '#333',
  },
});
