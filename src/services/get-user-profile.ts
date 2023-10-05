import { User } from '@prisma/client'

import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

type SanitizedUser = Omit<User, 'password_hash'>

type GetUserProfileServiceRequest = {
  userId: string
}

type GetUserProfileServiceResponse = {
  user: SanitizedUser
}

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    }
  }
}
