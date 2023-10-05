import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { nearby } from './nearby'
import { search } from './search'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.get('/search', search)
  app.get('/nearby', nearby)

  app.post('/', create)
}
