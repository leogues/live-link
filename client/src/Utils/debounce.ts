export const debounce = (delay: number, callback?: Function) => {
  let timeout: number;

  return function () {
    clearTimeout(timeout);
    if (callback) timeout = setTimeout(callback, delay);
  };
};
