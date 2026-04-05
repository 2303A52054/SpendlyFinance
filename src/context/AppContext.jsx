import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockTransactions, mockScheduled } from '../data/mockData';

const AppContext = createContext();
const STORAGE_KEY = 'spendly_state_v3';

const initialState = {
  role: 'admin',
  darkMode: false,
  transactions: [],
  scheduledTransactions: [],
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    dateRange: 'this_month',
    sortBy: 'date',
    sortDir: 'desc',
  },
  activeTab: 'dashboard',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE': return { ...state, role: action.payload };
    case 'TOGGLE_DARK': return { ...state, darkMode: !state.darkMode };
    case 'ADD_TRANSACTION': return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION': return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRANSACTION': return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_FILTER': return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS': return { ...state, filters: initialState.filters };
    case 'SET_TAB': return { ...state, activeTab: action.payload };
    case 'LOAD_STATE': return { ...state, ...action.payload };
    // Scheduled transactions
    case 'ADD_SCHEDULED': return { ...state, scheduledTransactions: [...state.scheduledTransactions, action.payload].sort((a,b)=>new Date(a.date)-new Date(b.date)) };
    case 'DELETE_SCHEDULED': return { ...state, scheduledTransactions: state.scheduledTransactions.filter(t => t.id !== action.payload) };
    case 'CONFIRM_SCHEDULED': {
      // Move scheduled → actual transaction
      const sched = state.scheduledTransactions.find(t => t.id === action.payload);
      if (!sched) return state;
      const confirmed = { ...sched, scheduled: false, status: undefined, id: Date.now() };
      return {
        ...state,
        scheduledTransactions: state.scheduledTransactions.filter(t => t.id !== action.payload),
        transactions: [confirmed, ...state.transactions],
      };
    }
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    transactions: mockTransactions,
    scheduledTransactions: mockScheduled,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        role: state.role,
        darkMode: state.darkMode,
        transactions: state.transactions,
        scheduledTransactions: state.scheduledTransactions,
      }));
    } catch (e) {}
  }, [state.role, state.darkMode, state.transactions, state.scheduledTransactions]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
