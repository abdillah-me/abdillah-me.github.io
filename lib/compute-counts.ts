export function computeCounts(targets: number[], progress: number): number[] {
  const clamped = Math.min(1, Math.max(0, progress));
  return targets.map((target) => Math.round(target * clamped));
}
