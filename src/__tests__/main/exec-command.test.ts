/**
 * Unit tests for main.ts
 */

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { jest } from '@jest/globals'
import * as main from '../../main'

jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('Test the "execCommand" functionality', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })
  it("With it's defualt args", async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    const result = await main.execCommand('echo "Hello World"')
    expect(mockExec).toHaveBeenCalledWith(
      'bash',
      ['-c', 'echo "Hello World"'],
      expect.any(Object)
    )
    expect(result).toBe(0)
  })
  it('With custom args', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    const result = await main.execCommand(
      'echo "Hello World"',
      true,
      'Test command'
    )
    expect(mockExec).toHaveBeenCalledWith(
      'bash',
      ['-c', 'echo "Hello World"'],
      expect.any(Object)
    )
    expect(result).toBe(0)
  })

  it('With diffrent working-dirctory', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)

    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'working-directory') {
        return 'src/__tests__/build/' // Return custom value
      }
      return '' // Fallback value for any other input
    })
    const result = await main.execCommand(
      'echo "Hello World"',
      true,
      'Test command'
    )
    expect(mockExec).toHaveBeenCalledWith(
      'bash',
      ['-c', 'echo "Hello World"'],
      expect.any(Object)
    )
    expect(result).toBe(0)
  })
  it('handles execution failures', async () => {
    jest.spyOn(exec, 'exec').mockRejectedValue(new Error('Command failed'))
    await expect(main.execCommand('invalid-command', true)).rejects.toThrow(
      'Command failed'
    )
  })
})
