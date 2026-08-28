import { request } from '../http/httpClient'

export const promocionProductoService = {
  list: () => request('/api/v1/promocion-productos'),
  create: (payload) => request('/api/v1/promocion-productos', { method: 'POST', body: JSON.stringify(payload) }),
}
