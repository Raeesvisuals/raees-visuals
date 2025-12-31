/**
 * Utility functions for performance optimizations
 */

/**
 * Check if device is mobile
 * Returns true if screen width is less than 768px
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if device has reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is low-end (for performance optimizations)
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Consider low-end if: < 4 cores OR < 4GB RAM
  return cores < 4 || memory < 4;
}

/**
 * Should disable heavy effects (WebGL, complex animations)
 * Returns true if we should disable heavy effects for performance
 */
export function shouldDisableHeavyEffects(): boolean {
  return isMobile() || isLowEndDevice() || prefersReducedMotion();
}

