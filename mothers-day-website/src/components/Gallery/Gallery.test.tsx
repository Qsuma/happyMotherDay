import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Gallery } from './Gallery';
import type { GalleryImage } from './Gallery.types';

const mockImages: GalleryImage[] = [
  {
    id: 1,
    title: 'Image 1',
    altText: 'First image',
    imageUrl: '/images/1.webp',
    description: 'Description 1',
  },
  {
    id: 2,
    title: 'Image 2',
    altText: 'Second image',
    imageUrl: '/images/2.webp',
    description: 'Description 2',
  },
  {
    id: 3,
    title: 'Image 3',
    altText: 'Third image',
    imageUrl: '/images/3.webp',
  },
];

describe('Gallery Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all images from props', () => {
    render(<Gallery images={mockImages} />);
    
    expect(screen.getByAltText('First image')).toBeInTheDocument();
    expect(screen.getByAltText('Second image')).toBeInTheDocument();
    expect(screen.getByAltText('Third image')).toBeInTheDocument();
  });

  it('should render image titles and descriptions', () => {
    render(<Gallery images={mockImages} />);
    
    expect(screen.getByText('Image 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Image 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should set loading="lazy" on all images', () => {
    render(<Gallery images={mockImages} />);
    
    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  it('should render gallery region with aria-label', () => {
    render(<Gallery images={mockImages} />);
    
    const gallery = screen.getByRole('region', { name: 'Image gallery' });
    expect(gallery).toBeInTheDocument();
  });

  it('should display instructions for keyboard navigation', () => {
    render(<Gallery images={mockImages} />);
    
    expect(screen.getByText(/Use arrow keys to navigate/)).toBeInTheDocument();
  });

  it('should render empty gallery without errors', () => {
    const { container } = render(<Gallery images={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('should apply custom className prop', () => {
    const { container } = render(<Gallery images={mockImages} className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
