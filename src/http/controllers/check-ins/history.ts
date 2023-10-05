import { z } from 'zod'

import { Controller } from '../../../@types/http'

import { makeFetchUserCheckInsHistoryService } from '../../../services/factories/make-fetch-user-check-ins-history-service'

export const history: Controller = async (req, reply) => {
  const createCheckInQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = createCheckInQuerySchema.parse(req.query)

  const fetchUserCheckInsHistoryService = makeFetchUserCheckInsHistoryService()

  const { checkIns } = await fetchUserCheckInsHistoryService.execute({
    page,
    userId: req.user.sub,
  })

  return reply.status(200).send({ checkIns })
}
