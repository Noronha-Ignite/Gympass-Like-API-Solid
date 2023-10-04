import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  create(params: Prisma.GymCreateInput): Promise<Gym>

  findById(id: string): Promise<Gym | null>
}
