import { RefObject, useEffect } from "react";

export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  fn: () => void,
) => {
  useEffect(() => {
    const element = ref?.current;
    const handleClickOutside = (event: Event) => {
      if (element && !element.contains(event.target as Node)) {
        fn();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [ref, fn]);
};

export const useMultipleRefsClickOutside = <T extends HTMLElement>(
  refs: RefObject<T>[],
  fn: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const isOutside = refs.every((ref) => {
        const element = ref.current;
        return element && !element.contains(event.target as Node);
      });

      if (isOutside) {
        fn();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [refs, fn]);
};
