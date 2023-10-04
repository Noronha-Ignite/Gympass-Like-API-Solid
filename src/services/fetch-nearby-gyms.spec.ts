import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch nearby gyms Service', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    const mockNearCoords: Coords = {
      latitude: -8.1179919,
      longitude: -34.9175803,
    }

    await gymsRepository.create({
      ...mockNearCoords,
      title: 'gym-01',
    })

    await gymsRepository.create({
      ...mockNearCoords,
      title: 'gym-02',
    })

    await gymsRepository.create({
      latitude: 0,
      longitude: 0,
      title: 'really-really-far-gym',
    })

    const { gyms } = await sut.execute({
      userCoords: mockNearCoords,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-01' }),
      expect.objectContaining({ title: 'gym-02' }),
    ])
  })
})
