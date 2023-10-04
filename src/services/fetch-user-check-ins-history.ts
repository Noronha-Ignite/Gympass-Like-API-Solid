import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '../repositories/check-ins-repository'

type FetchUserCheckInsHistoryServiceRequest = {
  userId: string
  page?: number
}

type FetchUserCheckInsHistoryServiceResponse = {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page = 1,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, {
      page,
    })

    return {
      checkIns,
    }
  }
}
