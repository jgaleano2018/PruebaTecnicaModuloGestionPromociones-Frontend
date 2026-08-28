import { describe, expect, it } from 'vitest'
import { validatePromotion } from './validation'

describe('validatePromotion', () => {
  it('requires name and dates', () => {
    expect(validatePromotion({ nombre: '', fechaInicio: '', fechaFin: '', activa: false })).toEqual({
      nombre: 'El nombre es obligatorio',
      fechaInicio: 'Indica una fecha de inicio',
      fechaFin: 'Indica una fecha de fin',
    })
  })

  it('rejects an end date before the start date', () => {
    expect(validatePromotion({ nombre: 'Oferta', fechaInicio: '2026-08-20T10:00', fechaFin: '2026-08-19T10:00', activa: false })).toEqual({
      fechaFin: 'Debe ser posterior al inicio',
    })
  })

  it('accepts a complete promotion', () => {
    expect(validatePromotion({ nombre: 'Oferta', fechaInicio: '2026-08-19T10:00', fechaFin: '2026-08-20T10:00', valorDescuento: '20.50', cantidadMinima: '2', cantidadPagada: '1', activa: false })).toEqual({})
  })

  it('rejects invalid decimal and integer formats', () => {
    expect(validatePromotion({ nombre: 'Oferta', fechaInicio: '2026-08-19T10:00', fechaFin: '2026-08-20T10:00', valorDescuento: '20.555', cantidadMinima: '2.5', activa: true })).toMatchObject({
      valorDescuento: 'Usa un decimal con máximo 2 decimales',
      cantidadMinima: 'Debe ser un número entero',
    })
  })
})
