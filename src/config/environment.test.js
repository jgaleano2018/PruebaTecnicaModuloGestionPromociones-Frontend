import { describe, expect, it } from 'vitest'
import { environment } from './environment'

describe('environment', () => {
  it('exposes a backend URL without trailing slash', () => {
    expect(environment.apiUrl).toBe('http://localhost:3000')
    expect(environment.apiUrl.endsWith('/')).toBe(false)
  })
})
