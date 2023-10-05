import { PrismaCheckInsRepositories } from '../../repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepositories } from '../../repositories/prisma/prisma-gyms-repository'
import { CheckInService } from '../check-in'

export const makeCheckInService = (): CheckInService => {
  const checkInsRepository = new PrismaCheckInsRepositories()
  const gymsRepository = new PrismaGymsRepositories()

  const checkInService = new CheckInService(checkInsRepository, gymsRepository)

  return checkInService
}
