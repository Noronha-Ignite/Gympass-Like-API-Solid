import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(params: Prisma.UserCreateInput): Promise<User>

  findByEmail(email: string): Promise<User | null>
}
