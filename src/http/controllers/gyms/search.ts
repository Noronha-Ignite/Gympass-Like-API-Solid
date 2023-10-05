import { z } from 'zod'

import { Controller } from '../../../@types/http'

import { makeSearchGymService } from '../../../services/factories/make-search-gym-service'

export const search: Controller = async (req, reply) => {
  const searchGymQuerySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymQuerySchema.parse(req.query)

  const searchGymService = makeSearchGymService()

  const { gyms } = await searchGymService.execute({
    query,
    page,
  })

  return reply.status(200).send({ gyms })
}
