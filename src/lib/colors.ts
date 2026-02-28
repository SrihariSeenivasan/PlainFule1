/**
 * Color palette for PlainFuel
 * Primary: White (#F5F5F5)
 * Secondary: Green (#22c55e)
 * Accent: Black
 */

export const colors = {
  // Primary - used for backgrounds and main elements
  white: '#F5F5F5',
  
  // Secondary - used for text and accent elements
  green: '#22c55e',
  
  // Accent - used for emphasis
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
