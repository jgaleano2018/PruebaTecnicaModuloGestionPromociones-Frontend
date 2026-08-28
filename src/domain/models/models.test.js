import { describe, expect, it } from 'vitest'
import { Categoria, EstadoPromocion, Producto, Promocion, PromocionCategoria, PromocionProducto, PromocionRegla, TipoDescuento } from './index'

describe('domain models', () => {
  it('creates entities with frontend-safe defaults', () => {
    expect(new Categoria().activo).toBe(true)
    expect(new EstadoPromocion().promociones).toEqual([])
    expect(new Producto().stockActual).toBe(0)
    expect(new Promocion().reglas).toEqual([])
    expect(new PromocionCategoria({ categoriaId: 4 }).categoriaId).toBe(4)
    expect(new PromocionProducto({ productoId: 5 }).productoId).toBe(5)
    expect(new PromocionRegla({ diasSemana: 'L-V' }).diasSemana).toBe('L-V')
    expect(new TipoDescuento({ nombre: 'Porcentaje' }).nombre).toBe('Porcentaje')
  })
})
