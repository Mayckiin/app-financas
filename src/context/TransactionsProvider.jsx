import React, { createContext, useReducer, useEffect, useContext } from 'react'
import { localStorageService } from '../services/localStorageService'
import { mockApi } from '../services/mockApi'

const STORAGE_KEY = 'transactions'
const ACTIONS = {
  SET: 'SET',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  CLEAR: 'CLEAR'
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET:
      return { ...state, items: action.payload }
    case ACTIONS.ADD:
      return { ...state, items: [action.payload, ...state.items] }
    case ACTIONS.UPDATE:
      return { ...state, items: state.items.map(i => (i.id === action.payload.id ? { ...i, ...action.payload } : i)) }
    case ACTIONS.DELETE:
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case ACTIONS.CLEAR:
      return { ...state, items: [] }
    default:
      return state
  }
}

const initialState = { items: [] }
const TransactionsContext = createContext(null)

export function TransactionsProvider({ children, useMock = true }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const saved = localStorageService.get(STORAGE_KEY, null)
    if (saved) {
      dispatch({ type: ACTIONS.SET, payload: saved })
    } else if (useMock) {
      mockApi.listTransactions().then(list => {
        dispatch({ type: ACTIONS.SET, payload: list })
        localStorageService.set(STORAGE_KEY, list)
      })
    }
  }, [useMock])

  useEffect(() => {
    localStorageService.set(STORAGE_KEY, state.items)
  }, [state.items])

  // new addTransaction: supports installments array
  const addTransaction = async payload => {
    // payload may be:
    // - { amount: number, ... } single
    // - { total: number, installments: [{amount, dueDate,...}], ... } multi
    if (payload.installments && Array.isArray(payload.installments) && payload.installments.length > 0) {
      // create each installment as individual transaction linked by parentId (optional)
      const created = []
      for (const inst of payload.installments) {
        const item = {
          title: payload.title,
          purchaser: payload.purchaser,
          category: payload.category,
          notes: payload.notes,
          amount: inst.amount,
          dueDate: inst.dueDate,
          installmentNumber: inst.installmentNumber,
          totalInstallments: inst.totalInstallments,
          parentTitle: payload.title,
          createdAt: new Date().toISOString(),
          type: payload.type || 'expense'
        }
        const createdItem = useMock ? await mockApi.createTransaction(item) : item
        dispatch({ type: ACTIONS.ADD, payload: createdItem })
        created.push(createdItem)
      }
      return created
    } else {
      const item = {
        title: payload.title,
        purchaser: payload.purchaser,
        category: payload.category,
        notes: payload.notes,
        amount: payload.amount ?? payload.total ?? 0,
        createdAt: new Date().toISOString(),
        type: payload.type || 'expense'
      }
      const createdItem = useMock ? await mockApi.createTransaction(item) : item
      dispatch({ type: ACTIONS.ADD, payload: createdItem })
      return createdItem
    }
  }

  const updateTransaction = async (id, changes) => {
    if (useMock) {
      const updated = await mockApi.updateTransaction(id, changes)
      dispatch({ type: ACTIONS.UPDATE, payload: updated })
      return updated
    } else {
      dispatch({ type: ACTIONS.UPDATE, payload: { id, ...changes } })
      return { id, ...changes }
    }
  }

  const deleteTransaction = async id => {
    if (useMock) {
      await mockApi.deleteTransaction(id)
      dispatch({ type: ACTIONS.DELETE, payload: id })
      return true
    } else {
      dispatch({ type: ACTIONS.DELETE, payload: id })
      return true
    }
  }

  const clearAll = () => {
    localStorageService.remove(STORAGE_KEY)
    dispatch({ type: ACTIONS.CLEAR })
  }

  return (
    <TransactionsContext.Provider
      value={{
        items: state.items,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearAll,
        reload: async () => {
          const list = await mockApi.listTransactions()
          dispatch({ type: ACTIONS.SET, payload: list })
        }
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext)
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider')
  return ctx
}
