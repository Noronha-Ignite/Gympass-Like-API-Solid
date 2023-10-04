import { randomUUID } from 'crypto'
import { Gym, Prisma } from '@prisma/client'
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
}
