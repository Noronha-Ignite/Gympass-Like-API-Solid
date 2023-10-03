import { PrismaUsersRepositories } from '../../repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticate'

export const makeAuthenticateService = (): AuthenticateService => {
  const usersRepository = new PrismaUsersRepositories()
  const authenticateService = new AuthenticateService(usersRepository)

  return authenticateService
}
