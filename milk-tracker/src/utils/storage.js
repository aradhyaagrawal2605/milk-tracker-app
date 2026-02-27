/**
 * Thin wrapper around AsyncStorage for typed data persistence.
 * All data is stored under namespaced keys to avoid collisions.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SETTINGS: '@milktracker_settings',
  ENTRIES: '@milktracker_entries',   // { "YYYY-MM": { "YYYY-MM-DD": { liters, note } } }
  PAYMENTS: '@milktracker_payments', // { "YYYY-MM": [ { id, date, amount, note } ] }
};

/* ---------- Settings ---------- */

const DEFAULT_SETTINGS = {
  pricePerLiter: 60,
  defaultLiters: 1,
};

export const loadSettings = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings) => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

/* ---------- Daily Entries ---------- */

export const loadMonthEntries = async (monthKey) => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.ENTRIES);
    const all = raw ? JSON.parse(raw) : {};
    return all[monthKey] || {};
  } catch {
    return {};
  }
};

export const saveDayEntry = async (monthKey, dateKey, entry) => {
  const raw = await AsyncStorage.getItem(KEYS.ENTRIES);
  const all = raw ? JSON.parse(raw) : {};
  if (!all[monthKey]) all[monthKey] = {};
  all[monthKey][dateKey] = entry;
  await AsyncStorage.setItem(KEYS.ENTRIES, JSON.stringify(all));
};

export const deleteDayEntry = async (monthKey, dateKey) => {
  const raw = await AsyncStorage.getItem(KEYS.ENTRIES);
  const all = raw ? JSON.parse(raw) : {};
  if (all[monthKey]) {
    delete all[monthKey][dateKey];
    await AsyncStorage.setItem(KEYS.ENTRIES, JSON.stringify(all));
  }
};

/* ---------- Payments ---------- */

export const loadMonthPayments = async (monthKey) => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PAYMENTS);
    const all = raw ? JSON.parse(raw) : {};
    return all[monthKey] || [];
  } catch {
    return [];
  }
};

export const savePayment = async (monthKey, payment) => {
  const raw = await AsyncStorage.getItem(KEYS.PAYMENTS);
  const all = raw ? JSON.parse(raw) : {};
  if (!all[monthKey]) all[monthKey] = [];
  all[monthKey].push(payment);
  await AsyncStorage.setItem(KEYS.PAYMENTS, JSON.stringify(all));
};

export const deletePayment = async (monthKey, paymentId) => {
  const raw = await AsyncStorage.getItem(KEYS.PAYMENTS);
  const all = raw ? JSON.parse(raw) : {};
  if (all[monthKey]) {
    all[monthKey] = all[monthKey].filter((p) => p.id !== paymentId);
    await AsyncStorage.setItem(KEYS.PAYMENTS, JSON.stringify(all));
  }
};