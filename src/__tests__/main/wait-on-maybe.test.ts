/**
 * Unit tests for main.ts
 */

import * as core from '@actions/core'
import { jest } from '@jest/globals'
import * as main from '../../main'

jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('Test the "waitOnMaybe" functionality', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('Waits on resources when conditions are met', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'wait-on')
        return '"https://github.com/MohamedRaslan/background_run_and_test","https-get://github.com/MohamedRaslan","tcp:github.com:443"' // Resource to wait for
      if (name === 'wait-if') return 'true' // Condition to wait
      return '' // Fallback value for any other input
    })
    const waitOnResourceMock = jest
      .spyOn(main, 'waitOnResource')
      .mockResolvedValue(undefined)
    await main.waitOnMaybe()
    expect(waitOnResourceMock).toHaveBeenCalledWith(
      '"https://github.com/MohamedRaslan/background_run_and_test","https-get://github.com/MohamedRaslan","tcp:github.com:443"',
      60
    ) // Default timeout
  })

  it('Skips waiting if "wait-if" is false', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'wait-if') return 'false' // Condition to skip waiting
      return '' // Fallback value for any other input
    })
    const waitOnResourceMock = jest.spyOn(main, 'waitOnResource')
    await main.waitOnMaybe()
    expect(waitOnResourceMock).not.toHaveBeenCalled() // Should not call waitOnResource
  })

  it('Skips waiting if no resources were set', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'wait-if') return 'true' // Condition to wait
      if (name === 'wait-on') return '' // No resource provided
      return '' // Fallback value for any other input
    })
    const waitOnResourceMock = jest.spyOn(main, 'waitOnResource')
    await main.waitOnMaybe()
    expect(waitOnResourceMock).not.toHaveBeenCalled() // Should not call waitOnResource
  })
})
