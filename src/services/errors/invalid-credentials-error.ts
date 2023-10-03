export class InvalidCredentialsError extends Error {
  constructor() {
    super('Inválid credentials.')
  }
}
