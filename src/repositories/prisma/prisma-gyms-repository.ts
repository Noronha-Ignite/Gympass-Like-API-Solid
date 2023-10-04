import { Gym, Prisma } from '@prisma/client'
import { prisma } from '../../libs/prisma'
import { MAX_DISTANCE_TO_GYM, MAX_PAGE_LENGHT } from '../../utils/constants'
import { GymsRepository } from '../gyms-repository'

export class PrismaGymsRepositories implements GymsRepository {
  async create(params: Prisma.GymCreateInput) {
    return await prisma.gym.create({
      data: params,
    })
  }

  async findById(id: string) {
    return await prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }

  async findManyNearby({ latitude, longitude }: Coords) {
    const gymsNearby = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE (
        6371 * acos(
          cos(radians(${latitude})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(latitude))
        ) 
      ) <= ${MAX_DISTANCE_TO_GYM}
    `

    return gymsNearby
  }

  async searchMany(query: string, { page }: { page: number }) {
    return await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },

      take: MAX_PAGE_LENGHT,
      skip: MAX_PAGE_LENGHT * (page - 1),
    })
  }
}
