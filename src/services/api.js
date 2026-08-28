import { defer, from, catchError, throwError, of } from 'rxjs'
import { environment } from '../config/environment'

const API_URL = environment.apiUrl

export const demoPromotions = [
  { id: 1, nombre: 'Descuento Verano 2026', descripcion: '20% de descuento en categoría Bebidas', tipoDescuentoId: 1, tipoDescuentoNombre: 'Porcentaje', valorDescuento: 20, cantidadMinima: 1, cantidadPagada: null, fechaInicio: '2026-08-01T00:00:00.000Z', fechaFin: '2026-08-31T23:59:59.000Z', activa: true, estadoPromocionId: 2, estadoPromocionNombre: 'Activa', productoIds: [1, 2], categoriaIds: [1] },
  { id: 2, nombre: 'Lleva 3 paga 2', descripcion: 'Promoción especial de temporada', tipoDescuentoId: 2, tipoDescuentoNombre: '3x2', valorDescuento: 0, cantidadMinima: 3, cantidadPagada: 2, fechaInicio: '2026-08-15T00:00:00.000Z', fechaFin: '2026-09-15T23:59:59.000Z', activa: false, estadoPromocionId: 1, estadoPromocionNombre: 'Programada', productoIds: [3], categoriaIds: [2] },
  { id: 3, nombre: 'Liquidación de invierno', descripcion: 'Precios especiales hasta agotar stock', tipoDescuentoId: 1, tipoDescuentoNombre: 'Porcentaje', valorDescuento: 35, cantidadMinima: null, cantidadPagada: null, fechaInicio: '2026-06-01T00:00:00.000Z', fechaFin: '2026-07-31T23:59:59.000Z', activa: false, estadoPromocionId: 3, estadoPromocionNombre: 'Finalizada', productoIds: [], categoriaIds: [3] },
]

const demoTypes = [{ id: 1, nombre: 'Porcentaje' }, { id: 2, nombre: '3x2' }, { id: 3, nombre: 'Valor fijo' }]
const demoStates = [{ id: 1, nombre: 'Programada' }, { id: 2, nombre: 'Activa' }, { id: 3, nombre: 'Finalizada' }]

function request(path, options) {
  return defer(() => from(fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options }))).pipe(
    catchError((error) => throwError(() => error)),
  )
}

export const promotionService = {
  list: () => request('/api/v1/promociones').pipe(catchError(() => of({ json: () => demoPromotions }))),
  create: (payload) => request('/api/v1/promociones', { method: 'POST', body: JSON.stringify(payload) }),
  updateState: (id, payload) => request(`/api/v1/promociones/${id}/estado`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/v1/promociones/${id}`, { method: 'DELETE' }),
  types: () => request('/api/v1/tipos-descuento'),
  states: () => request('/api/v1/estados-promocion'),
  countStates: () => request('/api/v1/promociones/resumen/conteo-estados'),
  current: (fromDate, toDate) => request(`/api/v1/promociones/resumen/vigentes?fechaInicio=${fromDate}&fechaFin=${toDate}`),
}

export { demoTypes, demoStates }
