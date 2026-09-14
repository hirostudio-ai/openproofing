import { describe, it, expect } from 'vitest';

describe('integration smoke test', () => {
  it('should pass a basic assertion', () => {
    expect(typeof process.env).toBe('object');
  });
});
