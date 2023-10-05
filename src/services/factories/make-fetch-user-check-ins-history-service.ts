import { PrismaCheckInsRepositories } from '../../repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history'

export const makeFetchUserCheckInsHistoryService =
  (): FetchUserCheckInsHistoryService => {
    const checkInsRepository = new PrismaCheckInsRepositories()

    const fetchUserCheckInsHistoryService = new FetchUserCheckInsHistoryService(
      checkInsRepository,
    )

    return fetchUserCheckInsHistoryService
  }
