import { IActiveRoomService } from '../interfaces/services/IActiveRoomService'
import { IPeerRepository } from '../interfaces/repositories/IPeerRepository'
import { IMessageRepository } from '../interfaces/repositories/IMessageRepository'

export class ActiveRoomService implements IActiveRoomService {
  constructor(
    public roomId: string,
    private messageRepository: IMessageRepository,
    private peerRepository: IPeerRepository
  ) {}

  public getAllMessages(): Message[] {
    return this.messageRepository.getAllMessages()
  }

  public addMessage(message: Message): void {
    this.messageRepository.addMessage(message)
  }

  public getAllPeers(): Record<string, Peer | {}> {
    return this.peerRepository.getAllPeers()
  }

  public getPeer(peerId: string): Peer | undefined {
    return this.peerRepository.getPeer(peerId)
  }

  public updatePeer(peerId: string, newData: Partial<Peer>): void {
    this.peerRepository.updatePeer(peerId, newData)
  }

  public addPeer(peerId: string, peer: Peer): void {
    this.peerRepository.addPeer(peerId, peer)
  }

  public removePeer(peerId: string): void {
    this.peerRepository.removePeer(peerId)
  }
}
