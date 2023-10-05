import { FastifyInstance } from 'fastify'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export const authenticatedRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.get('/me', profile)
}
