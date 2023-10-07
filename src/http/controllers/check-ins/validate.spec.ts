import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../libs/prisma'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Validate check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    const user = await prisma.user.findFirstOrThrow()

    const { id: gymId } = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -8.1179919,
        longitude: -34.9175803,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gymId,
        user_id: user.id,
      },
    })

    expect(checkIn.validated_at).toBeNull()

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
