import { z } from 'zod'

import { Controller } from '../../../@types/http'

import { makeFetchNearbyGymsService } from '../../../services/factories/make-fetch-nearby-gyms-service'

export const nearby: Controller = async (req, reply) => {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

  const fetchNearbyGymsService = makeFetchNearbyGymsService()

  const { gyms } = await fetchNearbyGymsService.execute({
    userCoords: {
      latitude,
      longitude,
    },
  })

  return reply.status(200).send({ gyms })
}
