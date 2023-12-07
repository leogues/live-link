export interface IPeerRepository {
  addPeer(userId: string, peer: Peer): void
  getAllPeers(): Record<string, Peer | {}>
  getPeer(userId: string): Peer | undefined
  updatePeer(userId: string, newData: Partial<Peer>): void
  removePeer(userId: string): void
}

export interface IPeerRepositoryClass {
  new (): IPeerRepository
}
