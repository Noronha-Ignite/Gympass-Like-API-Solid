import { Controller } from '../../@types/http'

export const profile: Controller = async (req, reply) => {
  await req.jwtVerify()

  return reply.status(200).send({
    user: req.user,
  })
}
