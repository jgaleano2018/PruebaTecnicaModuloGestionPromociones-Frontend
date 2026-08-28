import { request } from '../http/httpClient'

export const promocionReglaService = {
  create: (payload) => request('/api/v1/promocion-reglas', { method: 'POST', body: JSON.stringify(payload) }),
}
