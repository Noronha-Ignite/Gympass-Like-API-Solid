import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  create(params: Prisma.GymCreateInput): Promise<Gym>

  findById(id: string): Promise<Gym | null>
  findManyNearby(coords: Coords): Promise<Gym[]>

  searchMany(query: string, params: { page: number }): Promise<Gym[]>
}
