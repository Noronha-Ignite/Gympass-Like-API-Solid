// eslint-disable-next-line import/named
import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    console.log('setup')

    return {
      async teardown() {
        console.log('teardown')
      },
    }
  },
}
