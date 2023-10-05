import { z } from 'zod'

import { Controller } from '../../../@types/http'

import { makeCreateGymService } from '../../../services/factories/make-create-gym-service'

export const create: Controller = async (req, reply) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const gymData = createGymBodySchema.parse(req.body)

  const createGymService = makeCreateGymService()

  const { gym } = await createGymService.execute(gymData)

  return reply.status(201).send({ id: gym.id })
}
