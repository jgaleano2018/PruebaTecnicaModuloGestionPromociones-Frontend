import { catchError, defer, from, mergeMap, throwError } from 'rxjs'
import { environment } from '../../config/environment'

const API_URL = environment.apiUrl

export function request(path, options = {}) {
  return defer(() => from(fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }))).pipe(
    mergeMap((response) => response.ok ? from([response]) : throwError(() => new Error(`API ${response.status}: ${response.statusText}`))),
    catchError((error) => throwError(() => error)),
  )
}
