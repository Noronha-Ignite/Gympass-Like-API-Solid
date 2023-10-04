import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CheckInService } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check in Service', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'gym 01',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userCoords: {
        latitude: 0,
        longitude: 0,
      },
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2020, 0, 10, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userCoords: {
        latitude: 0,
        longitude: 0,
      },
    })

    vi.setSystemTime(new Date(2020, 0, 11, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userCoords: {
        latitude: 0,
        longitude: 0,
      },
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2020, 0, 10, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userCoords: {
        latitude: 0,
        longitude: 0,
      },
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-01',
        userCoords: {
          latitude: 0,
          longitude: 0,
        },
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check in on distant gym', async () => {
    await expect(
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-01',
        userCoords: {
          latitude: -8.1179919,
          longitude: -34.9175803,
        },
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
