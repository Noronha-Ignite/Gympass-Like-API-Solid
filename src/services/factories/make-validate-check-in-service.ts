import { PrismaCheckInsRepositories } from '../../repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInService } from '../validate-check-in'

export const makeValidateCheckInService = (): ValidateCheckInService => {
  const checkInsRepository = new PrismaCheckInsRepositories()

  const validateCheckInService = new ValidateCheckInService(checkInsRepository)

  return validateCheckInService
}
