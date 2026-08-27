export interface TerminalLine {
  prefix: string;
  text: string;
}

export interface TypedLine {
  prefix: string;
  text: string;
  showCursor: boolean;
}

export function getTypedText(lines: TerminalLine[], lineIndex: number, charIndex: number): TypedLine[] {
  return lines.map((line, i) => {
    if (i < lineIndex) return { prefix: line.prefix, text: line.text, showCursor: false };
    if (i === lineIndex) return { prefix: line.prefix, text: line.text.slice(0, charIndex), showCursor: true };
    return { prefix: '', text: '', showCursor: false };
  });
}
