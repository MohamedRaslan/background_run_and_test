/**
 * Unit tests for main.ts
 */

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { jest } from '@jest/globals'
import * as os from 'node:os'
import * as main from '../../main'

jest.mock('node:os')
jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('Test the "startServersMaybe" functionality', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('executes multiple start-commands successfully on win32', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(os, 'platform').mockImplementation(() => 'win32')
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'start-if') return 'true' // Simulate condition to start
      if (name === 'start-windows') return 'echo "Hello", echo "World"' // Commands to start
      return '' // Fallback value for any other input
    })
    const results = await main.startServersMaybe()
    expect(mockExec).toHaveBeenCalledTimes(2)
    expect(results).toEqual([false, false])
  })

  it('executes multiple commands successfully on win32', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(os, 'platform').mockImplementation(() => 'win32')
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'start-if') return 'true' // Simulate condition to start
      if (name === 'start') return 'echo "Hello", echo "World"' // Commands to start
      return '' // Fallback value for any other input
    })
    const results = await main.startServersMaybe()
    expect(mockExec).toHaveBeenCalledTimes(2)
    expect(results).toEqual([false, false])
  })
  it('executes multiple commands successfully on linux', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(os, 'platform').mockImplementation(() => 'linux')
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'start-if') return 'true' // Simulate condition to start
      if (name === 'start') return 'echo "Hello", echo "World"' // Commands to start
      return '' // Fallback value for any other input
    })
    const results = await main.startServersMaybe()
    expect(mockExec).toHaveBeenCalledTimes(2)
    expect(results).toEqual([false, false])
  })

  it('skips execution if "start-if" is false', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'start-if') return 'false' // Simulate condition to skip
      if (name === 'start') return 'echo "Hello", echo "World"' // Commands to start

      return '' // Fallback value for any other input
    })
    const results = await main.startServersMaybe()
    expect(results).toBeFalsy() // Should not execute any commands
  })

  it('skips execution if no start commands were set', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'start-if') return 'true' // Simulate condition to start
      if (name === 'start' || name === 'start-windows') return '' // No commands provided
      return '' // Fallback value for any other input
    })
    const results = await main.startServersMaybe()
    expect(results).toBeFalsy() // Should not execute any commands
  })
})
