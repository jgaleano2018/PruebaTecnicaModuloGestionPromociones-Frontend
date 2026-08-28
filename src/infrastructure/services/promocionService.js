import { request } from '../http/httpClient'

const endpoint = '/api/v1/promociones'

export const promocionService = {
  list: () => request(endpoint),
  types: () => request('/api/v1/tipos-descuento'),
  states: () => request('/api/v1/estados-promocion'),
  create: (payload) => request(endpoint, { method: 'POST', body: JSON.stringify(payload) }),
  updateState: (id, payload) => request(`${endpoint}/${id}/estado`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`${endpoint}/${id}`, { method: 'DELETE' }),
  countStates: () => request(`${endpoint}/resumen/conteo-estados`),
  current: (fromDate, toDate) => request(`${endpoint}/resumen/vigentes?fechaInicio=${encodeURIComponent(fromDate)}&fechaFin=${encodeURIComponent(toDate)}`),
}
