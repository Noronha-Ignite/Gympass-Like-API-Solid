import { z } from 'zod'

import { Controller } from '../../../@types/http'

import { makeCreateGymService } from '../../../services/factories/make-create-gym-service'

export const create: Controller = async (req, reply) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    phone: z.string().optional(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const gymData = createGymBodySchema.parse(req.body)

  const createGymService = makeCreateGymService()

  const { gym } = await createGymService.execute({
    ...gymData,
    description: gymData.description ?? null,
    phone: gymData.phone ?? null,
  })

  return reply.status(201).send({ id: gym.id })
}
