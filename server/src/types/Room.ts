type Room = {
  id: string
  topic: string
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

type newRoom = {
  topic: string
  userId: string
}
