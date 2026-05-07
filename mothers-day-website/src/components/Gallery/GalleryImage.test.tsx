import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GalleryImage } from './GalleryImage';
import type { GalleryImage as GalleryImageType } from './Gallery.types';

const mockImage: GalleryImageType = {
  id: 1,
  title: 'Test Image',
  altText: 'Test alt text',
  imageUrl: '/images/test.webp',
  description: 'Test description',
};

describe('GalleryImage Component', () => {
  const mockOnLoad = vi.fn();
  const mockOnError = vi.fn();
  const mockOnRetry = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render image with correct attributes', () => {
    render(
      <GalleryImage
        image={mockImage}
        isFocused={false}
        isLoaded={true}
        hasError={false}
        onLoad={mockOnLoad}
        onError={mockOnError}
        onRetry={mockOnRetry}
      />
    );

    const img = screen.getByAltText('Test alt text');
    expect(img).toHaveAttribute('src', '/images/test.webp');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('title', 'Test Image');
  });

  it('should show title and description', () => {
    render(
      <GalleryImage
        image={mockImage}
        isFocused={false}
        isLoaded={true}
        hasError={false}
        onLoad={mockOnLoad}
        onError={mockOnError}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Test Image')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should display loading skeleton when isLoaded is false', () => {
    const { container } = render(
      <GalleryImage
        image={mockImage}
        isFocused={false}
        isLoaded={false}
        hasError={false}
        onLoad={mockOnLoad}
        onError={mockOnError}
        onRetry={mockOnRetry}
      />
    );

    expect(container.querySelector('.skeleton')).toBeInTheDocument();
  });

  it('should display error state with retry button', () => {
    render(
      <GalleryImage
        image={mockImage}
        isFocused={false}
        isLoaded={false}
        hasError={true}
        onLoad={mockOnLoad}
        onError={mockOnError}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Unable to load')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Retry loading/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    render(
      <GalleryImage
        image={mockImage}
        isFocused={false}
        isLoaded={false}
        hasError={true}
        onLoad={mockOnLoad}
        onError={mockOnError}
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /Retry loading/i });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('should apply focused class when isFocused is true', () => {
    const { container } = render(
      <GalleryImage
        image={mockImage}
        isFocused={true}
        isLoaded={true}
        hasError={false}
        onLoad={mockOnLoad}
        onError={mockOnError}
        onRetry={mockOnRetry}
      />
    );

    const imageContainer = container.querySelector('.imageContainer');
    expect(imageContainer).toHaveClass('focused');
  });

  it('should have proper ARIA label', () => {
    render(
      <GalleryImage
        image={mockImage}
        isFocused={false}
        isLoaded={true}
        hasError={false}
        onLoad={mockOnLoad}
        onError={mockOnError}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByRole('button', { name: /Image: Test Image/ })).toBeInTheDocument();
  });
});
