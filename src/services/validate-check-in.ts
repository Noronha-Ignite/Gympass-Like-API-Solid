import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '../repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

type ValidateCheckInServiceRequest = {
  checkInId: string
}

type ValidateCheckInServiceResponse = {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const existingCheckIn = await this.checkInsRepository.findById(checkInId)

    if (!existingCheckIn) {
      throw new ResourceNotFoundError()
    }

    const checkInToBeSaved: CheckIn = {
      ...existingCheckIn,
      validated_at: new Date(),
    }

    const checkIn = await this.checkInsRepository.save(checkInToBeSaved)

    return { checkIn }
  }
}
