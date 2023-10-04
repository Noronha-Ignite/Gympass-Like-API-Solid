import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryService } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryService

describe('Fetch user check ins history Service', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(checkInsRepository)
  })

  it('should be able fetch user check in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-id',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-id',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    Array.from({ length: 25 }).forEach(async (_, index) => {
      await checkInsRepository.create({
        gym_id: `gym-${(index + 1).toString().padStart(2, '0')}`,
        user_id: 'user-id',
      })
    })

    const { checkIns } = await sut.execute({
      userId: 'user-id',
      page: 2,
    })

    expect(checkIns).toHaveLength(5)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
      expect.objectContaining({ gym_id: 'gym-23' }),
      expect.objectContaining({ gym_id: 'gym-24' }),
      expect.objectContaining({ gym_id: 'gym-25' }),
    ])
  })
})
