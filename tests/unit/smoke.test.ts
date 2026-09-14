import { describe, it, expect } from 'vitest';

describe('smoke test', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify the test runner is configured correctly', () => {
    expect(true).toBeTruthy();
  });
});
