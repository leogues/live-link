import { PeerMap } from "../../types/peer";

const maxPeersAvatars = 4;

export const ParticipantAvatars: React.FC<{ peers?: PeerMap }> = ({
  peers,
}) => {
  if (!peers) return null;

  const renderedPeersImg = Object.values(peers).slice(0, maxPeersAvatars);
  const remainingPeers = Object.values(peers).slice(maxPeersAvatars);
  const hasRemainingPeers = remainingPeers.length > 0;

  return (
    <div data-testid="participants-avatars" className="flex">
      {peers &&
        renderedPeersImg.map((peer) => {
          return (
            <div
              key={"avatar-" + peer.user?.id}
              className="-m-[0.4rem] h-10 w-10 min-w-max overflow-hidden rounded-full border-[3px] border-white dark:border-darkBlue-900 lg:h-12 lg:w-12"
            >
              <img className="block h-full" src={peer.user?.picture} />
            </div>
          );
        })}
      {hasRemainingPeers && (
        <div className="-m-[0.4rem] flex h-10 w-10 min-w-max items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-blue-50 dark:border-darkBlue-900 dark:bg-darkBlue-400 lg:h-12 lg:w-12">
          <span className="-ml-1 text-sm font-semibold text-blue-700">
            +{remainingPeers.length}
          </span>
        </div>
      )}
    </div>
  );
};
