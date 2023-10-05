import { PrismaGymsRepositories } from '../../repositories/prisma/prisma-gyms-repository'
import { SearchGymsService } from '../search-gyms'

export const makeSearchGymService = (): SearchGymsService => {
  const gymsRepository = new PrismaGymsRepositories()

  const searchGymService = new SearchGymsService(gymsRepository)

  return searchGymService
}
