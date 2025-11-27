import React, { useState } from 'react'
import './LaunchModalForm.css'

export default function LaunchModalForm({ open, onClose, onSubmit }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('main')
  const [description, setDescription] = useState('')

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      account,
      description,
      date: new Date().toISOString()
    })
    // Reset form
    setAmount('')
    setCategory('')
    setDescription('')
    onClose()
  }

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Outros']
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nova Transação</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type Toggle */}
          <div className="type-toggle">
            <button
              type="button"
              className={`type-button ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`type-button ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              Receita
            </button>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount">Valor</label>
            <div className="input-wrapper">
              <span className="input-prefix">R$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
                className="input-amount"
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="input-select"
            >
              <option value="">Selecione...</option>
              {categories[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div className="form-group">
            <label htmlFor="account">Conta</label>
            <select
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
              className="input-select"
            >
              <option value="main">Conta Principal</option>
              <option value="savings">Poupança</option>
              <option value="credit">Cartão de Crédito</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Descrição (opcional)</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço no restaurante"
              className="input-text"
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
