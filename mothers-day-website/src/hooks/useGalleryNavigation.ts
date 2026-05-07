import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage gallery grid keyboard navigation
 * Handles arrow keys (left/right) with wrapping behavior
 * 
 * @param totalImages - Total number of images in gallery
 * @param imagesPerRow - Number of images per row (changes with screen size)
 * @returns {object} Navigation state and handlers
 */
export function useGalleryNavigation(totalImages: number, imagesPerRow: number = 3) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    e.preventDefault();
    
    setFocusedIndex((prevIndex) => {
      let newIndex = prevIndex;

      switch (e.key) {
        case 'ArrowRight':
          // Move to next image, wrap to start at end
          newIndex = (prevIndex + 1) % totalImages;
          break;
        case 'ArrowLeft':
          // Move to previous image, wrap to end at start
          newIndex = (prevIndex - 1 + totalImages) % totalImages;
          break;
        case 'ArrowDown':
          // Move to image below (next row)
          newIndex = (prevIndex + imagesPerRow) % totalImages;
          break;
        case 'ArrowUp':
          // Move to image above (previous row)
          newIndex = (prevIndex - imagesPerRow + totalImages) % totalImages;
          break;
        default:
          break;
      }

      return newIndex;
    });
  }, [totalImages, imagesPerRow]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { focusedIndex, setFocusedIndex };
}
