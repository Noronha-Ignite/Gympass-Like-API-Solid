import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '../repositories/check-ins-repository'
import { GymsRepository } from '../repositories/gyms-repository'
import {
  Coords,
  getDistanceBetweenCoordinates,
} from '../utils/get-distance-between-coordinates'
import { ResourceNotFoundError } from './errors/resource-not-found'

type CheckInServiceRequest = {
  userId: string
  gymId: string
  userCoords: Coords
}

type CheckInServiceResponse = {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userCoords,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const gymCoords: Coords = {
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }

    const distance = getDistanceBetweenCoordinates(userCoords, gymCoords)

    const MAX_DISTANCE_IN_KM = 0.1 // 100m

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new Error()
    }

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
