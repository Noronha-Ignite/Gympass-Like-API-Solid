import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { prisma } from '../../libs/prisma'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepositories implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const createdCheckIn = await prisma.checkIn.create({
      data,
    })

    return createdCheckIn
  }

  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      data: checkIn,
      where: {
        id: checkIn.id,
      },
    })

    return updatedCheckIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    return await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          lte: endOfTheDay.toDate(),
          gte: startOfTheDay.toDate(),
        },
      },
    })
  }

  async findById(id: string) {
    return await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
  }

  async findManyByUserId(userId: string, { page }: { page: number }) {
    const MAX_PAGE_LENGHT = 20

    return await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },

      take: MAX_PAGE_LENGHT,
      skip: MAX_PAGE_LENGHT * (page - 1),

      orderBy: {
        created_at: 'desc',
      },
    })
  }

  async countByUserId(userId: string) {
    return await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }
}
