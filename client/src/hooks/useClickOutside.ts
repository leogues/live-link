import { RefObject, useEffect } from 'react';

type useClickOutsideOptions = {
  breakpoint?: number;
};

export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  fn: () => void,
  options?: useClickOutsideOptions
) => {
  useEffect(() => {
    const { breakpoint } = options || {};

    const element = ref?.current;
    const handleClickOutside = (event: Event) => {
      if (breakpoint && window.innerWidth > breakpoint) return;

      if (element && !element.contains(event.target as Node)) {
        fn();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, fn, options]);
};

export const useMultipleRefsClickOutside = <T extends HTMLElement>(
  refs: RefObject<T>[],
  fn: () => void,
  options?: useClickOutsideOptions
) => {
  useEffect(() => {
    const { breakpoint } = options || {};

    const handleClickOutside = (event: Event) => {
      if (breakpoint && window.innerWidth > breakpoint) return;

      const isOutside = refs.every(ref => {
        const element = ref.current;
        if (!element) return true;
        return element && !element.contains(event.target as Node);
      });

      if (isOutside) {
        fn();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [refs, fn, options]);
};
