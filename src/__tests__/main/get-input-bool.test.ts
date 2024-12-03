/**
 * Unit tests for main.ts
 */

import * as core from '@actions/core'
import { jest } from '@jest/globals'
import * as main from '../../main'

jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('Test the "getInputBool" functionality', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

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
