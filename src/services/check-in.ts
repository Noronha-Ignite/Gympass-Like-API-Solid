import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '../repositories/check-ins-repository'

type CheckInServiceRequest = {
  userId: string
  gymId: string
}

type CheckInServiceResponse = {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkInToday = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInToday) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
