import { Controller } from '../../@types/http'
import { makeGetUserProfileService } from '../../services/factories/make-get-user-profile'

export const profile: Controller = async (req, reply) => {
  const getUserProfile = makeGetUserProfileService()

  const { user } = await getUserProfile.execute({
    userId: req.user.sub,
  })

  return reply.status(200).send({
    user,
  })
}
