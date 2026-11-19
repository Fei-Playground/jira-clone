import { type RefObject, useEffect, useState } from "react";

/**
 * Whether a single-line element's text is clipped by its box, i.e. rendered
 * with an ellipsis. Re-measures when the text or the viewport changes.
 */
export const useIsTruncated = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  value: string
): boolean => {
  const [isTruncated, setIsTruncated] = useState<boolean>(false);

  useEffect(() => {
    const checkTruncation = (): void => {
      const element = ref.current;
      if (!element) return;
      setIsTruncated(element.scrollWidth > element.clientWidth);
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [ref, value]);

  return isTruncated;
};
