/**
 * Unit tests for main.ts
 */

import { jest } from '@jest/globals'
import * as main from '../../main'
import * as ping from '../../ping'

jest.mock('../../ping')
jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('Test the "waitOnResource" functionality', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('Should wait on a single resource successfully', async () => {
    const resource = 'http://localhost:8080'
    const timeout = 60 //defualt timeout

    // Mock the ping function to resolve
    const pingMock = jest.spyOn(ping, 'ping').mockResolvedValue(undefined)

    const waitResources = resource
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)

    await expect(main.waitOnResource(resource)).resolves.not.toThrow()

    expect(pingMock).toHaveBeenCalledWith(waitResources, timeout * 1000)
  })

  it('Should wait on multiple resources successfully', async () => {
    const resources = 'http://localhost:8080,http://localhost:8081'
    const timeout = 60 // 60 seconds

    // Mock the ping function to resolve
    const pingMock = jest.spyOn(ping, 'ping').mockResolvedValue(undefined)
    const waitResources = resources
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)

    await expect(main.waitOnResource(resources, timeout)).resolves.not.toThrow()

    expect(pingMock).toHaveBeenCalledWith(waitResources, timeout * 1000)
  })

  it('Should throw an error if waiting on resources fails', async () => {
    const resource = 'http://localhost:8080'
    const timeout = 60 // 60 seconds

    // Mock the ping function to reject
    jest
      .spyOn(ping, 'ping')
      .mockRejectedValue(new Error('Failed to wait on resource'))

    await expect(main.waitOnResource(resource, timeout)).rejects.toThrow(
      'Failed to wait on resource'
    )
  })

  it('Should handle timeout correctly', async () => {
    const resource = 'http://timeout:1000'
    const timeout = 1 // 1 second

    await expect(main.waitOnResource(resource, timeout)).rejects.toThrow(
      'Failed to wait on resource'
    )
  })

  it('Should handle empty resource input', async () => {
    const timeout = 60 // 60 seconds

    await expect(main.waitOnResource('', timeout)).rejects.toThrow(
      'Failed to wait on resource'
    )
  })
})
