import { Controller } from '../../../@types/http'

import { makeGetUserMetricsService } from '../../../services/factories/make-get-user-metrics-service'

export const metrics: Controller = async (req, reply) => {
  const getUserMetricsService = makeGetUserMetricsService()

  const { checkInsCount } = await getUserMetricsService.execute({
    userId: req.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
