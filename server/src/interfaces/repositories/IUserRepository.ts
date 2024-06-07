export interface IUserRepository {
  findById(id: string): Promise<User | null>
  create(userData: newUser): Promise<User>
  findByProviderId(providerId: string, provider: string): Promise<User | null>
}
