import { randomUUID } from 'crypto'
import { Gym, Prisma } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '../../utils/get-distance-between-coordinates'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  private _gyms: Gym[] = []

  async create(params: Prisma.GymCreateInput) {
    const gym: Gym = {
      title: params.title,
      id: params.id ?? randomUUID(),
      description: params.description ?? null,
      phone: params.phone ?? null,
      latitude: new Prisma.Decimal(params.latitude.toString()),
      longitude: new Prisma.Decimal(params.longitude.toString()),
    }

    this._gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    return this._gyms.find((gym) => gym.id === id) ?? null
  }

  async searchMany(query: string, { page }: { page: number }) {
    const MAX_PAGE_LENGHT = 20

    return this._gyms
      .filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * MAX_PAGE_LENGHT, page * MAX_PAGE_LENGHT)
  }

  async findManyNearby(coords: Coords) {
    return this._gyms.filter((gym) => {
      const gymCoords: Coords = {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }

      const distance = getDistanceBetweenCoordinates(gymCoords, coords)

      return distance < 10 // All gyms in at least 10Km distance
    })
  }
}
