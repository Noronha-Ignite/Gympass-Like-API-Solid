// import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '../../../app'

describe('Create gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    console.log('ok')
  })
})
