import React from 'react'
import { formatMoney } from '../../utils/formatMoney'

export default function TransactionItem({ item, onEdit, onDelete }) {
  const installmentLabel = item.totalInstallments ? `${item.installmentNumber}/${item.totalInstallments}` : null

  return (
    <div className="flex items-center justify-between p-3 glass rounded-md mb-2">
      <div>
        <div className="text-sm opacity-70">{item.title}</div>
        <div className="text-xs opacity-50">
          {item.category} {item.purchaser ? `• ${item.purchaser}` : ''} {item.dueDate ? `• ${item.dueDate}` : ''}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`font-semibold ${item.type === 'expense' ? 'text-[var(--gold-soft)]' : 'text-[var(--neon-cyan)]'}`}>
          {formatMoney(Number(item.amount ?? 0))}
          {installmentLabel && <span className="ml-2 text-sm opacity-60">({installmentLabel})</span>}
        </div>
        <button onClick={() => onEdit(item)} className="text-sm opacity-70 hover:opacity-100">Editar</button>
        <button onClick={() => onDelete(item.id)} className="text-sm text-[var(--midnight-gold)] hover:text-[var(--gold-soft)]">Excluir</button>
      </div>
    </div>
  )
}
