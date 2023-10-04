import { Gym } from '@prisma/client'

import { GymsRepository } from '../repositories/gyms-repository'

type CreateGymServiceParams = {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

type CreateGymServiceResponse = {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymServiceParams): Promise<CreateGymServiceResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    })

    return {
      gym,
    }
  }
}
