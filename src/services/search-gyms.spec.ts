import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsService } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search gyms Service', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    Array.from({ length: 5 }).forEach(async (_, index) => {
      await gymsRepository.create({
        latitude: index,
        longitude: index,
        title: `gym-${(index + 1).toString().padStart(2, '0')}`,
      })
    })

    const { gyms } = await sut.execute()

    expect(gyms).toHaveLength(5)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-01' }),
      expect.objectContaining({ title: 'gym-02' }),
      expect.objectContaining({ title: 'gym-03' }),
      expect.objectContaining({ title: 'gym-04' }),
      expect.objectContaining({ title: 'gym-05' }),
    ])
  })

  it('should be able to search queried gyms', async () => {
    Array.from({ length: 5 }).forEach(async (_, index) => {
      await gymsRepository.create({
        latitude: index,
        longitude: index,
        title: `gym-${(index + 1).toString().padStart(2, '0')}`,
      })
    })

    const { gyms } = await sut.execute({
      query: '02',
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym-02' })])
  })

  it('should be able to search paginated gyms', async () => {
    Array.from({ length: 25 }).forEach(async (_, index) => {
      await gymsRepository.create({
        latitude: index,
        longitude: index,
        title: `gym-${(index + 1).toString().padStart(2, '0')}`,
      })
    })

    const { gyms } = await sut.execute({
      page: 2,
    })

    expect(gyms).toHaveLength(5)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' }),
      expect.objectContaining({ title: 'gym-23' }),
      expect.objectContaining({ title: 'gym-24' }),
      expect.objectContaining({ title: 'gym-25' }),
    ])
  })

  it('should be able to search paginated queried gyms', async () => {
    Array.from({ length: 25 }).forEach(async (_, index) => {
      await gymsRepository.create({
        latitude: index,
        longitude: index,
        title: `gym-${(index + 1).toString().padStart(2, '0')}`,
      })
    })

    const { gyms } = await sut.execute({
      page: 2,
      query: 'gym',
    })

    expect(gyms).toHaveLength(5)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' }),
      expect.objectContaining({ title: 'gym-23' }),
      expect.objectContaining({ title: 'gym-24' }),
      expect.objectContaining({ title: 'gym-25' }),
    ])
  })
})
