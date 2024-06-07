export interface IUserService {
  getUserById(id: string): Promise<User | null>
  createUser(userData: newUser): Promise<User>
  getUserOrCreate(providerId: string, userData: newUser): Promise<User>
}
