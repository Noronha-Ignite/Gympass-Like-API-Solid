import { z } from 'zod'

import { Controller } from '../../@types/http'
import { PrismaUsersRepositories } from '../../repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../../services/authenticate'
import { InvalidCredentialsError } from '../../services/errors/invalid-credentials-error'

export const authenticate: Controller = async (req, reply) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateService = new AuthenticateService(
      new PrismaUsersRepositories(),
    )

    await authenticateService.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
