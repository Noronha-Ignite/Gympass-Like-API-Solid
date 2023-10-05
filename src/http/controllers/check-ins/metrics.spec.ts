import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../libs/prisma'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Check-in metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the count of user check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const { id: gymId } = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -8.1179919,
        longitude: -34.9175803,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gymId,
          user_id: user.id,
        },
        {
          gym_id: gymId,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      checkInsCount: 2,
    })
  })
})
