export interface GalleryImage {
  id: number;
  title: string;
  altText: string;
  imageUrl: string;
  description?: string;
}

export interface GalleryProps {
  images: GalleryImage[];
  className?: string;
}

export interface GalleryImageProps {
  image: GalleryImage;
  isFocused: boolean;
  isLoaded: boolean;
  hasError: boolean;
  onRetry: () => void;
  onLoad: () => void;
  onError: () => void;
}
