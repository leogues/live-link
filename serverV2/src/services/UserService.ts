import { IUserRepository } from '../interfaces/repositories/IUserRepository'
import { IUserService } from '../interfaces/services/IUserService'

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }
  createUser(userData: newUser): Promise<User> {
    return this.userRepository.create(userData)
  }

  async getUserOrCreate(providerId: string, userData: newUser): Promise<User> {
    try {
      const { provider } = userData

      let user = await this.userRepository.findByProviderId(
        providerId,
        provider
      )

      if (!user) {
        user = await this.userRepository.create(userData)
      }

      return user
    } catch (error) {
      throw error
    }
  }
}
