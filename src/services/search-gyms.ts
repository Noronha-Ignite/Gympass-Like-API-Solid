import { Gym } from '@prisma/client'

import { GymsRepository } from '../repositories/gyms-repository'

type SearchGymsServiceParams = {
  query?: string
  page?: number
}

type SearchGymsServiceResponse = {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute(
    { query = '', page = 1 }: SearchGymsServiceParams = {
      query: '',
      page: 1,
    },
  ): Promise<SearchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(query, { page })

    return {
      gyms,
    }
  }
}
