import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { GetUserProfileService } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get user profile Service', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should be able to get user', async () => {
    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
    })

    const { user } = await sut.execute({ userId: id })

    expect(user.name).toBe('John Doe')
  })

  it('should not get user password_hash', async () => {
    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
    })

    const { user } = await sut.execute({ userId: id })

    expect(user).not.toHaveProperty('password_hash')
  })

  it('should not be able to get a user with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'fake-id-not-existent' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
