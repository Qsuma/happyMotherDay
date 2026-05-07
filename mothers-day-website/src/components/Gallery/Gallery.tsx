import { useState, useCallback, useMemo } from 'react';
import { useGalleryNavigation } from '../../hooks/useGalleryNavigation';
import { GalleryImage } from './GalleryImage';
import type { GalleryProps } from './Gallery.types';
import styles from './Gallery.module.css';

/**
 * Gallery Component
 * Displays images in a responsive grid with keyboard navigation
 * Supports arrow key navigation with wrapping behavior
 * 
 * @component
 * @example
 * <Gallery images={imageArray} />
 */
export function Gallery({ images, className = '' }: GalleryProps) {
  // Track loading and error states for each image
  const [loadedStates, setLoadedStates] = useState<Record<number, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<number, boolean>>({});

  // Determine columns based on screen size (used for arrow up/down navigation)
  const imagesPerRow = useMemo(() => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1920) return 3;
    return 4;
  }, []);

  // Gallery keyboard navigation hook
  const { focusedIndex } = useGalleryNavigation(images.length, imagesPerRow);

  // Handle image load
  const handleImageLoad = useCallback((id: number) => {
    setLoadedStates((prev) => ({ ...prev, [id]: true }));
    setErrorStates((prev) => ({ ...prev, [id]: false }));
  }, []);

  // Handle image error
  const handleImageError = useCallback((id: number) => {
    setLoadedStates((prev) => ({ ...prev, [id]: false }));
    setErrorStates((prev) => ({ ...prev, [id]: true }));
  }, []);

  // Retry loading failed image
  const handleRetry = useCallback((id: number) => {
    setErrorStates((prev) => ({ ...prev, [id]: false }));
    setLoadedStates((prev) => ({ ...prev, [id]: false }));
  }, []);

  return (
    <div className={`${styles.galleryContainer} ${className}`}>
      <div
        className={styles.galleryGrid}
        role="region"
        aria-label="Image gallery"
        aria-describedby="gallery-description"
      >
        {images.map((image, index) => (
          <GalleryImage
            key={image.id}
            image={image}
            isFocused={index === focusedIndex}
            isLoaded={loadedStates[image.id] || false}
            hasError={errorStates[image.id] || false}
            onLoad={() => handleImageLoad(image.id)}
            onError={() => handleImageError(image.id)}
            onRetry={() => handleRetry(image.id)}
          />
        ))}
      </div>
      <p id="gallery-description" className={styles.instructions}>
        Use arrow keys to navigate • Click to focus • Images load lazily
      </p>
    </div>
  );
}
