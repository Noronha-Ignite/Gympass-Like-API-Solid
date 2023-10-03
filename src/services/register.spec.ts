import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterService } from './register'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const registerService = new RegisterService(new InMemoryUsersRepository())

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const registerService = new RegisterService(new InMemoryUsersRepository())

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const registerService = new RegisterService(new InMemoryUsersRepository())

    const data = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    }

    await registerService.execute(data)

    await expect(() => registerService.execute(data)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
