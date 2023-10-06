import { Controller } from '../../../@types/http'

export const refresh: Controller = async (req, reply) => {
  await req.jwtVerify({ onlyCookie: true })

  const { sub } = req.user

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
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
