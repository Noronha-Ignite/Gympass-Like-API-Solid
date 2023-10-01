import { genSalt, hash } from 'bcryptjs'
import { prisma } from '../libs/prisma'

type RegisterServiceParams = {
  name: string
  email: string
  password: string
}

export const registerService = async ({
  name,
  email,
  password,
}: RegisterServiceParams) => {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Email already exists')
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
}
