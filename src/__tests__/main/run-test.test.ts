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

describe('Test the "runTest" functionality', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('executes multiple command-windows successfully on win32 ', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(os, 'platform').mockImplementation(() => 'win32')
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'command-if') {
        return 'true' // Return custom value
      }
      if (name === 'command-windows') {
        return 'echo "Hello", echo "World"' // Return custom value
      }
      return '' // Fallback value for any other input
    })
    const results = await main.runTest()
    expect(mockExec).toHaveBeenCalledTimes(2)
    expect(results).toEqual([0, 0])
  })

  it('executes multiple command successfully on win32 ', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(os, 'platform').mockImplementation(() => 'win32')
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'command-if') {
        return 'true' // Return custom value
      }
      if (name === 'command') {
        return 'echo "Hello", echo "World"' // Return custom value
      }
      return '' // Fallback value for any other input
    })
    const results = await main.runTest()
    expect(mockExec).toHaveBeenCalledTimes(2)
    expect(results).toEqual([0, 0])
  })
  it('executes multiple commands successfully on linux', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(os, 'platform').mockImplementation(() => 'linux')

    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'command-if') {
        return 'true' // Return custom value
      }
      if (name === 'command') {
        return 'echo "Hello", echo "World"' // Return custom value
      }
      return '' // Fallback value for any other input
    })
    const results = await main.runTest()
    expect(mockExec).toHaveBeenCalledTimes(2)
    expect(results).toEqual([0, 0])
  })

  it('skips execution if "command-if" is false', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'command-if') {
        return 'false' // Return custom value
      }
      if (name === 'command') {
        return 'echo "Hello", echo "World"' // Return custom value
      }
      return '' // Fallback value for any other input
    })
    const results = await main.runTest()
    expect(results).toBeFalsy()
  })

  it('skips execution if no commands was set', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'command-if') {
        return 'true' // Return custom value
      }
      if (name === 'command' || name === 'command-windows') {
        return '' // Return custom value
      }
      return '' // Fallback value for any other input
    })
    const results = await main.runTest()
    expect(results).toBeFalsy()
  })
})
