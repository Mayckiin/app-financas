import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from '../Modal/Modal'
import Input from '../Input/Input'
import MoneyInput from '../MoneyInput/MoneyInput'
import Button from '../Button/Button'
import { uid } from '../../utils/id'

/**
 * LaunchModalForm
 * Props:
 * - open, onClose, onSubmit (onSubmit receberá payload *expandido*: se houver parcelas, envia installments array)
 */
export default function LaunchModalForm({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [purchaser, setPurchaser] = useState('')
  const [category, setCategory] = useState('')
  const [formattedTotal, setFormattedTotal] = useState('') // e.g. "R$ 1.234,56"
  const [installmentsCount, setInstallmentsCount] = useState(1)
  const [firstDueDate, setFirstDueDate] = useState('') // yyyy-mm-dd
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!firstDueDate) {
      // default: next month
      const d = new Date()
      d.setMonth(d.getMonth() + 1)
      const iso = d.toISOString().slice(0, 10)
      setFirstDueDate(iso)
    }
  }, [open])

  function parseCurrencyToCents(formatted) {
    // remove non-digits
    if (!formatted) return 0
    const digits = String(formatted).replace(/\D/g, '')
    return digits === '' ? 0 : Number(digits) // cents
  }

  function computeInstallments(totalCents, count, firstDue) {
    const per = Math.floor(totalCents / count) // cents per installment (floor)
    const remainder = totalCents - per * count
    const installments = []

    for (let i = 0; i < count; i++) {
      const amountCents = per + (i === 0 ? remainder : 0) // distribute remainder to first
      const d = new Date(firstDue)
      d.setMonth(d.getMonth() + i)
      installments.push({
        id: uid('inst_'),
        installmentNumber: i + 1,
        totalInstallments: count,
        dueDate: d.toISOString().slice(0, 10), // keep yyyy-mm-dd
        amount: amountCents / 100 // store as number in BRL
      })
    }
    return installments
  }

  const submit = () => {
    if (!title || !formattedTotal) return alert('Preencha título e valor.')
    const totalCents = parseCurrencyToCents(formattedTotal)
    if (totalCents <= 0) return alert('Valor inválido.')

    const payloadBase = {
      title,
      purchaser: purchaser || '—',
      category,
      notes,
      createdAt: new Date().toISOString(),
      type: 'expense' // or allow choose in future
    }

    if (installmentsCount > 1) {
      const installments = computeInstallments(totalCents, installmentsCount, firstDueDate)
      // Pass installments array; provider will expand into actual transactions
      onSubmit({ ...payloadBase, installments, total: totalCents / 100 })
    } else {
      // single transaction
      onSubmit({ ...payloadBase, amount: totalCents / 100 })
    }

    // reset
    setTitle('')
    setPurchaser('')
    setCategory('')
    setFormattedTotal('')
    setInstallmentsCount(1)
    setNotes('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Novo Lançamento</h3>

        <Input placeholder="Título (ex: Compra no mercado)" value={title} onChange={e => setTitle(e.target.value)} />
        <Input placeholder="Nome do comprador" value={purchaser} onChange={e => setPurchaser(e.target.value)} />
        <Input placeholder="Categoria" value={category} onChange={e => setCategory(e.target.value)} />

        <div>
          <label className="block text-sm text-muted mb-1">Valor total</label>
          <MoneyInput value={formattedTotal} onChange={setFormattedTotal} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-muted mb-1">Parcelas</label>
            <input
              type="number"
              min="1"
              value={installmentsCount}
              onChange={e => setInstallmentsCount(Math.max(1, Number(e.target.value || 1)))}
              className="w-full p-2 rounded bg-[var(--surface-700)]"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">1ª parcela (venc.)</label>
            <input
              type="date"
              value={firstDueDate}
              onChange={e => setFirstDueDate(e.target.value)}
              className="w-full p-2 rounded bg-[var(--surface-700)]"
            />
          </div>
        </div>

        <textarea placeholder="Notas (opcional)" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 rounded bg-[var(--surface-700)]" />

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit}>Salvar Lançamento</Button>
        </div>
      </div>
    </Modal>
  )
}

LaunchModalForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}
