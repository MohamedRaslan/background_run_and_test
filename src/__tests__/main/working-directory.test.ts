/**
 * Additional tests for uncovered GitHub Action inputs, especially working-directory
 */
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { jest } from '@jest/globals'
import * as main from '../../main'
import path from 'node:path'

jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('GitHub Action uncovered inputs', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('execCommand uses absolute working-directory', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'working-directory') {
        return './src/__tests__/build/app2' // relative path
      }
      return ''
    })
    const result = await main.execCommand('echo "Test"', true, 'Test label')
    const expectedCwd = path.resolve('./src/__tests__/build/app2')
    expect(mockExec).toHaveBeenCalledWith(
      'bash',
      ['-c', 'echo "Test"'],
      expect.objectContaining({ cwd: expectedCwd })
    )
    expect(result).toBe(0)
  })

  it('execCommand falls back to process.cwd() if no working-directory', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(core, 'getInput').mockReturnValue('')
    const result = await main.execCommand('echo "Test"', true, 'Test label')
    expect(mockExec).toHaveBeenCalledWith(
      'bash',
      ['-c', 'echo "Test"'],
      expect.objectContaining({ cwd: process.cwd() })
    )
    expect(result).toBe(0)
  })

  it('runTest uses working-directory for each command', async () => {
    const mockExec = jest.spyOn(exec, 'exec').mockResolvedValue(0)
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'command-if') return 'true'
      if (name === 'command') return 'echo "A", echo "B"'
      if (name === 'working-directory') return './src/__tests__/build/app3'
      return ''
    })
    const results = await main.runTest()
    expect(mockExec).toHaveBeenCalledTimes(2)
    const expectedCwd = path.resolve('./src/__tests__/build/app3')
    for (const call of mockExec.mock.calls) {
      expect(call[2]).toEqual(expect.objectContaining({ cwd: expectedCwd }))
    }
    expect(results).toEqual([0, 0])
  })
})
