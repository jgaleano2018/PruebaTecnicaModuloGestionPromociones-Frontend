import { request } from '../http/httpClient'

export function createListService(endpoint) {
  return {
    list: () => request(endpoint),
  }
}
