import { useAnimationPreference } from '../../hooks/useAnimationPreference';
import { ANIMATION_CONFIG } from '../../constants/animations';
import type { GreetingAnimationProps } from './GreetingAnimation.types';
import styles from './GreetingAnimation.module.css';

/**
 * GreetingAnimation Component
 * Displays an animated greeting message with fade-in and slide effects
 * Respects user's prefers-reduced-motion setting
 * 
 * @component
 * @example
 * <GreetingAnimation 
 *   text="¡Feliz Día de las Madres! 💚" 
 *   subtitle="Con todo mi amor"
 * />
 */
export function GreetingAnimation({
  text,
  subtitle,
  duration = ANIMATION_CONFIG.greeting.duration,
  className = '',
}: GreetingAnimationProps) {
  const prefersReducedMotion = useAnimationPreference();

  const containerStyle = {
    animationDuration: `${duration}s`,
    animation: prefersReducedMotion ? 'none' : `${styles.fadeIn} ${duration}s ease-out forwards`,
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      style={containerStyle}
      role="region"
      aria-label="Greeting message"
    >
      <h1 className={styles.text}>
        {text}
      </h1>
      {subtitle && (
        <p className={styles.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
