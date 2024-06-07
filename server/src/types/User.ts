type SimpleUser = Pick<User, 'id' | 'name' | 'lastName' | 'picture'>

type User = {
  id: string
  name: string
  lastName: string | null
  picture: string | null
  providerId: string | null
  provider: string
  createdAt: Date
  updatedAt: Date
}

type newUser = {
  name: string
  lastName?: string
  picture?: string
  providerId?: string
  provider: string
}
