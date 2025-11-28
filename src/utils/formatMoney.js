export function formatMoney(value) {
  const n = Number(value || 0)
  if (!Number.isFinite(n)) return 'R$ 0,00'
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
