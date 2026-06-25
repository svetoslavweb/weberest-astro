export function starFill(index: number, value: number): 'full' | 'partial' | 'empty' {
  const threshold = index + 1;
  if (value >= threshold) return 'full';
  if (value + 0.25 >= threshold - 0.5) return 'partial';
  return 'empty';
}
