export class InMemoryMessageRepository {
  private messages: Message[]

  constructor() {
    this.messages = []
  }

  public getAllMessages(): Message[] {
    return this.messages
  }

  public addMessage(message: Message): void {
    this.messages.push(message)
  }
}
