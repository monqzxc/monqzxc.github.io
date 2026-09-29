export const LASER_PROGRESS_KEY = "mon-laser-campaign-progress-v1";

export function readLaserProgress(raw: string | null): number {
  if (!raw) return 1;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return 1;
    const progress = value as { version?: unknown; level?: unknown };
    return progress.version === 1 && typeof progress.level === "number" && Number.isSafeInteger(progress.level) && progress.level > 0 && progress.level < Number.MAX_SAFE_INTEGER ? progress.level : 1;
  } catch { return 1; }
}

/** Never overwrite a farther checkpoint earned in another tab. */
export function saveLaserProgress(previous: string | null, clearedLevel: number): string {
  if (!Number.isSafeInteger(clearedLevel) || clearedLevel < 1 || clearedLevel >= Number.MAX_SAFE_INTEGER - 1) throw new RangeError("Invalid cleared level");
  return JSON.stringify({ version: 1, level: Math.max(readLaserProgress(previous), clearedLevel + 1) });
}
