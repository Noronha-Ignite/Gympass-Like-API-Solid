import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Search gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    Array.from({ length: 2 }).forEach(async (_, index) => {
      await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `JS Gym ${(index + 1).toString().padStart(2, '0')}`,
          description: 'Some description',
          phone: '081987654321',
          latitude: 0,
          longitude: 0,
        })
    })

    const response = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({
        query: '01',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        id: expect.any(String),
      }),
    ])
  })
})
