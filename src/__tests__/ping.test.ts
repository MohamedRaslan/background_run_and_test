/**
 * Unit tests for src/wait.ts
 */

import { ping } from '../ping'
import { expect } from '@jest/globals'

describe('Ping urls', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })
  it('Try to ping available url', async () => {
    const url = 'https://github.com/MohamedRaslan/background_run_and_test'

    const timeout = 2000 // 2sec

    await expect(ping(url, timeout)).resolves.not.toThrow()
  })

  it('Try to ping available urls', async () => {
    const urls = [
      'https://github.com/MohamedRaslan/background_run_and_test',
      'https-get://github.com/MohamedRaslan',
      'tcp:github.com:443'
    ]
    await expect(ping(urls)).resolves.not.toThrow()
  })

  it('Try to ping unavailable urls', async () => {
    const urls = [
      'http://localhost:4001',
      'http://localhost:4002',
      'http://localhost:4003',
      'file1',
      'http://foo.com:8000/bar',
      'https://my.com/cat',
      'http-get://foo.com:8000/bar',
      'https-get://my.com/cat',
      'tcp:foo.com:8000',
      'socket:/my/sock'
    ]
    const timeout = 1000 // 1sec

    await expect(async () => ping(urls, timeout)).rejects.toThrow(
      'Failed to wait on the requested resources'
    )
  })

  it('Try to ping available urls with 404 status code', async () => {
    const urls = [
      'https://github.com/MohamedRaslan/background_run_and_test',
      'https://github.com/MohamedRaslan'
    ]

    const timeout = 1000 // 1sec

    await expect(async () => ping(urls, timeout, 404)).rejects.toThrow(
      'Failed to wait on the requested resources'
    )
  })

  it('Try to ping available urls with 200 status code, and not secure', async () => {
    const urls = [
      'https://github.com/MohamedRaslan/background_run_and_test',
      'https://github.com/MohamedRaslan'
    ]

    const timeout = 2000 // 2sec

    await expect(ping(urls, timeout, 200, false)).resolves.not.toThrow()
  })
  it('Try to ping available url with 200 status code,scure, no logs', async () => {
    const urls = ['https://github.com/MohamedRaslan/background_run_and_test']

    const timeout = 2000 // 2sec

    await expect(ping(urls, timeout, 200, true, false)).resolves.not.toThrow()
  })
})
