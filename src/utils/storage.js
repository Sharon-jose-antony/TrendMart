// LocalStorage Keys constants
export const STORAGE_KEYS = {
  THEME: 'trendmart_theme',
  AUTH: 'trendmart_auth',
  PRODUCTS: 'trendmart_products',
  CATEGORIES: 'trendmart_categories',
  CUSTOMERS: 'trendmart_customers',
  ORDERS: 'trendmart_orders',
  NOTIFICATIONS: 'trendmart_notifications',
  ACTIVITIES: 'trendmart_activities',
  SETTINGS: 'trendmart_store_settings',
};

// Safe getItem with fallback
export const getStorageItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

// Safe setItem
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Remove single item
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};
