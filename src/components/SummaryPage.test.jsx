import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SummaryPage } from './SummaryPage'

const jsonResponse = (body) => ({ ok: true, json: async () => body })

afterEach(() => vi.restoreAllMocks())

describe('SummaryPage', () => {
  it('loads state counts and current promotions on mount', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (url.includes('conteo-estados')) return Promise.resolve(jsonResponse({ programada: 2, activa: 3, finalizada: 1, total: 6 }))
      return Promise.resolve(jsonResponse({ totalVigentes: 1, promociones: [{ id: 8, nombre: 'Oferta vigente', estadoPromocionNombre: 'Activa', tipoDescuentoNombre: 'Porcentaje', valorDescuento: 15 }] }))
    })
    render(<SummaryPage onExit={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Oferta vigente')).toBeInTheDocument())
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/v1/promociones/resumen/conteo-estados'), expect.anything())
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('fechaInicio=2026-08-01'), expect.anything())
  })

  it('sends selected dates when filters are submitted', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ programada: 0, activa: 0, finalizada: 0, total: 0 }))
    render(<SummaryPage onExit={vi.fn()} />)
    const dates = document.querySelectorAll('input[type="date"]')
    fireEvent.change(dates[0], { target: { value: '2026-09-01' } })
    await waitFor(() => expect(dates[0]).toHaveValue('2026-09-01'))
    fireEvent.change(dates[1], { target: { value: '2026-09-30' } })
    await waitFor(() => expect(dates[1]).toHaveValue('2026-09-30'))
    fireEvent.submit(screen.getByRole('button', { name: /Consultar/ }).closest('form'))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('fechaInicio=2026-09-01&fechaFin=2026-09-30'), expect.anything()))
  })

  it('reports an invalid date range without querying', async () => {
    const notify = vi.fn()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ programada: 0, activa: 0, finalizada: 0, total: 0 }))
    render(<SummaryPage onExit={vi.fn()} notify={notify} />)
    const dates = document.querySelectorAll('input[type="date"]')
    fireEvent.change(dates[0], { target: { value: '2026-09-30' } })
    await waitFor(() => expect(dates[0]).toHaveValue('2026-09-30'))
    fireEvent.change(dates[1], { target: { value: '2026-09-01' } })
    await waitFor(() => expect(dates[1]).toHaveValue('2026-09-01'))
    fireEvent.submit(screen.getByRole('button', { name: /Consultar/ }).closest('form'))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('El rango de fechas no es válido.'))
    expect(notify).not.toHaveBeenCalled()
  })
})
