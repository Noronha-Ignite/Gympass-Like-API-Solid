import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'

import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private _checkIns: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      id: randomUUID(),
      created_at: new Date(),
    }

    this._checkIns.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = this._checkIns.find((iteratedCheckIn) => {
      const checkInDate = dayjs(iteratedCheckIn.created_at)
      const isOnSameDate =
        checkInDate.isBefore(endOfTheDay) && checkInDate.isAfter(startOfTheDay)

      return iteratedCheckIn.user_id === userId && isOnSameDate
    })

    return checkIn ?? null
  }

  async findManyByUserId(
    userId: string,
    { page }: { page: number } = { page: 1 },
  ) {
    const MAX_PAGE_LENGHT = 20

    return this._checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * MAX_PAGE_LENGHT, page * MAX_PAGE_LENGHT)
  }
}
