import { greet, add, subtract } from '../src/index';

describe('greet', () => {
  it('should greet with default values', () => {
    expect(greet()).toBe('Hello, World!');
  });

  it('should greet with custom name', () => {
    expect(greet({ name: 'Yiyuan' })).toBe('Hello, Yiyuan!');
  });

  it('should greet with custom greeting and name', () => {
    expect(greet({ greeting: 'Hi', name: 'Yiyuan' })).toBe('Hi, Yiyuan!');
  });
});

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe('subtract', () => {
  it('should subtract two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  it('should handle negative results', () => {
    expect(subtract(1, 5)).toBe(-4);
  });
});
