import { genSalt, hash } from 'bcryptjs'

import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

type RegisterServiceParams = {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceParams) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const salt = await genSalt(6)

    const password_hash = await hash(password, salt)

    return await this.usersRepository.create({
      email,
      name,
      password_hash,
    })
  }
}
