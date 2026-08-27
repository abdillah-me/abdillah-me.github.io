import { describe, it, expect } from 'vitest';
import { getTypedText } from './get-typed-text';

const lines = [
  { prefix: '$ ', text: 'whoami' },
  { prefix: '', text: 'Raka Pratama' },
];

describe('getTypedText', () => {
  it('reveals full previous lines and partial current line', () => {
    const result = getTypedText(lines, 0, 3);
    expect(result).toEqual([
      { prefix: '$ ', text: 'who', showCursor: true },
      { prefix: '', text: '', showCursor: false },
    ]);
  });

  it('shows full text with no cursor once a line is complete and index has moved on', () => {
    const result = getTypedText(lines, 1, 5);
    expect(result[0]).toEqual({ prefix: '$ ', text: 'whoami', showCursor: false });
    expect(result[1]).toEqual({ prefix: '', text: 'Raka ', showCursor: true });
  });
});
