"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useOnClickOutside<TElement extends HTMLElement>(
  isActive: boolean,
  onOutsideClick: () => void,
  refs: Array<RefObject<TElement | null>>,
) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const clickedInside = refs.some((ref) => ref.current?.contains(target));

      if (!clickedInside) {
        onOutsideClick();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isActive, onOutsideClick, refs]);
}
