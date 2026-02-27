import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findOption<T extends { id: string }>(
  items: T[],
  value: string | null,
): T | null {
  if (!value) return null;
  return items.find((item) => item.id === value) ?? null;
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace any run of whitespace with a single underscore
      .replace(/\s+/g, "_")
      // Remove any character that is not a-z, 0-9, or underscore
      .replace(/[^a-z0-9_]/g, "")
      // Collapse multiple underscores into one
      .replace(/_+/g, "_")
      // Trim leading and trailing underscores (separate regexes to avoid ReDoS)
      .replace(/^_+/, "")
      .replace(/_+$/, "")
  );
}
