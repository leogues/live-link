export interface IMessageRepository {
  getAllMessages(): Message[]
  addMessage(message: Message): void
}

export interface IMessageRepositoryClass {
  new (): IMessageRepository
}
