import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsService } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe('Get user metrics Service', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepository)
  })

  it('should be able get check in counts from metrics', async () => {
    Array.from({ length: 25 }).forEach(async (_, index) => {
      await checkInsRepository.create({
        gym_id: `gym-${index.toString().padStart(2, '0')}`,
        user_id: 'user-id',
      })
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-id',
    })

    expect(checkInsCount).toBe(25)
  })
})
