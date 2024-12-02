/**
 * Unit tests for main.ts
 */

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as os from 'node:os'
import * as main from '../main'
import { jest } from '@jest/globals'

jest.mock('node:os') // Mock the os module
jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('Test core functions', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })
  afterAll(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('Test the "execCommand" functionality', () => {
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

  describe('Test the "getInputBool" functionality', () => {
    it('returns true for "true" input', () => {
      jest.spyOn(core, 'getInput').mockReturnValue('true')
      expect(main.getInputBool('test')).toBe(true)
    })

    it('returns true for "1" input', () => {
      jest.spyOn(core, 'getInput').mockReturnValue('1')
      expect(main.getInputBool('test')).toBe(true)
    })

    it('returns false for "false" input', () => {
      jest.spyOn(core, 'getInput').mockReturnValue('false')
      expect(main.getInputBool('test')).toBe(false)
    })

    it('returns false for "0" input', () => {
      jest.spyOn(core, 'getInput').mockReturnValue('false')
      expect(main.getInputBool('test')).toBe(false)
    })

    it('returns default value if input is empty', () => {
      jest.spyOn(core, 'getInput').mockReturnValue('')
      expect(main.getInputBool('test', true)).toBe(true)
    })
  })

  describe('Test the "runTest" functionality', () => {
    it('executes multiple commands successfully on win32 ', async () => {
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
      expect(results).toBeUndefined()
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
      expect(results).toBeUndefined()
    })
  })
  /*
  describe('Test the "run" functionality', () => {
    it('executes the full run process successfully on win32', async () => {
      // Mocking internal functions
      const startServersMaybeMock = jest
        .spyOn(main, 'startServersMaybe')
        .mockResolvedValue([])
      const waitOnMaybeMock = jest
        .spyOn(main, 'waitOnMaybe')
        .mockResolvedValue(undefined)
      const runTestMock = jest.spyOn(main, 'runTest').mockImplementation(() => {
        console.log('runTest is called') // Add a debug log
        return Promise.resolve([])
      })

      jest.spyOn(core, 'getInput').mockImplementation(name => {
        switch (name) {
          case 'start-if':
            return 'true' // Ensure servers start
          case 'start-windows':
            return 'echo "Hello"' // Allow waiting if required
          case 'wait-if':
            return 'false' // Avoid waiting
          case 'wait-on':
            return '"https://github.com/MohamedRaslan/background_run_and_test","https://github.com/MohamedRaslan"'
          case 'command-if':
            return 'true' // Allow running the defined test commands
          case 'command-windows':
            return 'echo "World"' // Provide the command
          default:
            return ''
        }
      })

      jest.spyOn(os, 'platform').mockImplementation(() => 'win32')
      jest.spyOn(core, 'setFailed').mockImplementation(msg => {
        console.error('setFailed called with:', msg)
      }) // Fake implementation to avoid test failure
      jest.spyOn(process, 'exit').mockImplementation((code?) => {
        console.log(`process.exit called with code: ${code}`)
        // Optionally throw an error here to simulate and handle exit in tests:
        throw new Error('process.exit') // This way you can catch it in the test
      })

      // Mocking `process.exit` to simulate a call without terminating the test
      jest.spyOn(process, 'exit').mockImplementation((code?) => {
        console.log(`process.exit called with code: ${code}`)
        throw new Error('process.exit') // Allows us to assert it was called in the test
      })

      // Run the main function and expect it to throw the simulated exit error
      await expect(main.run()).rejects.toThrow('process.exit')

      // Assertions to check if the mocked functions were called
      expect(startServersMaybeMock).toHaveBeenCalled() // Should be called
      expect(waitOnMaybeMock).toHaveBeenCalled() // Should be called
      expect(runTestMock).toHaveBeenCalled() // Should be called
      expect(process.exit).toHaveBeenCalled() // Ensure exit was called

      // Additionally log the results
      console.log(startServersMaybeMock.mock.calls) // Check how it was called
      console.log(waitOnMaybeMock.mock.calls) // Check how it was called
      console.log(runTestMock.mock.calls) // Check how it was called
    })
  })
      it('executes the full run process successfully on win32', async () => {
        // Mocking internal functions
        const startServersMaybeMock = jest
          .spyOn(main, 'startServersMaybe')
          .mockResolvedValue([])
        const waitOnMaybeMock = jest
          .spyOn(main, 'waitOnMaybe')
          .mockResolvedValue(undefined)
        const runTestMock = jest.spyOn(main, 'runTest').mockResolvedValue([])

        jest.spyOn(os, 'platform').mockImplementation(() => 'win32')
        jest.spyOn(core, 'setFailed').mockImplementation(() => {
          "Unkown error happend'"
        }) // Provide a fake implementation
        jest.spyOn(process, 'exit').mockImplementation(() => {
          throw new Error('process.exit')
        })

        jest.spyOn(core, 'getInput').mockImplementation(name => {
          switch (name) {
            case 'start-if':
              return 'true' // Ensure servers start
            case 'start-windows':
              return 'echo "Hello"' // Allow waiting if required
            case 'wait-if':
              return 'false' // Allow waiting if required
            case 'wait-on':
              return '"https://github.com/MohamedRaslan/background_run_and_test","https://github.com/MohamedRaslan"'
            case 'command-if':
              return 'true' // Allow running the defined test commands
            case 'command-windows':
              return 'echo "World"' // Provide the command
            default:
              return ''
          }
        })

        await expect(main.run()).rejects.toThrow('process.exit')
        expect(startServersMaybeMock).toHaveBeenCalled()
        expect(waitOnMaybeMock).toHaveBeenCalled()
        expect(runTestMock).toHaveBeenCalled()
      })
*/
})
