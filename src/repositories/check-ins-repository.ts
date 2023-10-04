import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(params: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
