/* eslint-disable import/named */
import 'dotenv/config'

import { randomUUID } from 'crypto'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    const schema = randomUUID()
    const URL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = URL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
