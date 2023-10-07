import { Controller } from '../../../@types/http'

export const refresh: Controller = async (req, reply) => {
  await req.jwtVerify({ onlyCookie: true })

  const { sub, role } = req.user

  const token = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
