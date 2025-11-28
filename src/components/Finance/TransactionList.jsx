import React, { useState } from 'react'
import TransactionItem from './TransactionItem'
import { useTransactions } from '../../context/TransactionsProvider'

export default function TransactionList() {
  const { items, deleteTransaction, updateTransaction } = useTransactions()
  const [filter, setFilter] = useState('all')
  const [searchName, setSearchName] = useState('')

  const filtered = items.filter(i => {
    if (filter !== 'all' && i.type !== filter) return false
    if (searchName && i.purchaser) {
      return i.purchaser.toLowerCase().includes(searchName.toLowerCase())
    }
    if (searchName && !i.purchaser) return false
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-3 py-1 rounded transition-all ${filter === 'all' ? 'bg-[var(--midnight-gold)] text-black' : 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('income')} 
            className={`px-3 py-1 rounded transition-all ${filter === 'income' ? 'bg-[var(--neon-cyan)] text-black' : 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]'}`}
          >
            Receitas
          </button>
          <button 
            onClick={() => setFilter('expense')} 
            className={`px-3 py-1 rounded transition-all ${filter === 'expense' ? 'bg-[var(--midnight-gold)] text-black' : 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)]'}`}
          >
            Despesas
          </button>
        </div>

        <div className="ml-auto w-64">
          <input
            placeholder="Buscar por comprador"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="w-full p-2 rounded bg-[var(--surface-700)] border border-[rgba(197,157,62,0.12)] focus:border-[var(--midnight-gold)] outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        {filtered.length === 0 && <div className="opacity-60 text-center py-8">Nenhuma transação encontrada</div>}
        {filtered.map(item => (
          <TransactionItem
            key={item.id}
            item={item}
            onEdit={itm => updateTransaction(itm.id, { ...itm, notes: (itm.notes || '') + ' (editado)' })}
            onDelete={id => deleteTransaction(id)}
          />
        ))}
      </div>
    </div>
  )
}
