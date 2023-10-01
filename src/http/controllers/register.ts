import { genSalt, hash } from 'bcryptjs'
import { z } from 'zod'
import { Controller } from '../../@types/http'
import { prisma } from '../../libs/prisma'

export const register: Controller = async (req, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    return reply.status(409).send()
  }

  const salt = await genSalt(6)

  const passwordHash = await hash(password, salt)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  })

  return reply.status(201).send()
}
