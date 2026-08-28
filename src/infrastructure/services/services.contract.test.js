import { afterEach, describe, expect, it, vi } from 'vitest'
import { firstValueFrom } from 'rxjs'
import { request } from '../http/httpClient'
import { categoriaService } from './categoriaService'
import { estadoPromocionService } from './estadoPromocionService'
import { productoService } from './productoService'
import { promocionCategoriaService } from './promocionCategoriaService'
import { promocionProductoService } from './promocionProductoService'
import { promocionReglaService } from './promocionReglaService'
import { tipoDescuentoService } from './tipoDescuentoService'

const okResponse = { ok: true, json: async () => [] }

afterEach(() => vi.restoreAllMocks())

describe('entity service contracts', () => {
  it('maps each catalog service to its backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse)
    await Promise.all([
      firstValueFrom(categoriaService.list()),
      firstValueFrom(estadoPromocionService.list()),
      firstValueFrom(productoService.list()),
      firstValueFrom(promocionCategoriaService.list()),
      firstValueFrom(tipoDescuentoService.list()),
    ])
    const urls = fetchMock.mock.calls.map(([url]) => url)
    expect(urls).toEqual(expect.arrayContaining([
      'http://localhost:3000/api/v1/categorias',
      'http://localhost:3000/api/v1/estados-promocion',
      'http://localhost:3000/api/v1/productos',
      'http://localhost:3000/api/v1/promocion-categorias',
      'http://localhost:3000/api/v1/tipos-descuento',
    ]))
  })

  it('posts promotion products and rules', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse)
    await Promise.all([
      firstValueFrom(promocionProductoService.create({ promocionId: 1, productoId: 2 })),
      firstValueFrom(promocionReglaService.create({ promocionId: 1, diasSemana: 'L-V' })),
    ])
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/promocion-productos',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/promocion-reglas',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('propagates HTTP errors through the observable', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 503, statusText: 'Unavailable' })
    await expect(firstValueFrom(request('/api/v1/test'))).rejects.toThrow('API 503: Unavailable')
  })
})
