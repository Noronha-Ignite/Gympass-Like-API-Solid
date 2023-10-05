import { z } from 'zod'

import { Controller } from '../../../@types/http'

import { makeValidateCheckInService } from '../../../services/factories/make-validate-check-in-service'

export const validate: Controller = async (req, reply) => {
  const createCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = createCheckInParamsSchema.parse(req.params)

  const validateCheckInService = makeValidateCheckInService()

  await validateCheckInService.execute({
    checkInId,
  })

  return reply.status(204).send()
}
