import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ValidateCheckInService } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate check in Service', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(checkInsRepository)
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
})
