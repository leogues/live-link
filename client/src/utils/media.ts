export const applyMediaConstraintsTransformations = (
  constraints: MediaStreamConstraints,
) => {
  if (constraints.audio) {
    constraints.audio = {
      noiseSuppression: true,
      echoCancellation: true,
    };
  }
  return constraints;
};
