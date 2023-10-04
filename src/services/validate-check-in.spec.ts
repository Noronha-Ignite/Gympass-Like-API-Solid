import { afterEach } from 'node:test'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { CheckInValidateTimeExpiredError } from './errors/check-in-validate-time-expired-error'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ValidateCheckInService } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate check in Service', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-01',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    const [firstRepositoryCheckIn] = checkInsRepository.checkIns

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(firstRepositoryCheckIn.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      sut.execute({ checkInId: 'fake-id-non-existent' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2020, 0, 1, 13, 40, 0))

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-01',
    })

    const oneHourInMiliseconds = 1000 * 60 * 60

    vi.advanceTimersByTime(oneHourInMiliseconds)

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(CheckInValidateTimeExpiredError)
  })
})
