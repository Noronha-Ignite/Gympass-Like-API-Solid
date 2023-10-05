import { PrismaCheckInsRepositories } from '../../repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsService } from '../get-user-metrics'

export const makeGetUserMetricsService = (): GetUserMetricsService => {
  const checkInsRepository = new PrismaCheckInsRepositories()

  const getUserMetricsService = new GetUserMetricsService(checkInsRepository)

  return getUserMetricsService
}
