import { IMessageRepository } from '../repositories/IMessageRepository'
import { IPeerRepository } from '../repositories/IPeerRepository'

export interface IActiveRoomService {
  getAllMessages(): Message[]
  addMessage(message: Message): void
  getAllPeers(): Record<string, Peer | {}>
  getPeer(peerId: string): Peer | undefined
  updatePeer(peerId: string, newData: Partial<Peer>): void
  addPeer(peerId: string, peer: Peer): void
  removePeer(peerId: string): void
}

export interface IActiveRoomServiceClass {
  new (
    roomId: string,
    messageRepository: IMessageRepository,
    peerRepository: IPeerRepository
  ): IActiveRoomService
}
