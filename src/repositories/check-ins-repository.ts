import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(params: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, params: { page: number }): Promise<CheckIn[]>

  countByUserId(userId: string): Promise<number>
}
