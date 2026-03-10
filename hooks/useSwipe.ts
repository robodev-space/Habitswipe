// hooks/useSwipe.ts
// ─────────────────────────────────────────────────────────────────────────────
// SWIPE HOOK — Tracks drag direction and threshold for swipe cards
// Used by HabitCard component.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react"
import type { SwipeDirection } from "@/types"

interface UseSwipeOptions {
  threshold?: number           // px to trigger a swipe (default 100)
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

interface SwipeState {
  direction: SwipeDirection
  dragX: number               // current drag distance in px
  isDragging: boolean
}

export function useSwipe({
  threshold = 100,
  onSwipeLeft,
  onSwipeRight,
}: UseSwipeOptions = {}) {
  const [state, setState] = useState<SwipeState>({
    direction: null,
    dragX: 0,
    isDragging: false,
  })

  // Called by Framer Motion's onDrag
  const handleDrag = useCallback(
    (_event: any, info: { offset: { x: number } }) => {
      const x = info.offset.x
      setState({
        dragX: x,
        isDragging: true,
        direction: x > 0 ? "right" : x < 0 ? "left" : null,
      })
    },
    []
  )

  // Called by Framer Motion's onDragEnd
  const handleDragEnd = useCallback(
    (_event: any, info: { offset: { x: number } }) => {
      const x = info.offset.x

      if (x > threshold) {
        onSwipeRight?.()
      } else if (x < -threshold) {
        onSwipeLeft?.()
      }

      // Reset drag state (card snaps back if threshold not met)
      setState({ direction: null, dragX: 0, isDragging: false })
    },
    [threshold, onSwipeLeft, onSwipeRight]
  )

  // Derive visual cues from drag distance
  const swipeProgress = Math.min(Math.abs(state.dragX) / threshold, 1) // 0 → 1
  const isDoneIndicator = state.dragX > threshold * 0.3
  const isSkipIndicator = state.dragX < -(threshold * 0.3)

  return {
    ...state,
    swipeProgress,
    isDoneIndicator,
    isSkipIndicator,
    handleDrag,
    handleDragEnd,
  }
}
