import prisma from '../../database/client'
import { IUserRepository } from '../../interfaces/repositories/IUserRepository'

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error)

      throw error
    }
  }

  create(userData: newUser): Promise<User> {
    const { name, lastName, picture, providerId, provider } = userData
    try {
      const user = prisma.user.create({
        data: {
          name,
          lastName,
          picture,
          providerId,
          provider,
        },
      })

      return user
    } catch (error) {
      console.error('Erro ao criar usuário:', error)

      throw error
    }
  }

  findByProviderId(providerId: string, provider: string): Promise<User | null> {
    try {
      const user = prisma.user.findFirst({
        where: {
          providerId,
          provider,
        },
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário por providerId:', error)

      throw error
    }
  }
}
