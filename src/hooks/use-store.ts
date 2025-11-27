'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';

export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });

    return unsubscribe;
  }, []);

  return {
    ...state,
    addTransaction: store.addTransaction.bind(store),
    updateTransaction: store.updateTransaction.bind(store),
    deleteTransaction: store.deleteTransaction.bind(store),
    addCategory: store.addCategory.bind(store),
    updateCategory: store.updateCategory.bind(store),
    deleteCategory: store.deleteCategory.bind(store),
    addAccount: store.addAccount.bind(store),
    updateAccount: store.updateAccount.bind(store),
    deleteAccount: store.deleteAccount.bind(store),
    addGoal: store.addGoal.bind(store),
    updateGoal: store.updateGoal.bind(store),
    deleteGoal: store.deleteGoal.bind(store),
    clearAll: store.clearAll.bind(store),
    exportData: store.exportData.bind(store),
    importData: store.importData.bind(store),
  };
}
