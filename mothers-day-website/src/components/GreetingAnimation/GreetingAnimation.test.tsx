import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GreetingAnimation } from './GreetingAnimation';

describe('GreetingAnimation', () => {
  it('should render greeting text', () => {
    render(
      <GreetingAnimation 
        text="¡Feliz Día de las Madres! 💚"
      />
    );
    expect(screen.getByText("¡Feliz Día de las Madres! 💚")).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(
      <GreetingAnimation 
        text="¡Feliz Día!" 
        subtitle="Con amor"
      />
    );
    expect(screen.getByText("Con amor")).toBeInTheDocument();
  });

  it('should have proper ARIA label for accessibility', () => {
    render(
      <GreetingAnimation 
        text="¡Feliz Día!"
      />
    );
    expect(screen.getByRole('region', { name: 'Greeting message' })).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    render(
      <GreetingAnimation 
        text="¡Feliz Día!"
      />
    );
    expect(screen.queryByText("Con amor")).not.toBeInTheDocument();
  });
});
