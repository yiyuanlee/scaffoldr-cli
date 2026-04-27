/**
 * Main library export
 */

export interface GreeterOptions {
  name?: string;
  greeting?: string;
}

export function greet(options: GreeterOptions = {}): string {
  const { name = 'World', greeting = 'Hello' } = options;
  return `${greeting}, ${name}!`;
}

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}
