import { z } from 'zod'

import { Controller } from '../../../@types/http'

import { makeCheckInService } from '../../../services/factories/make-check-in-service'

export const create: Controller = async (req, reply) => {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(req.body)
  const gymId = createCheckInParamsSchema.parse(req.params).gymId

  const checkInService = makeCheckInService()

  const { checkIn } = await checkInService.execute({
    gymId,
    userCoords: {
      latitude,
      longitude,
    },
    userId: req.user.sub,
  })

  return reply.status(201).send({ id: checkIn.id })
}
