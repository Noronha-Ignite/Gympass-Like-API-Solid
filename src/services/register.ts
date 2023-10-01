import { genSalt, hash } from 'bcryptjs'
import { prisma } from '../libs/prisma'
import { PrismaUsersRepositories } from '../repositories/prisma-users-repository'

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

  const password_hash = await hash(password, salt)

  const prismaUsersRepository = new PrismaUsersRepositories()

  return await prismaUsersRepository.create({
    email,
    name,
    password_hash,
  })
}
