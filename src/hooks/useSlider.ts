import { useCallback, useEffect, useRef } from "react";

export const useSlider = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  maxVal: number,
  onChange: (value: number) => void
) => {
  const moveHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const upHandlerRef = useRef<(() => void) | null>(null);

  // Auto clean up document event listeners on unmount
  useEffect(() => {
    return () => {
      if (moveHandlerRef.current) {
        document.removeEventListener("pointermove", moveHandlerRef.current);
      }
      if (upHandlerRef.current) {
        document.removeEventListener("pointerup", upHandlerRef.current);
      }
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    const width = rect.width;

    const updateValue = (clientX: number) => {
      const offsetX = Math.max(0, Math.min(clientX - rect.left, width));
      const percentage = offsetX / width;
      const index = Math.round(percentage * maxVal);
      onChange(index);
    };

    updateValue(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateValue(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      moveHandlerRef.current = null;
      upHandlerRef.current = null;
    };

    // Clean up any previously active listeners
    if (moveHandlerRef.current) {
      document.removeEventListener("pointermove", moveHandlerRef.current);
    }
    if (upHandlerRef.current) {
      document.removeEventListener("pointerup", upHandlerRef.current);
    }

    moveHandlerRef.current = handlePointerMove;
    upHandlerRef.current = handlePointerUp;

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  }, [trackRef, maxVal, onChange]);

  return handlePointerDown;
};
