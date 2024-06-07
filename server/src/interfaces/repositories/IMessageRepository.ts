export interface IMessageRepository {
  getAllMessages(): Message[]
  addMessage(message: Message): void
}

export type IMessageRepositoryClass = new () => IMessageRepository
