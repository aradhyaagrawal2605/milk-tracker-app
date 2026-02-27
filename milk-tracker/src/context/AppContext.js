/**
 * Central state management using React Context + useReducer.
 *
 * Provides:
 *  - settings (price, default liters)
 *  - current month's entries & payments
 *  - computed totals
 *  - actions to mutate data (all persisted automatically)
 */
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getMonthKey, getDateKey } from '../utils/helpers';
import * as Storage from '../utils/storage';

/**
 * Simple unique ID generator — no external dependency needed.
 * Combines timestamp + random suffix for uniqueness.
 */
const generateId = () => {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
};

/* ---- State shape ---- */
const initialState = {
  ready: false,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  settings: { pricePerLiter: 60, defaultLiters: 1 },
  entries: {},
  payments: [],
};

/* ---- Action types ---- */
const ACTIONS = {
  INIT: 'INIT',
  SET_MONTH: 'SET_MONTH',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_ENTRY: 'SET_ENTRY',
  DELETE_ENTRY: 'DELETE_ENTRY',
  ADD_PAYMENT: 'ADD_PAYMENT',
  DELETE_PAYMENT: 'DELETE_PAYMENT',
  LOAD_MONTH_DATA: 'LOAD_MONTH_DATA',
};

/* ---- Reducer ---- */
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return { ...state, ready: true, settings: action.settings, entries: action.entries, payments: action.payments };

    case ACTIONS.SET_MONTH:
      return { ...state, currentYear: action.year, currentMonth: action.month };

    case ACTIONS.LOAD_MONTH_DATA:
      return { ...state, entries: action.entries, payments: action.payments };

    case ACTIONS.SET_SETTINGS:
      return { ...state, settings: action.settings };

    case ACTIONS.SET_ENTRY:
      return { ...state, entries: { ...state.entries, [action.dateKey]: action.entry } };

    case ACTIONS.DELETE_ENTRY: {
      const copy = { ...state.entries };
      delete copy[action.dateKey];
      return { ...state, entries: copy };
    }

    case ACTIONS.ADD_PAYMENT:
      return { ...state, payments: [...state.payments, action.payment] };

    case ACTIONS.DELETE_PAYMENT:
      return { ...state, payments: state.payments.filter((p) => p.id !== action.paymentId) };

    default:
      return state;
  }
}

/* ---- Context ---- */
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const monthKey = getMonthKey(new Date(state.currentYear, state.currentMonth, 1));

  /* -- Bootstrap: load settings + current month data -- */
  useEffect(() => {
    (async () => {
      const settings = await Storage.loadSettings();
      const mk = getMonthKey(new Date());
      const entries = await Storage.loadMonthEntries(mk);
      const payments = await Storage.loadMonthPayments(mk);
      dispatch({ type: ACTIONS.INIT, settings, entries, payments });
    })();
  }, []);

  /* -- When month changes, reload data -- */
  const navigateMonth = useCallback(async (year, month) => {
    dispatch({ type: ACTIONS.SET_MONTH, year, month });
    const mk = getMonthKey(new Date(year, month, 1));
    const entries = await Storage.loadMonthEntries(mk);
    const payments = await Storage.loadMonthPayments(mk);
    dispatch({ type: ACTIONS.LOAD_MONTH_DATA, entries, payments });
  }, []);

  /* -- Settings -- */
  const updateSettings = useCallback(async (newSettings) => {
    await Storage.saveSettings(newSettings);
    dispatch({ type: ACTIONS.SET_SETTINGS, settings: newSettings });
  }, []);

  /* -- Day entries -- */
  const setDayEntry = useCallback(async (dateKey, entry) => {
    await Storage.saveDayEntry(monthKey, dateKey, entry);
    dispatch({ type: ACTIONS.SET_ENTRY, dateKey, entry });
  }, [monthKey]);

  const removeDayEntry = useCallback(async (dateKey) => {
    await Storage.deleteDayEntry(monthKey, dateKey);
    dispatch({ type: ACTIONS.DELETE_ENTRY, dateKey });
  }, [monthKey]);

  /* -- Payments -- */
  const addPayment = useCallback(async (amount, note = '') => {
    const payment = {
      id: generateId(),
      date: getDateKey(new Date()),
      amount: Number(amount),
      note,
    };
    await Storage.savePayment(monthKey, payment);
    dispatch({ type: ACTIONS.ADD_PAYMENT, payment });
  }, [monthKey]);

  const removePayment = useCallback(async (paymentId) => {
    await Storage.deletePayment(monthKey, paymentId);
    dispatch({ type: ACTIONS.DELETE_PAYMENT, paymentId });
  }, [monthKey]);

  /* -- Computed totals -- */
  const totalLiters = Object.values(state.entries).reduce((sum, e) => sum + (e.liters || 0), 0);
  const totalBill = totalLiters * state.settings.pricePerLiter;
  const totalPaid = state.payments.reduce((sum, p) => sum + p.amount, 0);
  const totalDue = totalBill - totalPaid;

  const value = {
    ...state,
    monthKey,
    totalLiters,
    totalBill,
    totalPaid,
    totalDue,
    navigateMonth,
    updateSettings,
    setDayEntry,
    removeDayEntry,
    addPayment,
    removePayment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);