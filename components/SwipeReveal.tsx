"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export interface SwipeAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}

interface SwipeRevealProps {
  children: ReactNode;
  actions: SwipeAction[];
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const ACTION_WIDTH = 72;
const DRAG_THRESHOLD = 10;

export function SwipeReveal({ children, actions, className = "", onOpenChange }: SwipeRevealProps) {
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const isDragging = useRef(false);
  const hasPassedThreshold = useRef(false);
  const blockNextClick = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxOffset = actions.length * ACTION_WIDTH;
  const openThreshold = maxOffset * 0.35;

  const snap = useCallback(
    (value: number) => {
      const next = Math.abs(value) > openThreshold ? -maxOffset : 0;
      setIsAnimating(true);
      setOffset(next);
      onOpenChange?.(next !== 0);
      return next;
    },
    [maxOffset, onOpenChange, openThreshold]
  );

  const close = useCallback(() => {
    setIsAnimating(true);
    setOffset(0);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [close]);

  const handleStart = (clientX: number) => {
    startX.current = clientX;
    startOffset.current = offset;
    isDragging.current = true;
    hasPassedThreshold.current = false;
    setIsAnimating(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) {
      return;
    }

    const delta = clientX - startX.current;

    if (!hasPassedThreshold.current && Math.abs(delta) < DRAG_THRESHOLD) {
      return;
    }

    hasPassedThreshold.current = true;
    const next = Math.min(0, Math.max(-maxOffset, startOffset.current + delta));
    setOffset(next);
  };

  const handleEnd = () => {
    if (!isDragging.current) {
      return;
    }

    isDragging.current = false;

    if (hasPassedThreshold.current) {
      blockNextClick.current = true;
      snap(offset);
      return;
    }

    setIsAnimating(true);
  };

  const handleClickCapture = (event: React.MouseEvent) => {
    if (blockNextClick.current) {
      event.preventDefault();
      event.stopPropagation();
      blockNextClick.current = false;
    }
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div
        className="absolute inset-y-0 right-0 flex"
        style={{ width: maxOffset }}
        aria-hidden={offset === 0}
      >
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              action.onClick();
              close();
            }}
            className={`flex w-[72px] flex-col items-center justify-center gap-1 text-xs font-medium transition-opacity ${
              action.className ?? "bg-white/10 text-white"
            }`}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      <div
        className={`relative touch-pan-y select-none ${
          isAnimating ? "transition-transform duration-300 ease-out" : ""
        }`}
        style={{ transform: `translateX(${offset}px)` }}
        onClickCapture={handleClickCapture}
        onTouchStart={(event) => handleStart(event.touches[0].clientX)}
        onTouchMove={(event) => handleMove(event.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(event) => {
          if (event.button !== 0) {
            return;
          }
          handleStart(event.clientX);
        }}
        onMouseMove={(event) => {
          if (!isDragging.current) {
            return;
          }
          handleMove(event.clientX);
        }}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          if (isDragging.current) {
            handleEnd();
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
