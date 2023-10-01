import { Prisma } from '@prisma/client'
import { prisma } from '../libs/prisma'

export class PrismaUsersRepositories {
  async create({ name, email, password_hash }: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    })
  }
}
