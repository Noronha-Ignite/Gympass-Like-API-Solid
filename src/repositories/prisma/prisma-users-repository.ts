import { Prisma } from '@prisma/client'
import { prisma } from '../../libs/prisma'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepositories implements UsersRepository {
  async create({ name, email, password_hash }: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
}
