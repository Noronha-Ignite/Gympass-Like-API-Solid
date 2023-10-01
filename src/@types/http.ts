import { FastifyReply, FastifyRequest } from 'fastify'

export type Controller = (
  req: FastifyRequest,
  reply: FastifyReply,
) => Promise<FastifyReply>
