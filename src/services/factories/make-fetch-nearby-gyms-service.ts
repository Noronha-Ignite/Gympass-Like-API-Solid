import { PrismaGymsRepositories } from '../../repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms'

export const makeFetchNearbyGymsService = (): FetchNearbyGymsService => {
  const gymsRepository = new PrismaGymsRepositories()

  const fetchNearbyGymsService = new FetchNearbyGymsService(gymsRepository)

  return fetchNearbyGymsService
}
