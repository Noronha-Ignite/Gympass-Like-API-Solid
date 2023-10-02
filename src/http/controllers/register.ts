import { z } from 'zod'

import { Controller } from '../../@types/http'
import { PrismaUsersRepositories } from '../../repositories/prisma/prisma-users-repository'
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
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
