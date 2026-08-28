import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

beforeEach(() => {
  globalThis.fetch = vi.fn().mockRejectedValue(new Error('backend unavailable'))
})
afterEach(() => vi.restoreAllMocks())

describe('App', () => {
  it('starts on the promotions home and loads demo data when API is unavailable', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Gestión de promociones' })).toBeInTheDocument()
    expect(screen.getByText('Descuento Verano 2026')).toBeInTheDocument()
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())
  })

  it('navigates to the summary view and collapses the menu', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Vista de resumen' }))
    expect(screen.getByRole('heading', { name: 'Vista de resumen' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Contraer menú' }))
    expect(screen.queryByText('Gestión de promociones')).not.toBeInTheDocument()
  })

  it('shows required errors when saving an empty promotion', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    fireEvent.change(screen.getByLabelText('Fecha inicio *'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Fecha fin *'), { target: { value: '' } })
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('Indica una fecha de inicio')).toBeInTheDocument()
    expect(screen.getByText('Indica una fecha de fin')).toBeInTheDocument()
  })

  it('closes the promotion modal with cancel', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('heading', { name: 'Adicionar promoción' })).not.toBeInTheDocument()
  })

  it('asks for confirmation and removes a promotion', async () => {
    const user = userEvent.setup()
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Eliminar Descuento Verano 2026' }))
    await waitFor(() => expect(screen.queryByText('Descuento Verano 2026')).not.toBeInTheDocument())
  })
})
