import { PrismaUsersRepositories } from '../../repositories/prisma/prisma-users-repository'
import { GetUserProfileService } from '../get-user-profile'

export const makeGetUserProfileService = (): GetUserProfileService => {
  const usersRepository = new PrismaUsersRepositories()

  const getUserProfileService = new GetUserProfileService(usersRepository)

  return getUserProfileService
}
