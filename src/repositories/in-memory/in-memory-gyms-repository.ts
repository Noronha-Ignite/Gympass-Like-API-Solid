import { randomUUID } from 'crypto'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  private _gyms: Gym[] = []

  async create(params: Prisma.GymCreateInput) {
    const gym: Gym = {
      title: params.title,
      id: params.id ?? randomUUID(),
      description: params.description ?? null,
      phone: params.phone ?? null,
      latitude: new Decimal(Number(params.latitude)),
      longitude: new Decimal(Number(params.longitude)),
    }

    this._gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    return this._gyms.find((gym) => gym.id === id) ?? null
  }
}
