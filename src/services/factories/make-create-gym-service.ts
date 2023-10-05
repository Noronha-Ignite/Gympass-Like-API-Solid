import { PrismaGymsRepositories } from '../../repositories/prisma/prisma-gyms-repository'
import { CreateGymService } from '../create-gym'

export const makeCreateGymService = (): CreateGymService => {
  const gymsRepository = new PrismaGymsRepositories()

  const createGymService = new CreateGymService(gymsRepository)

  return createGymService
}
