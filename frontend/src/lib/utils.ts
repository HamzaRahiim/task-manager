import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToRgb(hex: string) {
  const value = (hex || "#6B7280").replace("#", "");
  const safe = value.length === 6 ? value : "6B7280";
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  return { r, g, b };
}

export function getBadgeStyle(color?: string) {
  const safe = color || "#6B7280";
  return {
    backgroundColor: `${safe}26`,
    borderColor: `${safe}66`,
    color: safe,
  };
}

export function debounce(callback: (...args: unknown[]) => void, delay = 300) {
  let timeout: number | undefined;
  return (...args: unknown[]) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), delay);
  };
}
