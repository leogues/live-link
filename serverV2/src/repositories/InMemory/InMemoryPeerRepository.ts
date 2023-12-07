import { IPeerRepository } from '../../interfaces/repositories/IPeerRepository'

export class InMemoryPeerRepository implements IPeerRepository {
  private peers: Record<string, Peer>

  constructor() {
    this.peers = {}
  }

  public getAllPeers(): Record<string, Peer | {}> {
    return this.peers
  }

  public addPeer(userId: string, peer: Peer): void {
    this.peers[userId] = peer
  }

  public getPeer(userId: string): Peer | undefined {
    return this.peers[userId]
  }

  public updatePeer(userId: string, newData: Partial<Peer>): void {
    if (this.peers[userId]) {
      this.peers[userId] = { ...this.peers[userId], ...newData }
    }
  }

  public removePeer(userId: string): void {
    delete this.peers[userId]
  }
}
