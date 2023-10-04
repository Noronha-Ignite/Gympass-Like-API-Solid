import { Gym } from '@prisma/client'

import { GymsRepository } from '../repositories/gyms-repository'

type FetchNearbyGymsServiceParams = {
  userCoords: Coords
}

type FetchNearbyGymsServiceResponse = {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userCoords,
  }: FetchNearbyGymsServiceParams): Promise<FetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby(userCoords)

    return {
      gyms,
    }
  }
}
