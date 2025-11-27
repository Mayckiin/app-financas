import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LaunchModalForm from '../LaunchModalForm'

describe('LaunchModalForm Component', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    mockOnSubmit.mockClear()
  })

  it('não renderiza quando open é false', () => {
    const { container } = render(
      <LaunchModalForm open={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renderiza quando open é true', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    expect(screen.getByText('Nova Transação')).toBeTruthy()
  })

  it('chama onClose quando clica no overlay', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const overlay = document.querySelector('.modal-overlay')
    fireEvent.click(overlay)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('chama onClose quando clica no botão fechar', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const closeButton = screen.getByLabelText('Fechar')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('não fecha quando clica no conteúdo do modal', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const modalContent = document.querySelector('.modal-content')
    fireEvent.click(modalContent)
    
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('alterna entre Despesa e Receita', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const despesaButton = screen.getByText('Despesa')
    const receitaButton = screen.getByText('Receita')
    
    expect(despesaButton.className).toContain('active')
    expect(despesaButton.className).toContain('expense')
    
    fireEvent.click(receitaButton)
    
    expect(receitaButton.className).toContain('active')
    expect(receitaButton.className).toContain('income')
  })

  it('mostra categorias de despesa por padrão', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const select = screen.getByLabelText('Categoria')
    expect(select.innerHTML).toContain('Alimentação')
    expect(select.innerHTML).toContain('Transporte')
    expect(select.innerHTML).toContain('Moradia')
  })

  it('muda categorias ao alternar para Receita', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const receitaButton = screen.getByText('Receita')
    fireEvent.click(receitaButton)
    
    const select = screen.getByLabelText('Categoria')
    expect(select.innerHTML).toContain('Salário')
    expect(select.innerHTML).toContain('Freelance')
    expect(select.innerHTML).toContain('Investimentos')
  })

  it('atualiza o valor do campo amount', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByPlaceholderText('0,00')
    fireEvent.change(amountInput, { target: { value: '100.50' } })
    
    expect(amountInput.value).toBe('100.50')
  })

  it('atualiza o campo de descrição', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const descriptionInput = screen.getByPlaceholderText(/almoço no restaurante/i)
    fireEvent.change(descriptionInput, { target: { value: 'Teste de descrição' } })
    
    expect(descriptionInput.value).toBe('Teste de descrição')
  })

  it('submete o formulário com dados corretos', async () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    // Preenche o formulário
    const amountInput = screen.getByPlaceholderText('0,00')
    fireEvent.change(amountInput, { target: { value: '150.75' } })
    
    const categorySelect = screen.getByLabelText('Categoria')
    fireEvent.change(categorySelect, { target: { value: 'Alimentação' } })
    
    const accountSelect = screen.getByLabelText('Conta')
    fireEvent.change(accountSelect, { target: { value: 'savings' } })
    
    const descriptionInput = screen.getByPlaceholderText(/almoço no restaurante/i)
    fireEvent.change(descriptionInput, { target: { value: 'Jantar especial' } })
    
    // Submete
    const submitButton = screen.getByText('Confirmar')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'expense',
          amount: 150.75,
          category: 'Alimentação',
          account: 'savings',
          description: 'Jantar especial'
        })
      )
    })
  })

  it('fecha o modal após submissão bem-sucedida', async () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByPlaceholderText('0,00')
    fireEvent.change(amountInput, { target: { value: '50' } })
    
    const categorySelect = screen.getByLabelText('Categoria')
    fireEvent.change(categorySelect, { target: { value: 'Transporte' } })
    
    const submitButton = screen.getByText('Confirmar')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  it('reseta o formulário após submissão', async () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByPlaceholderText('0,00')
    const descriptionInput = screen.getByPlaceholderText(/almoço no restaurante/i)
    
    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.change(descriptionInput, { target: { value: 'Teste' } })
    
    const categorySelect = screen.getByLabelText('Categoria')
    fireEvent.change(categorySelect, { target: { value: 'Lazer' } })
    
    const submitButton = screen.getByText('Confirmar')
    fireEvent.click(submitButton)
    
    // Reabre o modal para verificar reset
    mockOnClose.mockClear()
    const { rerender } = render(
      <LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    )
    
    const newAmountInput = screen.getByPlaceholderText('0,00')
    const newDescriptionInput = screen.getByPlaceholderText(/almoço no restaurante/i)
    
    expect(newAmountInput.value).toBe('')
    expect(newDescriptionInput.value).toBe('')
  })

  it('chama onClose quando clica em Cancelar', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('possui campos obrigatórios', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByPlaceholderText('0,00')
    const categorySelect = screen.getByLabelText('Categoria')
    const accountSelect = screen.getByLabelText('Conta')
    
    expect(amountInput.required).toBe(true)
    expect(categorySelect.required).toBe(true)
    expect(accountSelect.required).toBe(true)
  })

  it('campo de descrição é opcional', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const descriptionInput = screen.getByPlaceholderText(/almoço no restaurante/i)
    expect(descriptionInput.required).toBe(false)
  })

  it('renderiza todas as opções de conta', () => {
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const accountSelect = screen.getByLabelText('Conta')
    expect(accountSelect.innerHTML).toContain('Conta Principal')
    expect(accountSelect.innerHTML).toContain('Poupança')
    expect(accountSelect.innerHTML).toContain('Cartão de Crédito')
  })

  it('inclui timestamp na submissão', async () => {
    const beforeSubmit = new Date().toISOString()
    
    render(<LaunchModalForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByPlaceholderText('0,00')
    fireEvent.change(amountInput, { target: { value: '50' } })
    
    const categorySelect = screen.getByLabelText('Categoria')
    fireEvent.change(categorySelect, { target: { value: 'Outros' } })
    
    const submitButton = screen.getByText('Confirmar')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expect.any(String)
        })
      )
      
      const submittedData = mockOnSubmit.mock.calls[0][0]
      const afterSubmit = new Date().toISOString()
      
      expect(submittedData.date >= beforeSubmit).toBe(true)
      expect(submittedData.date <= afterSubmit).toBe(true)
    })
  })
})
