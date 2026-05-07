import { useEffect, useRef } from 'react';
import type { GalleryImageProps } from './Gallery.types';
import styles from './GalleryImage.module.css';

/**
 * GalleryImage Component
 * Renders a single image tile with lazy loading, error handling, and focus indicator
 * 
 * @component
 */
export function GalleryImage({
  image,
  isFocused,
  isLoaded,
  hasError,
  onLoad,
  onError,
  onRetry,
}: GalleryImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  // Auto-scroll focused image into view
  useEffect(() => {
    if (isFocused && imageRef.current) {
      imageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isFocused]);

  return (
    <div
      className={`${styles.imageContainer} ${isFocused ? styles.focused : ''}`}
      role="button"
      tabIndex={-1}
      aria-label={`Image: ${image.title}`}
    >
      {hasError ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorPlaceholder}>
            <p>⚠️ Unable to load</p>
            <p className={styles.errorTitle}>{image.title}</p>
            <button
              className={styles.retryButton}
              onClick={onRetry}
              aria-label={`Retry loading ${image.title}`}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className={styles.skeleton}>
              <div className={styles.skeletonShimmer} />
            </div>
          )}
          <img
            ref={imageRef}
            src={image.imageUrl}
            alt={image.altText}
            title={image.title}
            loading="lazy"
            className={`${styles.image} ${isLoaded ? styles.imageLoaded : ''}`}
            onLoad={onLoad}
            onError={onError}
          />
        </>
      )}
      <div className={styles.caption}>
        <h3>{image.title}</h3>
        {image.description && <p>{image.description}</p>}
      </div>
    </div>
  );
}
