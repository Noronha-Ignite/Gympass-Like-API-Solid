import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../libs/prisma'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Create check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const { id: gymId } = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -8.1179919,
        longitude: -34.9175803,
      },
    })

    const response = await request(app.server)
      .post(`/check-ins/gyms/${gymId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -8.1179919,
        longitude: -34.9175803,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(String),
    })
  })
})
