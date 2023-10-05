import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Nearby gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const mockNearCoords: Coords = {
      latitude: -8.1179919,
      longitude: -34.9175803,
    }

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...mockNearCoords,
        title: 'gym-01',
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...mockNearCoords,
        title: 'gym-02',
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: 0,
        longitude: 0,
        title: 'really-really-far-gym',
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: mockNearCoords.latitude,
        longitude: mockNearCoords.longitude,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(2)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        title: 'gym-01',
      }),
      expect.objectContaining({
        id: expect.any(String),
        title: 'gym-02',
      }),
    ])
  })
})
