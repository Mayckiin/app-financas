import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FAB from '../FAB'

describe('FAB Component', () => {
  it('renderiza o botão corretamente', () => {
    render(<FAB onClick={() => {}} />)
    const button = screen.getByRole('button', { name: /adicionar nova transação/i })
    expect(button).toBeTruthy()
  })

  it('chama onClick quando clicado', () => {
    const handleClick = vi.fn()
    render(<FAB onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('possui a classe CSS correta', () => {
    render(<FAB onClick={() => {}} />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('fab-button')
  })

  it('renderiza o ícone SVG de adicionar', () => {
    const { container } = render(<FAB onClick={() => {}} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    
    const lines = container.querySelectorAll('line')
    expect(lines.length).toBe(2) // Ícone de "+" tem 2 linhas
  })

  it('possui aria-label para acessibilidade', () => {
    render(<FAB onClick={() => {}} />)
    const button = screen.getByLabelText('Adicionar nova transação')
    expect(button).toBeTruthy()
  })
})
