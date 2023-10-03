import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Service', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    const credentials = {
      email: 'johndoe@email.com',
      password: '123456',
    }

    await usersRepository.create({
      name: 'John Doe',
      email: credentials.email,
      password_hash: await hash(credentials.password, 6),
    })

    const { user } = await sut.execute(credentials)

    expect(user.name).toBe('John Doe')
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    const credentials = {
      email: 'johndoe@email.com',
      password: '123456',
    }

    expect(() => sut.execute(credentials)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    const credentials = {
      email: 'johndoe@email.com',
      password: '123456',
    }

    await usersRepository.create({
      name: 'John Doe',
      email: credentials.email,
      password_hash: await hash(credentials.password, 6),
    })

    expect(() =>
      sut.execute({
        ...credentials,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
