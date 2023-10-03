import { PrismaUsersRepositories } from '../../repositories/prisma/prisma-users-repository'
import { RegisterService } from '../register'

export const makeRegisterService = (): RegisterService => {
  const usersRepository = new PrismaUsersRepositories()
  const registerService = new RegisterService(usersRepository)

  return registerService
}
