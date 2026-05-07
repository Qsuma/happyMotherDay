import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGalleryNavigation } from './useGalleryNavigation';

describe('useGalleryNavigation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with focusedIndex at 0', () => {
    const { result } = renderHook(() => useGalleryNavigation(6, 3));
    expect(result.current.focusedIndex).toBe(0);
  });

  it('should move focus right on ArrowRight key', () => {
    const { result } = renderHook(() => useGalleryNavigation(6, 3));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
    });

    // Note: This test assumes the hook updates state synchronously
    // In real scenarios, you might need to use waitFor
    expect(result.current.focusedIndex).toBe(1);
  });

  it('should wrap to start when moving right from last image', () => {
    const { result } = renderHook(() => useGalleryNavigation(6, 3));

    // Move to last image
    for (let i = 0; i < 6; i++) {
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);
      });
    }

    // Should wrap back to 0
    expect(result.current.focusedIndex).toBe(0);
  });

  it('should move focus left on ArrowLeft key', () => {
    const { result } = renderHook(() => useGalleryNavigation(6, 3));

    // First move right once
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
    });

    // Then move left
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);
    });

    expect(result.current.focusedIndex).toBe(0);
  });

  it('should wrap to end when moving left from first image', () => {
    const { result } = renderHook(() => useGalleryNavigation(6, 3));

    // Move left from first image
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);
    });

    // Should wrap to last image (5)
    expect(result.current.focusedIndex).toBe(5);
  });

  it('should move down by imagesPerRow', () => {
    const { result } = renderHook(() => useGalleryNavigation(9, 3));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      window.dispatchEvent(event);
    });

    expect(result.current.focusedIndex).toBe(3);
  });

  it('should move up by imagesPerRow', () => {
    const { result } = renderHook(() => useGalleryNavigation(9, 3));

    // First move down
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      window.dispatchEvent(event);
    });

    // Then move up
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      window.dispatchEvent(event);
    });

    expect(result.current.focusedIndex).toBe(0);
  });

  it('should ignore non-arrow keys', () => {
    const { result } = renderHook(() => useGalleryNavigation(6, 3));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);
    });

    expect(result.current.focusedIndex).toBe(0);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useGalleryNavigation(6, 3));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
