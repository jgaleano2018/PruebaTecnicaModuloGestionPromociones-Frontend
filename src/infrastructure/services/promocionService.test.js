import { afterEach, describe, expect, it, vi } from 'vitest'
import { promocionService } from './promocionService'

const response = (body = {}) => ({ ok: true, json: async () => body })

describe('promocionService', () => {
  afterEach(() => vi.restoreAllMocks())

  it('uses the promotions collection endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response())
    promocionService.list().subscribe()
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/promociones',
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
    ))
  })

  it('sends PATCH to update a promotion state', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response())
    promocionService.updateState(7, { activa: true }).subscribe()
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/promociones/7/estado',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ activa: true }) }),
    ))
  })

  it('encodes date filters for the vigentes endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response())
    promocionService.current('2026-08-01', '2026-08-31').subscribe()
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/promociones/resumen/vigentes?fechaInicio=2026-08-01&fechaFin=2026-08-31',
      expect.anything(),
    ))
  })
})
