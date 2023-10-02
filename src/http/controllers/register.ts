import { z } from 'zod'

import { Controller } from '../../@types/http'
import { PrismaUsersRepositories } from '../../repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '../../services/errors/user-already-exists-error'
import { RegisterService } from '../../services/register'

export const register: Controller = async (req, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const registerService = new RegisterService(new PrismaUsersRepositories())

    await registerService.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send()
  }

  return reply.status(201).send()
}
