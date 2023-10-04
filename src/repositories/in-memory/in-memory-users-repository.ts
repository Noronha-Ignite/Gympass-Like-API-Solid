import { randomUUID } from 'node:crypto'
import { Prisma, User } from '@prisma/client'

import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  private _users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      created_at: new Date(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
    }

    this._users.push(user)

    return user
  }

  async findByEmail(email: string) {
    return this._users.find((user) => user.email === email) ?? null
  }

  async findById(id: string) {
    return this._users.find((user) => user.id === id) ?? null
  }
}
